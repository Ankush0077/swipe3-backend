const router = require("express").Router();

const jobForm = require("../models/JobForm")
const logger = require("../config/logger");
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");

// POST FORM
router.post("/submit", async (request, response) => {
    try {
        phoneNumber = request.body.phone_number;
        current_time = Date.now();
        formID = current_time+"Form"+phoneNumber;

        const newForm = new jobForm(
            {
                job_form_id: formID,
                applicant_name: request.body.applicant_name,
                email_id: request.body.email_id,
                phone_number: phoneNumber,
                current_city: request.body.current_city,
                current_role: request.body.current_role,
                linkedin_profile_id: request.body.linkedin_profile_id,
                date_of_birth: request.body.date_of_birth,
                resume: request.body.resume,
                cover_letter: request.body.cover_letter,
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
        const job_form = await jobForm.findOne({
            job_form_id: form_id,
        });
        if(job_form){
            const deletedJobForm = await jobForm.findByIdAndDelete(job_form.id);
            logger.info("Job Form deletion initiated: " + form_id + "\nJob Form Details:\n"+ JSON.stringify(deletedJobForm));
            response.status(200).json("Job Form has been deleted");
            logger.info("Job Form has been deleted: " + form_id);
        } else{
            response.status(500).json("No such jobForm exists!")
            logger.info("Non existing Job Form tried to update its information: " + form_id)
        }
    } catch(error) {
        response.status(500).json("Cannot delete Job Form");
        logger.error("Cannot delete Job Form: " + form_id + " error: " + error.message);
      }
});

// GET FORM
router.get("/find/:user_id/:form_id", verifyTokenAndAuthorization, async (request, response) => {
    job_form_id = request.params.form_id;
    user_id = request.params.user_id;
    try {
        const job_form = await jobForm.findOne({
            job_form_id: job_form_id,
        });
        if(job_form){
            const getJobForm = await jobForm.findById(job_form.id);
            logger.info("Job Form details Requested: " + job_form_id + "\nJob Form Details:\n"+ JSON.stringify(getJobForm));
            response.status(200).json(getJobForm);
        } else{
            response.status(500).json("No such Job Form exists!")
            logger.info("Tried to get non existing Job Form: " + job_form_id)
        }
    } catch(error) {
        response.status(500).json("Job Form details cannot be accessed");
        logger.error("Job Form details cannot be accessed by: " + request.user.id + " error: " + error.message);
      }
});

// GET ALL FORMS
router.get("/:user_id", verifyTokenAndAuthorization, async (request, response) => {
    user_id = request.params.user_id;
    const query = request.query.new;
    try {
        const jobForms = query
        ? await jobForm.find().sort({ form_id: -1 }).limit(100)
        : await jobForm.find();
        logger.info(jobForms);
        response.status(200).json(jobForms);
    } catch(error) {
        response.status(500).json("Job Form details cannot be accessed");
        logger.error("Job Form details cannot be accessed by: " + request.user.id + " error: " + error.message);
      }
});

module.exports = router