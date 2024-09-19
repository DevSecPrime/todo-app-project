import { randomBytes } from "crypto";
import jwt from "jsonwebtoken";
import knex from "../../comman/config/db";
import moment from "moment/moment";
import dotenv from "dotenv";
dotenv.config();

class AccessTokenService {

    /**
     * 
     * @param {integer} userId 
     * @param {string} email 
     * @returns 
     */
    async createToken(userId, email) {
        //generate random hex number
        const jti = randomBytes(32).toString("hex");

        //geberate token
        const payload = {
            sub: userId,
            jti: jti,
            email: email
        }
        const jwtToken = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_ACCESS_EXPIRES
        });
        //decode jWT token 
        const decodedToken = jwt.decode(jwtToken);

        //store token in database
        await this.storeToken(userId, jti, decodedToken);
        //return token
        return jwtToken;
    }

    /**
     * 
     * @param {string} userId 
     * @param {string} jti 
     * @param {string} email 
     * @param {Object} decodedToken
     * @returns 
     */
    async storeToken(userId, jti, decodedToken) {
        return await knex("access_token").insert({
            id: jti,
            user_id: userId,
            expiresAt: moment.unix(decodedToken.exp).format("YYYY-MM-DD")
        })
    }
}

export default new AccessTokenService();
