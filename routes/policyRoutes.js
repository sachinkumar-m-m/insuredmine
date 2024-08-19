const express = require('express');
const router = express.Router();
const policyController = require('../controllers/policyController');

router.get('/', policyController.getAllPolicies);
router.post('/', policyController.createPolicy);
router.get('/search/:userId', policyController.searchPolicyByUser);
router.get('/aggregate', policyController.getAggregatedPolicyByUser);

module.exports = router;
