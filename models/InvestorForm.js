const mongoose = require("mongoose");

// Declaring schemas

const InvestorFormSchema = new mongoose.Schema(
    {
        investor_form_id: {type: String, required: true},
        applicant_name: {type: String, required: true},
        email_id: {type: String, required: true},
        phone_number: {type: String, required: true},
        linkedin_profile_id: {type: String, required: true},
        experience: {type: String, required: true},
        reason: {type: String, required: true},
        investment: {type: String, required: true},
        note: {type: String, required: false},
        know_us: {type: String, required: true},
    },
    { timestamps: true }
);

// Creating models
InvestorForm = mongoose.model("InvestorForm", InvestorFormSchema);

// Exporting all the models
module.exports = InvestorForm;