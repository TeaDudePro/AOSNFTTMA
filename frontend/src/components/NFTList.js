import React, { useState } from 'react';
import NFTCard from './NFTCard';
import LoadingSpinner from './LoadingSpinner';
import Modal from './Modal';

const NFTList = ({ nfts, userAddress, loading }) => {
    const [processingTransaction, setProcessingTransaction] = useState(null);
    const [transactionStatus, setTransactionStatus] = useState(null);
    const [selectedNFT, setSelectedNFT] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    const handleBuy = async (nft) => {
        if (!userAddress) {
            setTransactionStatus({ 
                type: 'error', 
                message: 'Please connect your wallet first!' 
            });
            return;
        }

        setProcessingTransaction(nft.id);
        setTransactionStatus({ type: 'info', message: 'Processing transaction...' });

        try {
            const response = await fetch('http://localhost:3001/api/transactions/purchase', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    buyerAddress: userAddress,
                    sellerAddress: nft.sellerAddress || 'EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N',
                    nftPrice: nft.price,
                    nftAddress: nft.address
                })
            });

            const result = await response.json();

            if (result.success) {
                setTransactionStatus({ 
                    type: 'success', 
                    message: `🎉 Successfully purchased ${nft.name}!` 
                });
                
                // Показать попап успеха в Telegram
                if (window.Telegram && window.Telegram.WebApp) {
                    window.Telegram.WebApp.showPopup({
                        title: 'Purchase Successful! 🎉',
                        message: `You bought "${nft.name}" for ${nft.price} TON`,
                        buttons: [{ type: 'ok' }]
                    });
                }

                // Автоматически скрыть сообщение об успехе через 5 секунд
                setTimeout(() => {
                    setTransactionStatus(null);
                }, 5000);
            } else {
                setTransactionStatus({ 
                    type: 'error', 
                    message: `❌ Transaction failed: ${result.error}` 
                });
            }
        } catch (error) {
            setTransactionStatus({ 
                type: 'error', 
                message: `🌐 Network error: ${error.message}` 
            });
        } finally {
            setProcessingTransaction(null);
        }
    };

    const handleViewDetails = (nft) => {
        setSelectedNFT(nft);
        setShowDetailsModal(true);
    };

    if (loading) {
        return <LoadingSpinner message="Loading NFTs..." />;
    }

    if (!nfts || nfts.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-icon">🖼️</div>
                <h3>No NFTs Found</h3>
                <p>There are no NFTs available at the moment.</p>
            </div>
        );
    }

    return (
        <div className="nft-list">
            {transactionStatus && (
                <div className={`transaction-status ${transactionStatus.type}`}>
                    {transactionStatus.message}
                </div>
            )}
            
            {nfts.map(nft => (
                <NFTCard 
                    key={nft.id} 
                    nft={nft}
                    userAddress={userAddress}
                    onBuy={handleBuy}
                    onViewDetails={handleViewDetails}
                />
            ))}

            <Modal 
                isOpen={showDetailsModal}
                onClose={() => setShowDetailsModal(false)}
                title={selectedNFT?.name}
            >
                {selectedNFT && (
                    <div className="nft-details">
                        <img 
                            src={selectedNFT.image} 
                            alt={selectedNFT.name}
                            className="details-image"
                        />
                        <div className="details-content">
                            <p className="details-description">{selectedNFT.description}</p>
                            <div className="details-meta">
                                <div className="meta-item">
                                    <strong>Collection:</strong>
                                    <span>{selectedNFT.collection}</span>
                                </div>
                                <div className="meta-item">
                                    <strong>Price:</strong>
                                    <span className="price-tag">{selectedNFT.price} TON</span>
                                </div>
                            </div>
                            <button 
                                className="buy-button large"
                                onClick={() => {
                                    handleBuy(selectedNFT);
                                    setShowDetailsModal(false);
                                }}
                                disabled={!userAddress}
                            >
                                {!userAddress ? 'Connect Wallet to Buy' : `Buy for ${selectedNFT.price} TON`}
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default NFTList;