const randtoken = require('rand-token');
const passport = require('passport');
const { validationResult } = require('express-validator');

let userService = require("../../services/userService");
let tokenService = require("../../services/tokenService");
let { sendMail } = require("../../services/emailService");

let authController = {
    registerUser: async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(422).send(errors.array());
        }
        try {
            let {fullName, email, password} = req.body;

            let token = randtoken.generate(10);
            await userService.create({
                full_name: fullName,
                email, password, token,
                token_expiry: new Date().getTime() + (1*60*60*1000)
            });

            let emailDetails = {
                to: email,
                subject: "Activate account",
                html: "Dear "+fullName+",<br>Your account is created in our application. Your token to activate your account is: <br>"+token+"<br><br>Thank you."
            };
            sendMail(emailDetails);

            return res.status(201).json({"message": "User created successsfully. Please check your email for token to verify your account."});
        } catch (error) {
            next(error);
        }
    },

    activateUser: async(req, res, next) => {
        try {
            let token = req.params.token;
            if(!token) {
                return res.status(400).send({"error": "Token is required"});
            }

            let user = await userService.findOne({token: token});
            if (!user) {
                return res.status(400).send({"error": "Token is invalid"});
            }
            if (user.tokenExpiry < new Date()) {
                return res.status(400).send({"error": "Token is expired"});
            }
            let updateData = {
                status: "active",
                token: "",
                tokenExpiry: null
            }
            await userService.findOneAndUpdate({_id: user._id}, updateData);

            return res.status(200).send({"message": "Your account is activated. Please login to continue."});
        } catch (error) {
            next(error);
        }
    },
    loginUser: async(req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(422).send(errors.array());
        }
        await passport.authenticate('local', async(err, user, info) => {
            if (err) {
                throw new Error(err.message);
            }
            if (info && info.message) {
                return res.status(400).json({error: info.message});
            }
            if (user) {
                let token = randtoken.generate(250);
                let refreshToken = randtoken.generate(250);
                let expiryDate =  new Date().getTime() + (1*60*60*1000);
                let tokenData = {
                    'token': token,
                    'token_expiry': new Date(expiryDate),
                    'refresh_token': refreshToken,
                    'refresh_token_expiry': new Date(expiryDate),
                    'user_id': user._id
                };
                let tokenDetails = await tokenService.create(tokenData);

                return res.status(200).json({status: "success", data: {
                    'access_token': tokenDetails.token,
                    'refresh_token': tokenDetails.refresh_token,
                    'expires_in': expiryDate,
                    'type': "Bearer"
                }
                });
            }
        })(req, res);
    },
};

module.exports = authController;