import Joi from "joi"

export const groupSchema = Joi.object({
    groupName: Joi.string().max(255).required().messages({
        "string.empty": "Group name is required.",
        "string.max": "Characters in group name exceeds limit."
    })
});

