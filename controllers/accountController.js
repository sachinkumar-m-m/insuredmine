const Account = require('../models/Account');
const apiResponse = require('../helper/apiResponse')

exports.getAllAccounts = async (req, res) => {
  try {
    const accounts = await Account.find();
    res.json(accounts);
    return apiResponse.successResponseWithData(res, "account's listed successfully", accounts)
  } catch (err) {
    return apiResponse.somethingResponse(res, "account's not found", err)
  }
};

exports.createAccount = async (req, res) => {
  try {
    const account = new Account(req.body);
    await account.save();
    res.json(account);
    return apiResponse.successResponseWithData(res, "account created successfully", accounts)
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
    return apiResponse.somethingResponse(res, "account is not created", err)
  }
};
