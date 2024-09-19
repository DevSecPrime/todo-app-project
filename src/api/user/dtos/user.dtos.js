import joi from "joi"
// import { phoneNoValidation } from "../../../comman/helper/phoneNoValidator"



export const registrationSchema = joi.object({
    name: joi.string().required().max(255).messages({
        "string.empty": "Name is required....",
        "string.max": "Characters in name exceeds limit."
    }),
    email: joi.string().email().max(50).required().messages({
        "string.empty": "Email is required.",
        "string.email": "Please enter a valid email.",
        "string.max": "Characters in email exceeds limit."
    }),
    password: joi.string().min(4).required().messages({
        "string.empty": "Passsword is required...."
    }),
    countryCode: joi.string().required().messages({
        "string.empty": "Country code is required...."
    }),
    phoneNo: joi.string().max(20).required().messages({
        "string.empty": "Phone number is required",
        "string.max": "Enter valid phone number"
    })

});

export const loginSchema = joi.object({
    email: joi.string().required().email().max(50).messages({
        "string.empty": "Email is Required",
        "string.email": "Plase enter the valid email"
    }),
    password: joi.string().required().min(4).messages({
        "string.empty": "Password can not be empty"
    })
});

export const otpSchema = joi.object({
    email: joi.string().email().max(50).required().messages({
        "string.empty": "Email is required.",
        "string.email": "Please enter a valid email.",
        "string.max": "Characters in email exceeds limit."
    }),
    otp: joi.string().required().messages({
        "number.empty": "OTP is required",
        "number.base": "OTP must be a number",

    })
})

export const profileCredentials = joi.object({
    name: joi.string().required().max(255).optional().messages({
        "string.empty": "Name is required",
        "string.max": "Characters in name exceeds limit."
    }),
    email: joi.string().email().max(50).optional().messages({
        "string.empty": "Email is required",
        "string.email": "Please enter a valid email.",
        "string.max": "Characters in email exceeds limit."
    }),
    countryCode: joi.string().required().optional().messages({
        "string.empty": "country code is required"
    }),
    phoneNo: joi.string().max(20).required().optional().messages({
        "string.empty": "Phone number is required",
        "string.max": "Enter valid phone number"
    })


})