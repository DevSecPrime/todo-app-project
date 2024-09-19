import BadRequestException from "../../comman/exceptions/badRequest.exception";
import groupService from "./group.service";
import groupModel from "../../models/group.model";
import { HTTP_STATTUS_CODE, DEFALUT_PAGE, DEFALUT_PER_PAGE } from "../../comman/constants/constants";
import UnauthorizedException from "../../comman/exceptions/unAuthorized.exception";
import NOTFoundException from "../../comman/exceptions/not-fund.exception";



class GroupController {

    /** 
     * Create new group 
     * 
     * @param {object} req 
     * @param {object} res 
     * @param {error,object} next 
     * @returns 
     */
    async createGroup(req, res, next) {
        try {
            //get  userId From req.user/ token
            const userId = req.user.id;

            //get data from user in req.body
            const { groupName } = req.body;

            //check if group naame already exist or not
            const checkGroup = await groupService.findByGroupName(userId, groupName);
            if (checkGroup) {
                throw new BadRequestException("This Group name is already in use");
            }
            //create new group
            const newGroup = await groupService.createGroup({
                userId,
                groupName
            });

            //send response
            return res.status(HTTP_STATTUS_CODE.SUCCESS).json({
                message: "Group created successfully",
                data: new groupModel(newGroup)
            })
        } catch (error) {
            return next(error);
        }
    }

    /**
     * Update group
     * @param {object} req 
     * @param {object} res 
     * @param {error,object} next 
     * @returns 
     */
    async updateGroup(req, res, next) {
        try {
            //get user id from req.user
            const userId = req.user.id;
            //get data from req.body
            const id = req.params.id;
            const { groupName } = req.body;

            //check if this is in already in use or not
            const group = await groupService.findById(id);
            if (!group) {
                throw new UnauthorizedException("No Group found");
            }
            //if nor update the name
            const updateGroup = await groupService.updateGroup(id, userId,
                { groupName: groupName },
                { new: true })

            //send response
            return res.status(HTTP_STATTUS_CODE.OK).json({
                message: "Group updated successfully",
                data: new groupModel(updateGroup)
            })

        } catch (error) {
            return next(error);
        }
    }
    /**
     * Get all groups
     * @param {user} req 
     * @param {object} res 
     * @param {error,object} next 
     * @returns 
     */
    async getAllGroups(req, res, next) {
        try {
            // get user from req.user
            const userId = req.user.id;

            //get paage data in req.query 
            const { page = DEFALUT_PAGE, perPage = DEFALUT_PER_PAGE, search = "" } = req.query;

            //chech if group exist or not
            // const check = await groupService.findByGroup(userId);
            // if(!check){
            //     throw new NOTFoundException("Group does not exist");
            // }
            //find data by search
            const checkSearch = await groupService.findBySearch(userId, search);
            if (checkSearch.length === 0) {
                throw new NOTFoundException("No group exist");
            }
            //get all groups based on user id...
            const groups = await groupService.getAllGroups(userId, page, perPage, search);
            if (groups.data.length === 0) {
                throw new NOTFoundException("No group found.");
            }

            //send response
            return res.status(HTTP_STATTUS_CODE.SUCCESS).json({
                message: "Groups found successfully.",
                data: groups.data.map(group => new groupModel(group)),

            })
        } catch (error) {
            return next(error);
        }
    }

    /**
     * Delete group
     * @param {object} req 
     * @param {object} res 
     * @param {error,object} next 
     * @returns 
     */
    async deleleteGroup(req, res, next) {
        try {
            //get user id from req.user
            const userId = req.user.id;
            //get id from req.params
            const id = req.params.id;
            //check if group exist or not
            const group = await groupService.findById(id);
            if (!group) {
                throw new NOTFoundException("Group not found");
            }
            //delete group
            await groupService.deleleteGroup(id, userId);
            //send response
            return res.status(HTTP_STATTUS_CODE.OK).json({
                message: "Group deleted successfully",
            })
        } catch (error) {
            return next(error);
        }
    }
}


export default new GroupController()