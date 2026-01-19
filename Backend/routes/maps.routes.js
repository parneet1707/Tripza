const express = require('express');
const router = express.Router();
const mapsService = require('../services/maps.service');

// Example route for getting map data
router.get('/data', async (req, res) => {
    try {
        const data = await mapsService.getMapData();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching map data', error: error.message });
    }
});

module.exports = router;