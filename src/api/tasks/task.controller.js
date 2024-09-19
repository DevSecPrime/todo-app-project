


import taskService from "./task.service";
import TaskModel from "../../models/task.model";
import BadRequestException from "../../comman/exceptions/badRequest.exception";
import NOTFoundException from "../../comman/exceptions/not-fund.exception";
import fs from "fs";
import path from "path";
import { STORAGE_PATH, TASK_STATUS, HTTP_STATTUS_CODE, DEFALUT_PAGE, DEFALUT_PER_PAGE } from "../../comman/constants/constants";
import { castToStorage, uploadImage } from "../../comman/helper/imageUpload.helper"
import moment from "moment/moment";
class TaskController {

    /**
     * Create Task
     * @param {object} req 
     * @param {object} res 
     * @param {*} next 
     * @returns 
     */
    async createTask(req, res, next) {
        try {
            //get userId form req.user
            const userId = req.user.id;

            //get data from req.body
            const { groupId, projectId, taskName, description, status, startingDate, endingDate } = req.body;
            //get file from req.file
            const file = req.files && req.files.logo;

            if (!file) {
                throw new BadRequestException("Logo is required");
            }            //create task
            if (!groupId || !projectId || !taskName || !description || !status || !startingDate || !endingDate || !file || !status) {
                throw new BadRequestException("All fields are required.");
            }
            //check if group is exiss or not 
            const group = await taskService.findByGroupId(groupId);
            if (!group) {
                throw new NOTFoundException("Group not found");
            }
            //check if project is exist or not
            const project = await taskService.findByProjectId(projectId);
            if (!project) {
                throw new NOTFoundException("Project not found")
            }
            //chek if task name is already used.
            const task = await taskService.findByTaskName(userId, groupId, projectId, taskName);
            if (task) {
                throw new BadRequestException("Task is already created.");
            }
            //for unique file name
            const fileName = `${Date.now()}-${file.name}`

            //define file path as URL
            const url = castToStorage(fileName)

            //upload image
            uploadImage(file, fileName);

            //create new task
            const newTask = await taskService.createTask(userId, {
                groupId,
                projectId,
                taskName,
                description,
                status,
                startingDate,
                endingDate,
                logo: url
            })

            return res.status(HTTP_STATTUS_CODE.SUCCESS).json({
                message: "New Task created successfull",
                data: new TaskModel(newTask)
            })
        } catch (error) {
            return next(error);
        }
    }

    /** update task
     * 
     * @param {object} req 
     * @param {object} res 
     * @param {*} next 
     * @returns 
     */
    async updateTask(req, res, next) {
        try {

            //get userId fron req.user
            const userId = req.user.id;

            //get task id from req.paramas
            const id = req.params.id;

            //get data from req.body
            const { groupId, projectId, taskName, description, status, startingDate, endingDate } = req.body;
            // console.log("req.body", req.body);
            //get file form req.files
            const newFile = req.files && req.files.logo;
            if (!newFile) {
                throw new BadRequestException("Logo is required");
            }

            //check if group id is exist or not
            const group = await taskService.findByGroupId(groupId);
            if (!group) {
                throw new NOTFoundException("Group not found");
            }
            const project = await taskService.findByProjectId(projectId);
            if (!project) {
                throw new NOTFoundException("Project not found")
            }

            //check if task id is exist or not
            const task = await taskService.findById(userId, id);
            if (!task) {
                throw new NOTFoundException("Invallid user.");
            };

            let url = task.logo;

            //remove existing file from the storage
            if (newFile) {
                const fileName = task.logo.split("/").pop()

                const existingFilePath = path.join(__dirname, "../../../public/storage/uploadImages", fileName);
                if (fs.existsSync(existingFilePath)) {
                    fs.unlinkSync(existingFilePath);//delete existinn file
                }
            }
            //give file proppper name 
            const newFileName = `${moment().unix()}-${newFile.name}`;

            url = castToStorage(newFileName);
            //upload new file
            uploadImage(newFile, newFileName);

            //update task
            const updateTask = await taskService.updateTask(userId, id, groupId, projectId, {
                taskName,
                description,
                status,
                startingDate,
                endingDate,
                logo: url //updated file or Existing file
            })

            //send response
            return res.status(HTTP_STATTUS_CODE.OK).json({
                message: "Task updated successfully.",
                data: new TaskModel(updateTask)
            })

        } catch (error) {
            return next(error);
        }
    }

