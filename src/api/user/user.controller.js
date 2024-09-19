import userService from "./user.service";
import { HTTP_STATTUS_CODE } from "../../comman/constants/constants";
import bcryptjs from "bcryptjs";
import UnauthorizedException from "../../comman/exceptions/unAuthorized.exception";
import sendMail from "../../comman/helper/mail.helper"
import BadRequestException from "../../comman/exceptions/badRequest.exception";
import ConflictException from "../../comman/exceptions/conflict.request.exception"
import crypto from "crypto";
import UserModel from "../../models/user.model";
import NOTFoundException from "../../comman/exceptions/not-fund.exception"
import path from "path"
import ejs from "ejs";



class UserController {
    /** 
     * Register User
     * @param {object} req 
     * @param {object} res 
     * @param {error,object} next 
     * @returns 
     */
    async register(req, res, next) {
        try {
            //get data from req.body
            const { name, email, password, countryCode, phoneNo } = req.body;

            //check if data is valid or not ---- validation which is done by Joi
            //check if user already exist ot not
            const presentUser = await userService.findByEmail(email);
            if (presentUser) {
                throw new ConflictException("User already exists");
            };

            //hash password using bcrypt
            const hashPassword = await bcryptjs.hash(password, 12);
            if (!hashPassword) {
                throw new BadRequestException("Failed to hash password");
            }

            //create user entry in database
            const newUser = await userService.createUser({
                name,
                email,
                password: hashPassword,
                countryCode,
                phoneNo
            })

            //generate accesstken
            //generate refresh token
            const token = await userService.generateTokenPair(newUser.id, newUser.email);

            const { accessToken, refreshToken } = token;


            //store entry inn databse
            //send response
            return res
                .status(HTTP_STATTUS_CODE.SUCCESS)
                .json({
                    message: "User created successfully",
                    data: new UserModel(newUser),
                    access_token: accessToken,
                    refresh_token: refreshToken
                });
        } catch (error) {
            return next(error);
        }
    }
    /**
     *  Send OTP
     * 
     * @param {string} req 
     * @param {string} res 
     * @param {*} next 
     * @returns 
     */
    async sendOtp(req, res, next) {
        try {
            //get email from req.body
            const { email } = req.body;

            const generateOtp = await userService.generateOtp(email);
            // console.log("Generated OTP is --------->", generateOtp);

            // check OTP validity 
            //send otp verificaton mail to user
            await userService.sendVerificationMail(email, generateOtp);

            //store otp in database
            await userService.storeOtp(email, generateOtp);

            //send response
            res.status(HTTP_STATTUS_CODE.OK).json(
                {
                    message: "Otp sent successfully",
                    otp: generateOtp
                })
        } catch (error) {
            return next(error);
        }
    }

    /** 
     * Verify OTP
     * @param {string} req 
     * @param {object} res 
     * @param {*} next 
     * @returns 
     */
    async verifyOtp(req, res, next) {
        try {
            //get email and otp from the req.body
            const { email, otp } = req.body;

            //chek if email id invalid or not
            const user = await userService.findByEmail(email);
            if (!user) {
                throw new BadRequestException("Inavalid email....");
            }

            //chek if otp is valid or not 
            await userService.verifyOTP(user.id, otp);

            return res
                .status(HTTP_STATTUS_CODE.OK)
                .json({
                    message: "User verified successfully"
                })
        } catch (error) {
            return next(error);
        }
    }

