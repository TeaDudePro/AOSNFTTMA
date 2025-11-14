import React from 'react';
import { TonConnectButton, useTonWallet, useTonConnectUI } from '@tonconnect/ui-react';

const TONConnect = ({ onConnect, onBalanceUpdate }) => {
    const wallet = useTonWallet();
    const [tonConnectUI] = useTonConnectUI();

    React.useEffect(() => {
        if (wallet) {
            onConnect(wallet.account.address);
            // Здесь можно добавить получение реального баланса
            fetchBalance(wallet.account.address);
        }
    }, [wallet]);

    const fetchBalance = async (address) => {
        try {
            // Временная заглушка - в реальности нужно интегрироваться с TON API
            const mockBalance = "2.5";
            onBalanceUpdate(mockBalance);
        } catch (error) {
            console.error('Failed to fetch balance:', error);
        }
    };

    return (
        <div className="ton-connect-wrapper">
            <TonConnectButton />
            {wallet && (
                <div className="wallet-info">
                    <p>Connected: {wallet.account.address.slice(0, 8)}...{wallet.account.address.slice(-8)}</p>
                    <p>Chain: {wallet.account.chain}</p>
                </div>
            )}
        </div>
    );
};

export default TONConnect;