const mongoose = require('mongoose');


const PolicyCategorySchema = new mongoose.Schema({
    categoryName: {
        type: String,
        required: true,
        unique: true
    }
});



module.exports = mongoose.model('policycategories', PolicyCategorySchema);