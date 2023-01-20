const router = require("express").Router();
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

const logger = require("../config/logger");
const User = require("../models/User")

// Register User
router.post("/sign_up", async (request,response) => {
    try {
        email = request.body.email;

        const user = await User.findOne({
            email: email,
        });

        if(user){
            logger.info("Already existing user tried to sign_up: " + user.email);
            response.status(400).json("User already exists!");
        } else{
            phoneNumber = request.body.phone_number;
            userID = "User"+phoneNumber;

            password = CryptoJS.AES.encrypt(request.body.password, process.env.PASSWORD_SECRET_KEY).toString();

            const newUser = new User(
                {
                    user_id: userID,
                    user_name: request.body.username,
                    phone_number: phoneNumber,
                    email: request.body.email,
                    password: password,
                }
            );
            
            const savedUser = await newUser.save();
            logger.info("New user created" + savedUser);
            response.status(201).json(savedUser);
        }
    } catch (error) {
        response.status(500).json("Could not register new user");
        logger.error("User registration failed: " + error.message);
        }
});

router.post("/login", async (request,response) => {
    try {
        email = request.body.email;

        const user = await User.findOne({
            email: email,
        });

        // !user && response.status(401).json("Wrong Credentials!");
        if(!user) {
            response.status(401).json("Wrong Credentials!");
            logger.warn("Login tried with wrong email: " + email);
        }
        else {
            const hashedPassword = await CryptoJS.AES.decrypt(
                user.password, 
                process.env.PASSWORD_SECRET_KEY,
            );
    
            const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
            
            // password !== request.body.password && response.status(401).json("Wrong Credentials!");
            if(originalPassword !== request.body.password) {
                response.status(401).json("Wrong Credentials!");
                logger.warn("Somebody trying to login into: " + user.email);
            }
            else {
                const accessToken = jwt.sign(
                    {
                        id: user.user_id,
                        isAdmin: user.isAdmin,
                    },
                    process.env.JWT_SECRET_KEY,
                    {expiresIn: "30d"},
                );
                
                const {password, isAdmin, _id, ...others} = user._doc;
                response.status(200).json({...others, accessToken});
                logger.info("User Login: " + user.email);
            }
        }
       
    } catch (error) {
        response.status(500).json(error.message);
        logger.error(error.message);
    }
});

module.exports = router;