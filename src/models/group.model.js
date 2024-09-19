import moment from "moment";

export default class groupModel {
    constructor(data) {
        this.groupId = data.id;
        this.userId = data.userId;
        this.groupName = data.groupName;
        this.updatedAt = moment().unix();
    }
}