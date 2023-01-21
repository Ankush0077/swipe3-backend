const mongoose = require("mongoose");

// Declaring schemas

const NewsLetterFormSchema = new mongoose.Schema(
    {
        news_letter_form_id: {type: String, required: true},
        applicant_name: {type: String, required: true},
        email_id: {type: String, required: true},
    },
    { timestamps: true }
);

// Creating models
NewsLetterForm = mongoose.model("NewsLetterForm", NewsLetterFormSchema);

// Exporting all the models
module.exports = NewsLetterForm;