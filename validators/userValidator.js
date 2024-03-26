const { checkSchema } = require('express-validator');

let userService = require("../services/userService");

let createUserValidation = checkSchema({
    'fullName': {
        isLength: {
            errorMessage: 'Full Name is required',
            options: { min: 1 }
        }
    },
    'email': {
        isLength: {
            errorMessage: 'Email is required',
            options: { min: 1 }
        },
        isEmail: {
            errorMessage: 'Not a valid email'
        },
        custom: {
            options: (value, { req }) => {
                return new Promise( (resolve, reject) => {
                    let whereCondition = {email:value};
                    userService.findOne(whereCondition).then(user => {
                        if(user === null) {
                            resolve(true);
                        } else {
                            reject('Email already exists');
                        }
                    }).catch(() => {
                        resolve(true);
                    });
                });
            }
        }
    },
    'password': {
        custom: {
            options: (value, { req }) => {
                if (value === '' || value == undefined) {
                    throw new Error('Password is required');
                } else {
                    let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
                    if (regex.test(value)) {
                        return true;
                    } else {
                        throw new Error('Minimum eight characters, at least one uppercase letter, at least one lowercase letter, at least one number and at least one special character is required.', 'password', 422);
                    }
                }
            }
        }
    },
});

let resendActivationTokenValidation = checkSchema({
    email: {
        isLength: {
            errorMessage: 'Email is required',
            options: { min: 1 }
        },
        isEmail: {
            errorMessage: 'Not a valid email'
        }
    },
});

module.exports = { createUserValidation, resendActivationTokenValidation };