const { checkSchema } = require('express-validator');

let userService = require("../services/userService");

let createUserValidation = checkSchema({
    'first_name': {
        isLength: {
            errorMessage: 'First Name is required',
            options: { min: 1 }
        }
    },
    'last_name': {
        isLength: {
            errorMessage: 'Last Name is required',
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
                    if (value.length >= 6 && value.length <= 20) {
                        return true;
                    }  else {
                        throw new Error('Password must be between 6 and 20 characters', 'password', 422);
                    }
                }
            }
        }
    },
});

module.exports = { createUserValidation };