const express = require('express');
const router = express.Router();
const {
    createAgent,
    getAgentById,
    getAllAgents
} = require('../controllers/agentController');

// Create a new agent
router.post('/', createAgent);

// Get agent by ID
router.get('/:id', getAgentById);

// Get all agents
router.get('/', getAllAgents);

module.exports = router;
