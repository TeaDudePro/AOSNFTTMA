import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import TONConnect from './components/TONConnect';
import NFTList from './components/NFTList';
import LoadingSpinner from './components/LoadingSpinner';
import useMobileDetection from './hooks/useMobileDetection';
import './styles/main.css';

function App() {
    const [userAddress, setUserAddress] = useState(null);
    const [balance, setBalance] = useState('0');
    const [nfts, setNfts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const { isMobile, isTelegram } = useMobileDetection();

    useEffect(() => {
        // Инициализация Telegram Web App
        const tg = window.Telegram?.WebApp;
        if (tg) {
            tg.expand();
            tg.ready();
            
            // Установка цвета кнопки в соответствии с темой Telegram
            if (tg.colorScheme === 'dark') {
                tg.setHeaderColor('#1c1c1c');
                tg.setBackgroundColor('#1c1c1c');
            } else {
                tg.setHeaderColor('#ffffff');
                tg.setBackgroundColor('#ffffff');
            }
        }

        loadNFTs();
    }, []);

    const loadNFTs = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Имитация загрузки данных
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            const mockNFTs = [
                {
                    id: 1,
                    name: "TON Diamond NFT",
                    description: "Exclusive diamond edition TON NFT with unique properties and metadata",
                    price: "0.5",
                    image: "https://picsum.photos/300/300?random=1",
                    collection: "TON Diamonds",
                    address: "EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N",
                    sellerAddress: "EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
                },
                {
                    id: 2,
                    name: "CryptoPunk TON Edition", 
                    description: "TON blockchain version of the iconic CryptoPunk collection",
                    price: "1.2",
                    image: "https://picsum.photos/300/300?random=2",
                    collection: "TON Punks",
                    address: "EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N",
                    sellerAddress: "EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
                },
                {
                    id: 3,
                    name: "Digital Art #001",
                    description: "Unique digital art piece created exclusively for TON blockchain",
                    price: "0.8",
                    image: "https://picsum.photos/300/300?random=3",
                    collection: "Digital Arts",
                    address: "EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N",
                    sellerAddress: "EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
                }
            ];
            
            setNfts(mockNFTs);
        } catch (err) {
            console.error('Failed to load NFTs:', err);
            setError('Failed to load NFTs. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleRetry = () => {
        loadNFTs();
    };

    return (
        <TonConnectUIProvider 
            manifestUrl={window.location.origin + "/tonconnect-manifest.json"}
            actionsConfiguration={{
                twaReturnUrl: isTelegram ? 'https://t.me/YourBotUsername' : window.location.href
            }}
            uiPreferences={{ theme: isTelegram ? 'DARK' : 'SYSTEM' }}
        >
            <div className={`app ${isMobile ? 'mobile' : ''} ${isTelegram ? 'telegram' : ''}`}>
                <header className="app-header">
                    <h1>AOS NFT STORE</h1>
                    <div className="environment-badge">
                        {isTelegram ? '📱 Telegram' : '🌐 Web'} 
                        {isMobile && ' • Mobile'}
                    </div>
                    
                    <TONConnect 
                        onConnect={setUserAddress}
                        onBalanceUpdate={setBalance}
                    />
                    
                    {userAddress && (
                        <div className="balance-info">
                            💎 Balance: <strong>{balance} TON</strong>
                        </div>
                    )}
                </header>
                
                <main>
                    {error ? (
                        <div className="error-state">
                            <div className="error-icon">⚠️</div>
                            <h3>Something went wrong</h3>
                            <p>{error}</p>
                            <button className="retry-button" onClick={handleRetry}>
                                Try Again
                            </button>
                        </div>
                    ) : (
                        <NFTList 
                            nfts={nfts} 
                            userAddress={userAddress}
                            loading={loading}
                        />
                    )}
                </main>
                
                <footer className="app-footer">
                    <p>Powered by TON Blockchain • Secure NFT Trading</p>
                </footer>
            </div>
        </TonConnectUIProvider>
    );
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);