const express = require('express');
const TONService = require('../services/ton-service');
const router = express.Router();

const tonService = new TONService();

// Получение NFT по владельцу
router.get('/owner/:ownerAddress', async (req, res) => {
    try {
        const { ownerAddress } = req.params;
        const nfts = await tonService.getNFTsByOwner(ownerAddress);
        
        res.json({
            success: true,
            data: nfts,
            count: nfts.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Получение информации о конкретном NFT
router.get('/:nftAddress', async (req, res) => {
    try {
        const { nftAddress } = req.params;
        const nft = await tonService.getNFTDetails(nftAddress);
        
        if (!nft) {
            return res.status(404).json({
                success: false,
                error: 'NFT not found'
            });
        }
        
        res.json({
            success: true,
            data: nft
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Получение популярных NFT (заглушка)
router.get('/', async (req, res) => {
    try {
        // Временные данные - в реальности нужно получать из маркетплейса
        const popularNFTs = [
            {
                id: 1,
                name: "TON Diamond NFT",
                description: "Exclusive diamond edition",
                price: "0.5",
                image: "https://via.placeholder.com/300",
                collection: "TON Diamonds",
                address: "EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N"
            },
            {
                id: 2,
                name: "CryptoPunk TON", 
                description: "TON version of CryptoPunk",
                price: "1.2",
                image: "https://via.placeholder.com/300",
                collection: "TON Punks",
                address: "EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N"
            }
        ];
        
        res.json({
            success: true,
            data: popularNFTs,
            count: popularNFTs.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;