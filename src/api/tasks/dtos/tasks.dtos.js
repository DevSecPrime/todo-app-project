import joi from "joi";

export const taskSchema = joi.object({
    groupId: joi.number().required().messages({
        "number.empty": "Group id is required."
    }),
    projectId: joi.number().required().messages({
        "number.empty": "Project id is required."
    }),
    taskName: joi.string().max(255).required().messages({
        "string.empty": "Task name is required.",
        "string.max": "Length of task name exceeds limit."
    }),
    description: joi.string().max(500).required().messages({
        "string.empty": "Description is requiured.",
        "string.max": "Description length exceeds limit."
    }),
    status: joi.string().valid("pending", "in-progress", "completed").required().messages({
        "string.empty": "Satus is required.",
        "any.only": "Status must be pending, in-progress or completed."
    }),
    logo: joi.string().optional().messages({
        "string.empty": "Logo is required."
    }),
    startingDate: joi.string().required().messages({
        "string.empty": "Stating date is required."
    }),
    endingDate: joi.string().required().messages({
        "string.empty": "Ending date is required."
    })

});

export const updateTaskSchema = joi.object({
    groupId: joi.number().required().messages({
        "number.empty": "Group id is required."
    }),
    projectId: joi.number().required().messages({
        "number.empty": "Project id is required."
    }),
    taskName: joi.string().max(255).required().messages({
        "string.empty": "Task name is required.",
        "string.max": "Length of task name exceeds limit."
    }),
    description: joi.string().max(500).required().messages({
        "string.empty": "Description is requiured.",
        "string.max": "Description length exceeds limit."
    }),
    status: joi.string().valid("pending", "in-progress", "completed").required().messages({
        "string.empty": "Satus is required.",
        "any.only": "Status must be pending, in-progress or completed."
    }),
    startingDate: joi.string().required().messages({
        "string.empty": "Stating date is required...."
    }),
    logo: joi.string().optional().messages({
        "string.empty": "Logo is required."
    }),
    endingDate: joi.string().required().messages({
        "string.empty": "Ending date is required."
    })

})