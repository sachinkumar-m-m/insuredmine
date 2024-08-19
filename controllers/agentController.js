const Agent = require('../models/Agent');
const apiResponse =  require('../helper/apiResponse')


exports.createAgent = async (req, res) => {
    try {
        const agentData = req.body;
        const newAgent = new Agent(agentData);
        await newAgent.save();
        return apiResponse.successResponseWithData(res,"Agent created successfully",newAgent)

    } catch (err) {
        return apiResponse.somethingResponse(res, "create agent not created", err)
    }
};


exports.getAgentById = async (req, res) => {
    try {
        const agent = await Agent.findById(req.params.id);

        if (!agent) return res.status(404).json({ message: 'Agent not found' });
        apiResponse.successResponseWithData(res,"Agent listed successfylly",agent)
    } catch (err) {
        return apiResponse.somethingResponse(res, "agent not found", err)
    }
};

exports.getAllAgents = async (req, res) => {
    try {
        const agents = await Agent.find();
        apiResponse.successResponseWithData(res,"All Agent listed successfylly",agents)
    } catch (err) {
        return apiResponse.somethingResponse(res, "agents not found", err)
    }
};
