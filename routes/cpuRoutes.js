const express = require('express');
const router = express.Router();
const cpuController = require('../controllers/cpuController');

router.get('/cpu-usage', cpuController.trackCpuUsage);

module.exports = router;
