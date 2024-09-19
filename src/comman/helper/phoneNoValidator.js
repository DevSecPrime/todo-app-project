import Joi from 'joi';

export const phoneNoValidation = (fieldName = "Phone Number") => 
    Joi.number()
        .required()
        .custom((value, helpers) => {
            // Convert number to string to check length
            const valueStr = value.toString();
            if (valueStr.length > 20) {
                return helpers.error("number.max");
            }
            return value;
        })
        .messages({
            "number.base": `${fieldName} must be a number.`,
            "number.empty": `${fieldName} is required.`,
            "number.max": `${fieldName} should be less than or equal to 20 digits.`
        });
