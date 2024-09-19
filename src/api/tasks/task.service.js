import knex from "../../comman/config/db"
import { DEFALUT_PAGE, DEFALUT_PER_PAGE } from "../../comman/constants/constants";

class TaskService {
    /** create new task..
     * 
     * @param {int} userId 
     * @param {object} taskDtos 
     * @returns 
     */
    async createTask(userId, taskDtos) {
        const [id] = await knex('tasks').insert({
            userId: userId,
            groupId: taskDtos.groupId,
            projectId: taskDtos.projectId,
            taskName: taskDtos.taskName,
            description: taskDtos.description,
            logo: taskDtos.logo,
            status: taskDtos.status,
            startingDate: taskDtos.startingDate,
            endingDate: taskDtos.endingDate
        })
        return await knex("tasks").where("id", id).first();
    }
    /**
     * 
     * @param {int} userId 
     * @param {int} groupId 
     * @param {int} projectId 
     * @param {string} taskName 
     * @returns 
     */
    async findByTaskName(userId, groupId, projectId, taskName) {
        return await knex("tasks")
            .andWhere("userId", userId)
            .where("groupId", groupId)
            .where("projectId", projectId)
            .where("taskName", taskName)
            .first();
    }

    /**
     * find by id
     * @param {int} id 
     * @returns 
     */
    async findById(userId, id) {
        return await knex("tasks").where("id", id).where("userId", userId).first();
    }

    /**
     * find by group id
     * @param {string} groupId 
     * @returns 
     */
    async findByGroupId(groupId) {
        return await knex("groups").where("id", groupId).first();
    }
    /**
     * find by project id
     * @param {string} projectId 
     * @returns 
     */
    async findByProjectId(projectId) {
        return await knex("projects").where("id", projectId).first()
    }

    /**
     * 
     * @param {int} userId 
     * @param {int} id 
     * @param {int} groupId 
     * @param {int} projectId 
     * @param {object} data 
     * @returns 
     */
    async updateTask(userId, id, groupId, projectId, data) {
        await knex("tasks").where("id", id)
            .andWhere("userId", userId)
            .andWhere("groupId", groupId)
            .andWhere("projectId", projectId)
            .update({
                taskName: data.taskName,
                description: data.description,
                logo: data.logo,
                status: data.status,
                startingDate: data.startingDate,
                endingDate: data.endingDate,
                updatedAt: knex.fn.now()
            })

        return await knex("tasks").where("id", id).first();
    }

    /** find by status
     * 
     * @param {int} userId 
     * @param {string} status 
     * @returns 
     */
    async findByStatus(userId, groupId, projectId, status, page = DEFALUT_PAGE, perPage = DEFALUT_PER_PAGE) {
        if (page < DEFALUT_PAGE || page === 0) {
            throw new BadRequestException("data does not exist");
        }
        return await knex("tasks")
            .where("userId", userId)
            .andWhere("groupId", groupId)
            .andWhere("projectId", projectId)
            .andWhere("status", status)
            .select("*")
            .paginate({
                perPage,
                currentPage: page,
                isLengthAware: true
            });
    }
    /** remove task
     * 
     * @param {int} userId 
     * @param {int} id 
     * @returns 
     */
    async removeTask(userId, id) {
        return await knex("tasks").where("id", id).andWhere("userId", userId).del();
    }

    /**
     * Find data by search
     * @param {int} userId 
     * @param {int} groupId 
     * @param {int} projectId 
     * @param {string} search 
     * @returns 
     */
    async findBySearch(userId, groupId, projectId, search = "") {
        return await knex("tasks")
            .where("userId", userId)
            .andWhere("groupId", groupId)
            .andWhere("projectId", projectId)
            .andWhere("taskName", "like", `%${search}%`)
            .select("*")
    }

    async findTask(userId, groupId, projectId) {
        return await knex("tasks")
            .where("userId", userId)
            .andWhere("groupId", groupId)
            .andWhere("projectId", projectId)
            .select("*")
    }

    /**
     * 
     * @param {int} userId 
     * @param {int} groupId 
     * @param {int} projectId 
     * @param {int} page 
     * @param {int} perPage 
     * @param {string} search 
     * @returns 
     */
    async getAllTasks(userId, groupId, projectId, page = DEFALUT_PAGE, perPage = DEFALUT_PER_PAGE, search = "") {
        return await knex("tasks")
            .where("userId", userId)
            .andWhere("projectId", projectId)
            .andWhere("groupId", groupId)
            .andWhere("taskName", "like", `%${search}%`)
            .select("*")
            .paginate({
                perPage,
                currentPage: page,
                isLengthAware: true
            });
    }
}

export default new TaskService()