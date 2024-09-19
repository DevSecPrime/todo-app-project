import BadRequestException from "../../comman/exceptions/badRequest.exception";
import NotFoundException from "../../comman/exceptions/not-fund.exception";
import ProjectModel from "../../models/project.model";
import groupService from "../groups/group.service";
import projectService from "./project.service";
import { HTTP_STATTUS_CODE, DEFALUT_PAGE, DEFALUT_PER_PAGE } from "../../comman/constants/constants";
class ProjectController {
    /**
     * Create a new project
     * @param {object} req 
     * @param {object} res 
     * @param {error,object} next 
     * @returns 
     */
    async createProject(req, res, next) {
        try {
            //get user id form req.user
            const userId = req.user.id

            //get data from req.body
            const { groupId, projectName } = req.body;

            //check if group exist or not
            const group = await groupService.findById(groupId);
            if (!group) {
                throw new NotFoundException("Group does not exist")
            }
            //check if name already used or not
            const checkProject = await projectService.findByProjetcData(userId, groupId, projectName);
            if (checkProject) {
                throw new BadRequestException("Project name is already used")
            }

            //create new project
            const newProject = await projectService.createProject({
                userId,
                groupId,
                projectName: projectName
            });

            //send response
            return res.status(HTTP_STATTUS_CODE.SUCCESS).json({
                message: "New project created successfully",
                data: new ProjectModel(newProject)
            })
        } catch (error) {
            return next(error);
        }
    }
    /**
     * Update project
     * @param {object} req 
     * @param {object} res 
     * @param {error,object} next 
     * @returns 
     */
    async updateProject(req, res, next) {
        try {
            //get user id from req.user
            const userId = req.user.id;
            //get project id from req.params
            const id = req.params.id;

            //get data from req.body
            const { groupId, projectName } = req.body;
            //check if group exist or not
            const group = await groupService.findById(groupId);
            if (!group) {
                throw new NotFoundException("Group does not exist")
            }
            const checkProject = await projectService.findByProjectName(groupId, projectName);
            if (checkProject) {
                throw new BadRequestException("Project name is already used.");
            }

            //chek if project exist or not
            const project = await projectService.findById(userId, groupId, id);

            if (!project) {
                throw new NotFoundException("Project does not exist");
            }

            //update project
            const updateProject = await projectService.updateProject(id,
                userId,
                { projectName: projectName },
                { new: true });
            return res.status(HTTP_STATTUS_CODE.OK).json({
                message: "Project updated successfully.",
                data: new ProjectModel(updateProject)
            })
            //send response
        } catch (error) {
            return next(error);
        }
    }

    /**
     * Delete project
     * @param {object} req 
     * @param {object} res 
     * @param {error,object} next 
     * @returns 
     */
    async deleteProject(req, res, next) {
        try {
            //get id from req.user
            const userId = req.user.id;
            // console.log("userId", userId)
            //get project id from req.params
            const groupId = req.query.groupId;
            const projectId = req.params.projectId;

            //check if group exist or not
            const group = await groupService.findById(groupId);
            if (!group) {
                throw new NotFoundException("Group does not exist");
            }

            //check by grp
            const check = await projectService.checkByGroup(groupId, projectId);
            if (!check) {
                throw new NotFoundException("Project does not exist with this group or deleted.");
            }
            //chek if id already deleted or not
            const project = await projectService.findById(userId, groupId, projectId);
            if (!project) {
                throw new NotFoundException("Project is already deleted OR not found.");
            }


            //delete project
            await projectService.deleteProject(userId, groupId, projectId);

            //send response
            return res.status(HTTP_STATTUS_CODE.OK).json({
                message: "Project deleted successfully."
            })
        } catch (error) {
            return next(error);
        }
    }

    /**
     * 
     * @param {string} req 
     * @param {object} res 
     * @param {object,error} next 
     * @returns 
     */
    async getAllProjects(req, res, next) {
        try {
            //get user id from req.user
            const userId = req.user.id;
            //get group id from req.params
            const groupId = req.params.groupId;

            const { page = DEFALUT_PAGE, perPage = DEFALUT_PER_PAGE, search = "" } = req.query;
            //fetch all the projects according to that user id
            const check = await projectService.findByGroup(groupId);
            if (!check) {
                throw new NotFoundException("Group does not exist");
            }
            //check by search
            const checkSearch = await projectService.findBySearch(userId, groupId, search);
            if (checkSearch.length === 0) {
                throw new NotFoundException("No project exist with this name");
            }
            const projects = await projectService.getAllProjects(userId, groupId, page, perPage, search);

            if (projects.data.length === 0) {
                throw new NotFoundException("No project found.")
            }

            //send response
            return res.status(HTTP_STATTUS_CODE.OK).json({
                message: "All projects fetched successfully.",
                data: projects.data.map(project => new ProjectModel(project))
            })

        } catch (error) {
            return next(error);

        }
    }
}

export default new ProjectController()