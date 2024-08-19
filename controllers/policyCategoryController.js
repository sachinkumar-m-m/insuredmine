const PolicyCategory = require('../models/PolicyCategory');
const apiResponse = require('../helper/apiResponse')

exports.getAllPolicyCategories = async (req, res) => {
  try {
    const categories = await PolicyCategory.find();
    return apiResponse.successResponseWithData(res, "categories listed successfully", categories)
  } catch (err) {
    return apiResponse.somethingResponse(res, "Server Error'", err)
  }
};


exports.createPolicyCategory = async (req, res) => {
  try {
    const category = new PolicyCategory(req.body);
    await category.save();
    return apiResponse.successResponseWithData(res, "PolicyCategory created successfully", category)
  } catch (err) {
    return apiResponse.somethingResponse(res, "categories not created", err)
  }
};
