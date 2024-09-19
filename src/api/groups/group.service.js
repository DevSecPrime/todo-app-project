import knex from "../../comman/config/db";
import BadRequestException from "../../comman/exceptions/badRequest.exception";
import { HTTP_STATTUS_CODE, DEFALUT_PAGE, DEFALUT_PER_PAGE } from "../../comman/constants/constants";
class GroupService {

    /** 
     * Check group from group-name  
     * 
     * @param {string} groupName 
     * @returns 
     */
    async findByGroupName(userId, groupName) {
        return await knex("groups").where("groupName", groupName).andWhere("userId", userId).first();
    }

    /**
     *  Create new group
     * 
     * @param {object} groupDtos 
     * @returns 
     */
    async createGroup(groupDtos) {
        const [id] = await knex("groups").insert(groupDtos);
        return await knex("groups").where("id", id).first();
    }

    /**
     *  Find group by id
     * 
     * @param {int} id 
     * @returns 
     */
    async findById(id) {
        return await knex("groups").where("id", id).first();
    }

    /** 
     * Update group
     * 
     * @param {int} id 
     * @param {int} userId 
     * @param {object} groupData 
     * @returns 
     */
    async updateGroup(id, userId, groupData) {
        await knex("groups")
            .where("id", id)
            .andWhere("userId", userId)
            .update({

                groupName: groupData.groupName,
                updatedAt: knex.fn.now(),
            })

        return await knex("groups").where("id", id).first();
    }

    /**
     * Find by search
     * @param {int} userId 
     * @param {string} search 
     * @returns 
     */
    async findBySearch(userId, search = "") {
        return await knex("groups")
            .where("userId", userId)
            .andWhere("groupName", "like", `%${search}%`)
            .select("*")
    }
    /**
     *  Get All group
     * @param {int} userId 
     * @returns 
     */
    async getAllGroups(userId, page = DEFALUT_PAGE, perPage = DEFALUT_PER_PAGE, search = "") {
        if (page < DEFALUT_PAGE) {
            throw new BadRequestException("data does not exist");
        }
        return await knex("groups")
            .where("userId", userId)
            .andWhere("groupName", "like", `%${search}%`)
            .select("*")
            .paginate({
                perPage,
                currentPage: page,
                isLengthAware: true
            })
    }

    /**
     * Delete Group
     * @param {int} id 
     * @param {int} userId 
     * @returns 
     */
    async deleleteGroup(id, userId) {
        return await knex("groups")
            .where("id", id)
            .andWhere("userId", userId)
            .delete();
    }
}

export default new GroupService();