const express = require('express');
const router = express.Router();
const policyCarrierController = require('../controllers/policyCarrierController');

router.get('/', policyCarrierController.getAllPolicyCarriers);
router.post('/', policyCarrierController.createPolicyCarrier);

module.exports = router;
