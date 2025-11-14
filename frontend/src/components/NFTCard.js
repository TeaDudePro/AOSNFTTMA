import React, { useState } from 'react';

const NFTCard = ({ nft, userAddress, onBuy }) => {
    const [imageError, setImageError] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const handleImageError = () => {
        setImageError(true);
    };

    const getFallbackImage = () => {
        return `https://via.placeholder.com/300/0088cc/ffffff?text=${encodeURIComponent(nft.name)}`;
    };

    return (
        <div 
            className={`nft-card ${isHovered ? 'hovered' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="nft-image-container">
                <img 
                    src={imageError ? getFallbackImage() : nft.image} 
                    alt={nft.name}
                    className="nft-image"
                    onError={handleImageError}
                    loading="lazy"
                />
                <div className="nft-overlay">
                    <button 
                        className="view-details-btn"
                        onClick={() => {/* TODO: Добавить модалку с деталями */}}
                    >
                        👁️ View
                    </button>
                </div>
            </div>
            
            <div className="nft-content">
                <h3 className="nft-title">{nft.name}</h3>
                <p className="nft-description">{nft.description}</p>
                
                <div className="nft-meta">
                    <span className="nft-collection">
                        <span className="collection-badge">{nft.collection}</span>
                    </span>
                    <div className="nft-price-section">
                        <span className="price-label">Price</span>
                        <div className="price-amount">
                            <span className="ton-icon">💎</span>
                            <span className="price">{nft.price} TON</span>
                        </div>
                    </div>
                </div>
                
                <button 
                    className={`buy-button ${!userAddress ? 'disabled' : ''}`}
                    onClick={() => onBuy(nft)}
                    disabled={!userAddress}
                >
                    {!userAddress ? 'Connect Wallet to Buy' : 'Buy Now'}
                </button>
            </div>
        </div>
    );
};

export default NFTCard;