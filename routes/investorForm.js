const router = require("express").Router();

const investorForm = require("../models/InvestorForm")
const logger = require("../config/logger");
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");

// POST FORM
router.post("/submit", async (request, response) => {
    try {
        phoneNumber = request.body.phone_number;
        current_time = Date.now();
        formID = current_time+"Form"+phoneNumber;

        const newForm = new investorForm(
            {
                investor_form_id: formID,
                applicant_name: request.body.applicant_name,
                email_id: request.body.email_id,
                phone_number: phoneNumber,
                linkedin_profile_id: request.body.linkedin_profile_id,
                experience: request.body.experience,
                reason: request.body.reason,
                investment: request.body.investment,
                note: request.body.note,
                know_us: request.body.know_us,
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
    form_id = request.params.form_id;
    try {
        const investor_form = await investorForm.findOne({
            investor_form_id: form_id,
        });
        if(investor_form){
            const deletedInvestorForm = await investorForm.findByIdAndDelete(investor_form.id);
            logger.info("Investor Form deletion initiated: " + form_id + "\ninvestor Form Details:\n"+ JSON.stringify(deletedInvestorForm));
            response.status(200).json("Investor Form has been deleted");
            logger.info("Investor Form has been deleted: " + form_id);
        } else{
            response.status(500).json("No such Investor Form exists!")
            logger.info("Non existing Investor Form tried to update its information: " + form_id)
        }
    } catch(error) {
        response.status(500).json("Cannot delete investor Form");
        logger.error("Cannot delete investor Form: " + form_id + " error: " + error.message);
      }
});

// GET FORM
router.get("/find/:user_id/:form_id", verifyTokenAndAuthorization, async (request, response) => {
    investor_form_id = request.params.form_id;
    user_id = request.params.user_id;
    try {
        const investor_form = await investorForm.findOne({
            investor_form_id: investor_form_id,
        });
        if(investor_form){
            const getInvestorForm = await investorForm.findById(investor_form.id);
            logger.info("Investor Form details Requested: " + investor_form_id + "\nInvestor Form Details:\n"+ JSON.stringify(getInvestorForm));
            response.status(200).json(getInvestorForm);
        } else{
            response.status(500).json("No such investor Form exists!")
            logger.info("Tried to get non existing investor Form: " + investor_form_id)
        }
    } catch(error) {
        response.status(500).json("Investor Form details cannot be accessed");
        logger.error("Investor Form details cannot be accessed by: " + request.user.id + " error: " + error.message);
      }
});

// GET ALL FORMS
router.get("/:user_id", verifyTokenAndAuthorization, async (request, response) => {
    user_id = request.params.user_id;
    const query = request.query.new;
    try {
        const investorForms = query
        ? await investorForm.find().sort({ form_id: -1 }).limit(100)
        : await investorForm.find();
        logger.info(investorForms);
        response.status(200).json(investorForms);
    } catch(error) {
        response.status(500).json("Investor Form details cannot be accessed");
        logger.error("Investor Form details cannot be accessed by: " + request.user.id + " error: " + error.message);
      }
});

module.exports = router