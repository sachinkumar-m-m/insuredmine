const User = require('../models/User');
const apiResponse = require('../helper/apiResponse')

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    return apiResponse.successResponseWithData(res, "user's listed successfully", users)
  } catch (err) {
    return apiResponse.somethingResponse(res, "server error", err)
  }
};

exports.createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    return apiResponse.successResponseWithData(res, "user created successfully", user)
  } catch (err) {
    return apiResponse.somethingResponse(res, "server error", err)
  }
};
