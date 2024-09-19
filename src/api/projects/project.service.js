import knex from "../../comman/config/db"
import { DEFALUT_PAGE, DEFALUT_PER_PAGE } from "../../comman/constants/constants"
import BadRequestException from "../../comman/exceptions/badRequest.exception";
class ProjectService {
    /** 
     * Find project by name
     * 
     * @param {int} groupId 
     * @param {string} projectName 
     * @returns 
     */
    async findByProjetcData(userId, groupId, projectName) {

        return await knex("projects")
            .where("groupId", groupId)
            .andWhere("userId", userId)
            .andWhere("projectName", projectName)
            .first();
    }

    /**
     * Find project by name
     * @param {int} groupId 
     * @param {string} projectName 
     * @returns 
     */
    async findByProjectName(groupId, projectName) {

        return await knex("projects")
            .where("projectName", projectName)
            .andWhere("groupId", groupId)
            .first();
    }

    /**
     * Find by search 
     * @param {int} userId 
     * @param {int} groupId 
     * @param {string} search 
     * @returns 
     */
    async findBySearch(userId, groupId, search = "") {
        return await knex("projects")
            .where("userId", userId)
            .where("groupId", groupId)
            .andWhere("projectName", "like", `%${search}%`)
            .select("*")
    }

    /** 
     * Find project by id
     * 
     * @param {int} id 
     * @returns 
     */
    async findById(userId, groupId, id) {
        return await knex("projects")
            .where("id", id)
            .andWhere("userId", userId)
            .andWhere("groupId", groupId)
            .first();
    }

    /** 
     * Create project
     * 
     * @param {object} projectDtos 
     * @returns 
     */
    async createProject(projectDtos) {
        // console.log("Project data-----", projectDtos)
        const [id] = await knex("projects").insert({
            userId: projectDtos.userId,
            groupId: projectDtos.groupId,
            projectName: projectDtos.projectName
        })

        return await knex("projects").where("id", id).first();
    }

    /** 
     * Update project
     * 
     * @param {int} id 
     * @param {int} userId 
     * @param {object} projectDtos 
     * @returns 
     */
    async updateProject(id, userId, projectDtos) {
        await knex("projects").where("id", id)
            .andWhere("userId", userId)
            .update({
                userId: userId,
                projectName: projectDtos.projectName,
                updatedAt: knex.fn.now()
            })

        return await knex("projects").where("id", id).first();
    }

    async checkByGroup(groupId, projectId) {
        return await knex("projects")
            .where("id", projectId)
            .where("groupId", groupId)
            .first();
    }
    /**
     *  Delete project
     * 
     * @param {int} id 
     * @param {int} userId 
     * @returns 
     */
    async deleteProject(userId, groupId, projectId) {
        // console.log("Project id got - " + projectId);
        // console.log("User id got - " + userId);
        return await knex("projects")
            .where("id", projectId)
            .andWhere("userId", userId)
            .andWhere("groupId", groupId).del();
    }
    async findByGroup(groupId) {
        return await knex("projects")
            .where("groupId", groupId)
            .first();
    }

    /** 
     * Get all projects via id
     * 
     * @param {int} userId 
     * @returns 
     */
    async getAllProjects(userId, groupId, page = DEFALUT_PAGE, perPage = DEFALUT_PER_PAGE, search = "") {
        if (page === 0 || page < DEFALUT_PAGE) {
            throw new BadRequestException("Page does not exist");
        }
        return await knex("projects")
            .where("userId", userId)
            .andWhere("groupId", groupId)
            .andWhere("projectName", "like", `%${search}%`)
            .select("*")
            .paginate({
                perPage,
                currentPage: page,
                isLengthAware: true
            });
    }
}

export default new ProjectService()