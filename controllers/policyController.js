const Policy = require('../models/Policy');
const apiResponse = require('../helper/apiResponse')

exports.getAllPolicies = async (req, res) => {
  try {
    const policies = await Policy.find().populate('policyCategory company user');
    return apiResponse.successResponseWithData(res, "policies's listed successfully", policies)
  } catch (err) {
    return apiResponse.somethingResponse(res, "server error", err)
  }
};

exports.createPolicy = async (req, res) => {
  try {
    const policy = new Policy(req.body);
    await policy.save();
    return apiResponse.successResponseWithData(res, "policy created successfully", policy)
  } catch (err) {
    return apiResponse.somethingResponse(res, "server error", err)
  }
};


exports.searchPolicyByUser = async (req, res) => {
  try {
    const policies = await Policy.find({ userId: req.params.userId })
    return apiResponse.successResponseWithData(res, "policy found successfully", policies)
  } catch (err) {
    return apiResponse.somethingResponse(res, "server error", err)
  }
};

exports.getAggregatedPolicyByUser = async (req, res) => {
  try {
    const policies = await Policy.aggregate([
      {
        $group: {
          _id: "$user",
          totalPolicies: { $sum: 1 },
          policies: { $push: "$$ROOT" }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails"
        }
      }
    ]);
    return apiResponse.successResponseWithData(res, "policy found successfully", policies)
  } catch (err) {
    return apiResponse.somethingResponse(res, "server error", err)
  }
};
