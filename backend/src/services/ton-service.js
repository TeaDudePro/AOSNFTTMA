const axios = require('axios');
const { Address } = require('@ton/ton');

class TONService {
    constructor() {
        this.tonApiUrl = 'https://tonapi.io/v2';
        this.tonCenterUrl = 'https://toncenter.com/api/v2';
    }

    // Получение баланса кошелька
    async getBalance(address) {
        try {
            const response = await axios.get(`${this.tonApiUrl}/accounts/${address}`);
            return response.data.balance;
        } catch (error) {
            console.error('Error fetching balance:', error);
            throw new Error('Failed to fetch balance');
        }
    }

    // Получение NFT по адресу владельца
    async getNFTsByOwner(ownerAddress) {
        try {
            const response = await axios.get(`${this.tonApiUrl}/accounts/${ownerAddress}/nfts`, {
                params: {
                    limit: 50,
                    offset: 0
                }
            });
            
            return response.data.nft_items.map(nft => ({
                id: nft.address,
                name: nft.metadata?.name || 'Unnamed NFT',
                description: nft.metadata?.description || '',
                image: this.parseImageUrl(nft.metadata?.image),
                collection: nft.collection?.name || 'No Collection',
                address: nft.address,
                owner: ownerAddress
            }));
        } catch (error) {
            console.error('Error fetching NFTs:', error);
            return [];
        }
    }

    // Получение информации о конкретном NFT
    async getNFTDetails(nftAddress) {
        try {
            const response = await axios.get(`${this.tonApiUrl}/nfts/${nftAddress}`);
            const nft = response.data;
            
            return {
                id: nft.address,
                name: nft.metadata?.name || 'Unnamed NFT',
                description: nft.metadata?.description || '',
                image: this.parseImageUrl(nft.metadata?.image),
                collection: nft.collection?.name || 'No Collection',
                address: nft.address,
                owner: nft.owner?.address
            };
        } catch (error) {
            console.error('Error fetching NFT details:', error);
            return null;
        }
    }

    parseImageUrl(image) {
        if (!image) return 'https://via.placeholder.com/300';
        
        if (image.startsWith('ipfs://')) {
            return `https://ipfs.io/ipfs/${image.replace('ipfs://', '')}`;
        }
        
        return image;
    }
}

module.exports = TONService;