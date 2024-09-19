import moment from "moment";

export default class ProjectModel {
    constructor(data) {
        this.projectId = data.id;
        this.userId = data.userId;
        this.groupId = data.groupId;
        this.projectName = data.projectName;
        this.updatedAt = moment().unix();

    }
}