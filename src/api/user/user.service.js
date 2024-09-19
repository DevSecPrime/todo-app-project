import knex from "../../comman/config/db"
import BADRequestException from "../../comman/exceptions/badRequest.exception";
import UnAuthorizedException from "../../comman/exceptions/unAuthorized.exception";
import otpGenerator from "otp-generator"
import mailSender from "../../comman/helper/mail.helper"
import accessTokenService from "../access_token/access.token.service"
import refreshTokenService from "../refresh_token/refresh.token.services"
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import ejs from "ejs";
import path from "path";
import moment from "moment";

class UserService {

    /**
     * Check if user already registered or not
     * 
     * @param {string} email 
     * @returns 
     */
    async findByEmail(email) {
        return await knex("users").where("email", email).first();
    }

    /**
     * Find OTP from database
     * @param {string} otp 
     * @returns 
     */
    async findByOtp(otp) {
        return await knex("users").where("otp", otp)
    }

    /**
     * Generate OTP
     * @param {string} email 
     * @returns 
     */
    async generateOtp() {
        let result;
        let otp;

        do {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false
            })

            result = await this.findByOtp(otp);
        }
        while (result.length > 0)

        return otp;

    }

    /**
     * Verify OTP
     * @param {*} userId 
     * @param {string} otp 
     */
    async verifyOTP(userId, otp) {
        // console.log("User ID ----->", userId);
        // console.log("OTP ----->", otp);
        ///get user via id
        const user = await knex("users").where("id", userId).first();
        // console.log("User.....", user);

        if (!user) {
            throw new BADRequestException("User not found");
        }

        const currentTime = new Date();
        // console.log("Current Time ------->", currentTime);

        if (user.otp !== otp || user.otpExpiredAt < currentTime || otp.length !== 6) {
            throw new UnAuthorizedException("Invalid OTP or OTP is expired.");
        }
        //update OTP verified Time....
        await knex("users").where("id", userId).update({
            otpVerifiedAt: currentTime,
            updatedAt: knex.fn.now()
        })
    }
    /**
     * comapare pasword
     * @param {string} password 
     * @param {string} userPassword 
     * @returns 
     */
    async comparePassword(password, userPassword) {
        //console.log("Password----------->", password);
        // console.log("User password------------->", userPassword);
        return await bcryptjs.compare(password, userPassword);
    }

    /** 
     * Update token details
     * 
     * @param {string} email 
     * @param {string} rememberToken 
     */
    async updateTokenDetails(email, rememberToken) {
        await knex("users").where("email", email).update({
            rememberToken: rememberToken,
            rememberTokenExpiredAt: moment().add(5, "minutes").format("YYYY-MM-DD HH:mm:ss"),
            updatedAt: knex.fn.now()
        })
    }

    /** 
     * Validate token
     * 
     * @param {string} rememberTokenExpiredAt 
     */
    async checkToken(rememberTokenExpiredAt) {
        const currentTime = moment().format("YYYY-MM-DD HH:mm:ss");
        console.log("Current Time ------->", currentTime);
        if (rememberTokenExpiredAt > currentTime) {
            throw new UnAuthorizedException("Token is expired....");
        }
    }
    /**
     * Create new user
     * @param {object} user 
     * @returns {object} user
     */

    async createUser(userDtos) {
        const [id] = await knex("users").insert(userDtos);
        return await knex("users").where("id", id).first();
    }
    /** 
     * Generate token pair for access and refresh token
     * 
     * @param {string} email 
     * @param {string} otp 
     * @returns 
     */

    async generateTokenPair(userId, email) {
        //generate access token
        const accessToken = await accessTokenService.createToken(userId, email);
        // console.log("Generated access token is ------->", accessToken);
        ///decode token...
        const decodedToken = jwt.decode(accessToken);
        // console.log("Decode token Data ---------->", decodedToken);

        //generate refresh token
        const refreshToken = await refreshTokenService.createRefreshToken(
            decodedToken.sub,
            decodedToken.email,
            decodedToken.jti,
            decodedToken.exp

        );
        // console.log("Refresh Token is ---------->", refreshToken);
        return {
            accessToken,
            refreshToken,
            expiresAt: decodedToken.exp
        };

    }

    /** 
     * Update profile
     * 
     * @param {int} userId 
     * @param {object} data 
     * @returns 
     */
    async updateProfile(userId, data) {
        await knex("users").where("id", userId).update({
            name: data.name,
            email: data.email,
            countryCode: data.countryCode,
            phoneNo: data.phoneNo,
            updatedAt: knex.fn.now()

        });

        const updateUser = await knex("users")
            .where("id", userId)
            .first();
        delete updateUser.password;
        return updateUser;
    }

    /** 
     * Send verification mail
     * 
     * @param {string} email 
     * @param {string} otp 
     * @returns 
     */
    async sendVerificationMail(email, otp) {
        try {
            //path for mail template
            const otpTemplatePath = path.join(__dirname, "../../views/pages/otpTemplate.ejs");

            //html body for mail
            const htmlBody = await ejs.renderFile(otpTemplatePath, { otp });

            //send nail function
            return await mailSender(email, "Verification email.....", htmlBody, true);

        } catch (error) {
            throw new Error(error);
        }
    }

    /**
     * Find by id
     * @param {int} id 
     * @returns 
     */
    async findById(id) {
        return await knex('users').where("id", id).first();
    }
    /**
     * Find by token
     * @param {int} id 
     * @returns 
     */
    async findByToken(id) {
        return await knex("access_token")
            .where("user_id", id)
            .orderBy("createdAt", "desc")
            .first();
    }

    /**
     * Check token validity
     * @returns Boolean Value
     */
    async tokenRevokedValidity(id) {
        return await knex("access_token")
            .where({ id: id })
            .orderBy("createdAt", "desc")
            .first();

    }

    /**
     * 
     * @param {int} userId 
     * @returns 
     */
    async logOut(id) {
        // console.log("Token id got - " + id);
        return await knex("access_token").where("id", id).update({
            revoked: true,
            updatedAt: knex.fn.now(),

        })
    }

    /**
     * Delete Account
     * @param {int} userId 
     * @returns 
     */
    async deleteAccount(userId) {
        return await knex("users").where("id", userId).del();
    }
    /**
      * Store OTP
      * @param {string} email 
      * @param {string} otp 
      * @returns 
      */
    async storeOtp(email, otp) {
        // console.log("OTP GOT ---------->", otp);
        // console.log("EMAIL GOT ---------->", email);
        const otpExpireTime = new Date(Date.now() + 5 * 60 * 1000);;
        return await knex("users")
            .where("email", email)
            .update({
                otp: otp,
                otpExpiredAt: otpExpireTime,
                updatedAt: knex.fn.now()
            });
    }

    /**
     *  Check password
     * 
     * @param {string} password 
     * @param {string} confirmpassword 
     * @returns 
     */
    async checkPassword(password, confirmpassword) {
        if (password === confirmpassword) {
            return true;
        }
        else {
            throw new UnAuthorizedException("Passwords do not match....");
        }
    }
    /**
     * 
     * @param {int} userId 
     * @param {string} password 
     * @returns 
     */
    async changePassword(userId, password) {
        const updatePwd = await knex("users").where("id", userId).update({
            password: password,
            updatedAt: knex.fn.now()
        });

        const logOutUser = await knex("access_token")
            .where("user_id", userId).update({
                revoked: true,
                updatedAt: knex.fn.now()
            })

        return {
            updatePwd,
            logOutUser
        }
    }

    /** 
     * update password
     * 
     * @param {int} userId 
     * @param {string} password 
     * @returns 
     */
    async updatePassword(userId, password) {
        return await knex("users").where("id", userId).update({
            password: password,
            updatedAt: knex.fn.now()
        })
    }

    /** 
     * Find user by remember token
     * 
     * @param {string} token 
     * @returns 
     */
    async findByRememberToken(token) {
        console.log("Token is ------->", token);
        return await knex("users").where("rememberToken", token).first();
    }
}

export default new UserService();
