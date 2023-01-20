const mongoose = require("mongoose");

// Declaring schemas

const JobFormSchema = new mongoose.Schema(
    {
        job_form_id: {type: String, required: true},
        applicant_name: {type: String, required: true},
        email_id: {type: String, required: true},
        phone_number: {type: String, required: true},
        current_city: {type: String, required: true},
        current_role: {type: String, required: false},
        linkedin_profile_id: {type: String, required: true},
        date_of_birth: {type: String, required: true},
        resume: {type: String, required: true},
        cover_letter: {type: String, required: true},
        know_us: {type: String, required: true},
    },
    { timestamps: true }
);

// Creating models
JobForm = mongoose.model("JobForm", JobFormSchema);

// Exporting all the models
module.exports = JobForm;