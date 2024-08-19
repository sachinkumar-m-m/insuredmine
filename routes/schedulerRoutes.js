
const express = require('express');
const { scheduleMessageHandler } = require('../services/scheduler');

const router = express.Router();

router.post('/scheduleMessage', scheduleMessageHandler);

module.exports = router;
