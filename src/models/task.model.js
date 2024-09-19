import moment from "moment";

export default class TaskModel {
    constructor(data) {
        this.taskId = data.id;
        this.userId = data.userId;
        this.groupId = data.groupId;
        this.projectId = data.projectId;
        this.taskName = data.taskName;
        this.description = data.description;
        this.logo = data.logo;
        this.status = data.status;
        this.startingDate = moment().unix();
        this.endingDate = moment().unix();
    }
}