    /**
     *  Get task by status
     * 
     * @param {string} req 
     * @param {object} res 
     * @param {*} next 
     * @returns 
     */
    async getTaskByStatus(req, res, next) {
        try {
            //get iuser id form req.user\
            const userId = req.user.id;

            //get status from req.paramas
            const { status, groupId, projectId,page = DEFALUT_PAGE, perPage = DEFALUT_PER_PAGE} = req.query;

            if (!groupId || !projectId) {
                throw new BadRequestException("Group and project id are required.");
            }
            //check if group id is exist or not
            const group = await taskService.findByGroupId(groupId);
            if (!group) {
                throw new NOTFoundException("Group not found");
            }

            const project = await taskService.findByProjectId(projectId);
            if (!project) {
                throw new NOTFoundException("Project not found")
            }

            ///finddata based on stattus
            const validStatus = TASK_STATUS

            if (!validStatus.includes(status) || !status) {
                throw new BadRequestException("Invalid status.");
            }

            //get task
            const tasks = await taskService.findByStatus(userId, groupId, projectId, status,page,perPage)
            if (tasks.data.length === 0) {
                throw new NOTFoundException(`No task found with ${status} status.`)
            }

            //response
            return res.status(HTTP_STATTUS_CODE.SUCCESS).json({
                message: `${status} task found successfully.`,
                data: tasks.data.map(task => new TaskModel(task))
            })
        } catch (error) {
            return next(error);
        }
    }
    /** delete task
     * 
     * @param {string} req 
     * @param {*} res 
     * @param {*} next  
     * @returns
     * */

    async removeTask(req, res, next) {
        try {
            //get user id from req.user
            const userId = req.user.id;
            //get task id from  req.params
            const id = req.params.id;
            const { groupId, projectId } = req.query;

            //check if group and project is exist or not
            const group = await taskService.findByGroupId(groupId);
            if (!group) {
                throw new NOTFoundException("Group not found");
            }
            const project = await taskService.findByProjectId(projectId);
            if (!project) {
                throw new NOTFoundException("Project not found")
            }
            //validate task
            const task = await taskService.findById(userId, id);
            if (!task) {
                throw new NOTFoundException("Task does not exist.");
            }

            console.log("File got----->", task.logo);
            const fileName = task.logo.split("/").pop();
            //remove image file
            const existPath = path.join(__dirname, STORAGE_PATH, fileName);
            if (fs.existsSync(existPath)) {
                fs.unlinkSync(existPath);
                console.log("deleted file")
            }
            //remove task
            await taskService.removeTask(userId, id);

            //send response
            return res.status(HTTP_STATTUS_CODE.SUCCESS).json({
                message: "task removed successfully."
            })

        } catch (error) {
            return next(error);
        }
    }

    /** 
     * Get All tasks
     * 
     * @param {string} req 
     * @param {object}res 
     * @param {*} next 
     * @returns 
     */
    async getAllTasks(req, res, next) {
        try {
            //gte user id from req.user
            const userId = req.user.id;
            const { groupId, projectId, page = DEFALUT_PAGE, perPage = DEFALUT_PER_PAGE, search = "" } = req.query;
            const group = await taskService.findByGroupId(groupId)
            if (!group) {
                throw new NOTFoundException("Group not found")
            }
            const project = await taskService.findByProjectId(projectId)
            if (!project) {
                throw new NOTFoundException("Project not found")
            };
            //check task by search
            const checkSearch = await taskService.findBySearch(userId, groupId, projectId, search)
            if (checkSearch.length === 0) {
                throw new NOTFoundException("No task exist with this name")
            }
            //chek task 
            const task = await taskService.findTask(userId, groupId, projectId)
            if (!task) {
                throw new NOTFoundException("No task found")
            }
            //get all tasks
            const tasks = await taskService.getAllTasks(userId, groupId, projectId, page, perPage, search);
            if (tasks.data.length === 0) {
                throw new NOTFoundException("No task found.")
            }
            //send response
            return res.status(HTTP_STATTUS_CODE.SUCCESS).json({
                message: "All tasks are found.",
                data: tasks.data.map(task => new TaskModel(task)),
            })
        } catch (error) {
            return next(error)
        }
    }
}

export default new TaskController();