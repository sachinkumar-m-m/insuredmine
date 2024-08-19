const PolicyCarrier = require('../models/PolicyCarrier');
const apiResponse = require('../helper/apiResponse')

exports.getAllPolicyCarriers = async (req, res) => {
  try {
    const carriers = await PolicyCarrier.find();
    return apiResponse.successResponseWithData(res, "all policycarrier listed successfully", carriers)
  } catch (err) {
    return apiResponse.somethingResponse(res, "Server Error", err)
  }
};


exports.createPolicyCarrier = async (req, res) => {
  try {
    const carrier = new PolicyCarrier(req.body);
    await carrier.save();
    return apiResponse.successResponseWithData(res, "carrier created successfully", carrier)
  } catch (err) {
    return apiResponse.somethingResponse(res, "Server Error", err)
  }
};