    /**
     *  Log in
     * @param {string} req 
     * @param {string} res 
     * @param {*} next 
     * @returns 
     */
    async login(req, res, next) {
        try {
            //get email and pasword from req.body
            const { email, password } = req.body;
            //validatation done by JOI 
            //chek if user exist or not
            const user = await userService.findByEmail(email);
            if (!user) {
                throw new UnauthorizedException("User nor found");
            }
            //match password
            const isPasswordMatched = await userService.comparePassword(password, user.password);
            if (isPasswordMatched) {
                //generate token pair
                const token = await userService.generateTokenPair(user.id, user.email);
                const { accessToken, refreshToken } = token;

                //send response
                return res
                    .status(HTTP_STATTUS_CODE.OK)

                    .json({
                        message: "User logged in successfully",
                        data: new UserModel(user),
                        accessToken: accessToken,
                        refreshToken: refreshToken
                    })
            }
            else {
                throw new UnauthorizedException("Invalid password");
            }

        } catch (error) {
            return next(error);
        }
    }

    /** 
     * Get User Profile
     * @param {string} req 
     * @param {object} res 
     * @param {*} next 
     * @returns 
     */
    async getProfile(req, res, next) {
        try {
            const id = req.user.id;
            const user = await userService.findById(id);
            if (!user) {
                throw new UnauthorizedException("User not found");
            }
            return res
                .status(HTTP_STATTUS_CODE.SUCCESS).json({

                    message: "User found succesfully",
                    data: new UserModel(user)
                })
        } catch (error) {
            return next(error);
        }
    }

    /** 
     * Update profile
     * 
     * @param {object} req 
     * @param {object} res 
     * @param {*} next 
     * @returns 
     */
    async updateProfile(req, res, next) {
        try {
            //get user id from  req.user
            const id = req.user.id;
            if (!id) {
                throw new UnauthorizedException("User not found");
            }
            //get data from req.body
            const { name, email, countryCode, phoneNo } = req.body;
            //check if user exist or not
            if (email) {
                const user = await userService.findByEmail(email);
                if (user && user.id !== id) {
                    throw new BadRequestException("Email already used....");
                };
            }
            //update user
            const updateUser = await userService.updateProfile(id, {
                name,
                email,
                countryCode,
                phoneNo
            });
            //send mail to user with confirmation that data is updated successfully..
            await sendMail(updateUser.email, "Profile updated Successfully", "Thanks! for using our services...");

            //send response
            return res
                .status(HTTP_STATTUS_CODE.SUCCESS)
                .json({
                    message: "User profile uodated successfully",
                    data: new UserModel(updateUser)
                })
        } catch (error) {
            return next(error);
        }
    }

    /** 
     * Reset password
     * 
     * @param {string} req 
     * @param {string} res 
     * @param {*} next 
     * @returns 
     */
    async resetPasswordToken(req, res, next) {
        try {

            //get email from req.body
            const { email } = req.body;
            const user = await userService.findByEmail(email);

            if (!user) {
                throw new UnauthorizedException("User does not exists with this email");
            }

            //verify OTP
            await userService.verifyOTP(user.id, user.otp)

            //If OTP, verified genearate random token
            const rememberToken = crypto.randomBytes(20).toString("hex");

            //store remember token and token expiration time in database
            await userService.updateTokenDetails(email, rememberToken);

            //generate URL with token
            const URL = `http://localhost:3000/reset-password?token=${rememberToken}`;

            //send mail with URL
            await sendMail(email, "Your Reset Password Link", `Click here to reset your password-${URL}`);

            //send response
            return res.status(HTTP_STATTUS_CODE.SUCCESS).json({
                message: "Reset password token sent successfully",
                data: URL
            })
        } catch (error) {
            return next(error);
        }
    }

