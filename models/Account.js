const mongoose = require('mongoose');


const AccountSchema = new mongoose.Schema({
    accountName: {
        type: String,
        required: true,
        unique: true
    }
});



module.exports = mongoose.model('accounts', AccountSchema);