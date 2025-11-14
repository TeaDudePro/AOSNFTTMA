const express = require('express');
const TONService = require('../services/ton-service');
const router = express.Router();

const tonService = new TONService();

router.get('/balance/:address', async (req, res) => {
    try {
        const { address } = req.params;
        const balance = await tonService.getBalance(address);
        
        res.json({
            success: true,
            data: {
                address,
                balance: (balance / 1000000000).toFixed(2) // Конвертация из нанотоннов
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;