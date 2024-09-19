import moment from "moment";

export default class UserModel {
    constructor(data) {
        this.userId = data.id;
        this.name = data.name;
        this.email = data.email;
        this.countryCode = data.countryCode;
        this.phoneNo = data.phoneNo;
        this.otp = Number(data.otp);
        this.isOtpVerified = !!data.otpVerofiedAt;
        this.updatesAt = moment().unix();
    }
}