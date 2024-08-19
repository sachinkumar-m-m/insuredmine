const mongoose = require('mongoose');

const PolicySchema = new mongoose.Schema({
    policyNumber: {
         type: String,
        required: true 
    },
    policyStartDate: { 
        type: Date, 
        required: true 
    },
    policyEndDate: {
         type: Date, 
         required: true
    },
    policyType:{
        type: String,
        required: true 
    },
    policyMode:{
        type: String,
        required: true 
    },
    premiumAmount:{
        type: Number,
        required: true
    },
    agencyId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'agent',
        required: true 
    },
    policyCategoryId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'PolicyCategory',
         required: true 
    },
    companyCollectionId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PolicyCarrier',
        required: true 
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    hasActiveClientPolicy:{
        type: Boolean,
        default: true
    }
});



module.exports = mongoose.model('policies', PolicySchema);