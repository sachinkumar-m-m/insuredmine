const express = require('express');
const router = express.Router();
const policyCategoryController = require('../controllers/policyCategoryController');

router.get('/', policyCategoryController.getAllPolicyCategories);
router.post('/', policyCategoryController.createPolicyCategory);

module.exports = router;