    /**
     *  Forget password
     * 
     * @param {string} req 
     * @param {string} res 
     * @param {*} next 
     * @returns 
     */
    async forgetPassword(req, res, next) {
        try {
            // Extract token, newPassword, and confirmPassword from req.body
            const { token, newPassword, confirmPassword } = req.body;

            // Validate if newPassword and confirmPassword match
            if (newPassword !== confirmPassword) {
                throw new BadRequestException("New password and confirm password do not match.");
            }

            // Find the user by the remember token
            const user = await userService.findByRememberToken(token);
            if (!user) {
                throw new BadRequestException("Invalid token or user does not exist.");
            }

            // Check if the token is expired or invalid
            if (user.rememberTokenExpiredAt < Date.now() || user.rememberToken !== token) {
                throw new ConflictException("Reset Token is expired or invalid.");
            }

            // Hash the new password
            const hashPassword = await bcryptjs.hash(newPassword, 12);
            if (!hashPassword) {
                throw new BadRequestException("Failed to hash the new password.");
            }

            // Update the user's password
            await userService.updatePassword(user.id, hashPassword);

            // Send success response
            return res.status(HTTP_STATTUS_CODE.OK).json({
                message: "Password updated successfully."
            });

        } catch (error) {
            return next(error);
        }
    }

    /** 
     * Change password
     * 
     * @param {string} req 
     * @param {*} res 
     * @param {*} next 
     * @returns 
     */
    async changePassword(req, res, next) {
        try {
            //get user if from req.user.id
            const id = req.user.id;

            //validate user via id
            const user = await userService.findById(id);
            if (!user) {
                throw new BadRequestException("User not found");
            }
            //get oldPassword and newPassword from req.body
            const { oldPassword, newPassword } = req.body;

            //comapre user password with oldPassword
            const checkPassword = await userService.comparePassword(oldPassword, user.password);
            if (!checkPassword) {
                throw new BadRequestException("Your password does not matched with old password");
            };
            //if matches, encrypt new password
            const hashPassword = await bcryptjs.hash(newPassword, 12);
            // console.log("New Hashed Password is :------>", hashPassword);

            //update password in database
            await userService.changePassword(user.id, hashPassword);
            //destory token in database 

            //send email that pwd updated successfully
            const updatePaaswordTemplatePath = path.join(__dirname, "../../views/pages/passwordUpdateTemplate.ejs")
            const htmlBody = await ejs.renderFile(updatePaaswordTemplatePath, { name: user.name, email: user.email })
            await sendMail(user.email, "password updated successfully", htmlBody, true);
            //rend response
            return res.status(HTTP_STATTUS_CODE.SUCCESS).json({
                message: "password updated successfully"
            }
            )

        } catch (error) {
            return next(error);
        }
    }

    /** 
     * Log out user
     * 
     * @param {string} req 
     * @param {object} res 
     * @param {error,object} next 
     * @returns 
     */
    async logOut(req, res, next) {
        try {
            //get user via token
            const userId = req.user.id;
            // console.log("User id is :-", userId);
            //chek if user existance
            const user = await userService.findById(userId);
            if (!user) {
                throw new NOTFoundException("User not found");
            }
            //finda user dat via token
            const tokenData = await userService.findByToken(user.id);
            // console.log("Token data ----->", tokenData);

            //destroy token set token revokation value to true
            const isRevoked = await userService.tokenRevokedValidity(tokenData.id);
            // console.log("Token revokation value ----->", isRevoked.revoked);

            if ((isRevoked.revoked == false)) {
                //set token revokeation value to trrue
                await userService.logOut(tokenData.id);
                //logout user
                //send response...
                return res.status(200).json({
                    message: "User logged out successfully"
                })
            }
            else {
                throw new UnauthorizedException("Token expired or used")
            }

        } catch (error) {
            return next(error);
        }
    }

    /** 
     * Delete acount...
     * 
     * @param {string} req 
     * @param {*} res 
     * @param {error,object} next 
     * @returns 
     */
    async deleteAccount(req, res, next) {
        try {
            // Get user ID from the authenticated request
            const userId = req.user.id;

            // Check if the user exists
            const user = await userService.findById(userId);
            if (!user) {
                throw new NOTFoundException("User not found.");
            }
            // Delete the user account
            await userService.deleteAccount(userId);

            // Send a success response
            return res.status(200).json({
                message: "User deleted successfully."
            });
        } catch (error) {
            return next(error);
        }
    }

}
export default new UserController();


