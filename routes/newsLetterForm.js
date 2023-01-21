const router = require("express").Router();

const newsLetterForm = require("../models/NewsLetterForm")
const logger = require("../config/logger");
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");

// POST FORM
router.post("/submit", async (request, response) => {
    try {
        emailID = request.body.email_id;
        current_time = Date.now();
        formID = current_time+"Form"+email_id;

        const newForm = new newsLetterForm(
            {
                news_letter_form_id: formID,
                applicant_name: request.body.applicant_name,
                email_id: emailID,
            }
        );
            
        const savedForm = await newForm.save();
        logger.info("New Form created" + savedForm);
        response.status(201).json(savedForm);
    } catch (error) {
        response.status(500).json("Could not submit the from.");
        logger.error("Form Submission Failed: " + error.message);
        }
});

// DELETE FORM
router.delete("/delete/:form_id", verifyTokenAndAdmin, async (request, response) => {
    news_letter_form_id = request.params.form_id;
    try {
        const newsLetter_form = await newsLetterForm.findOne({
            form_id: form_id,
        });
        if(newsLetter_form){
            const deletedNewsLetterForm = await newsLetterForm.findByIdAndDelete(newsLetter_form.id);
            logger.info("News Letter Form deletion initiated: " + form_id + "\nNews Letter Form Details:\n"+ JSON.stringify(deletedNewsLetterForm));
            response.status(200).json("News Letter Form has been deleted");
            logger.info("News Letter Form has been deleted: " + form_id);
        } else{
            response.status(500).json("No such News Letter Form exists!");
            logger.info("Non existing News Letter Form tried to update its information: " + form_id)
        }
    } catch(error) {
        response.status(500).json("Cannot delete News Letter Form");
        logger.error("Cannot delete News Letter Form: " + form_id + " error: " + error.message);
      }
});

// GET FORM
router.get("/find/:user_id/:form_id", verifyTokenAndAuthorization, async (request, response) => {
    news_letter_form_id = request.params.form_id;
    user_id = request.params.user_id;
    try {
        const newsLetter_form = await newsLetterForm.findOne({
            news_letter_form_id: news_letter_form_id,
        });
        if(newsLetter_form){
            const getNewsLetterForm = await newsLetterForm.findById(newsLetter_form.id);
            logger.info("newsLetter Form details Requested: " + news_letter_form_id + "\nNews Letter Form Details:\n"+ JSON.stringify(getNewsLetterForm));
            response.status(200).json(getNewsLetterForm);
        } else{
            response.status(500).json("No such News Letter Form exists!")
            logger.info("Tried to get non existing News Letter Form: " + newsLetter_form_id)
        }
    } catch(error) {
        response.status(500).json("News Letter Form details cannot be accessed");
        logger.error("News Letter Form details cannot be accessed by: " + request.user.id + " error: " + error.message);
      }
});

// GET ALL FORMS
router.get("/:user_id", verifyTokenAndAuthorization, async (request, response) => {
    user_id = request.params.user_id;
    const query = request.query.new;
    try {
        const newsLetterForms = query
        ? await newsLetterForm.find().sort({ form_id: -1 }).limit(100)
        : await newsLetterForm.find();
        logger.info(newsLetterForms);
        response.status(200).json(newsLetterForms);
    } catch(error) {
        response.status(500).json("News Letter Form details cannot be accessed");
        logger.error("News Letter Form details cannot be accessed by: " + request.user.id + " error: " + error.message);
      }
});

module.exports = router