import joi, { string } from "joi";

export const projectSchema = joi.object({
    groupId: joi.number().integer().optional().messages({
        "number.empty": "Group id is required."
    }),
    projectName: joi.string().max(255).required().messages({
        "string.empty": "Project name is required.",
        "string.max": "Characters in project name exceeds limit."
    })
});
