import { randomBytes } from "crypto";
import jwt from 'jsonwebtoken';

import dotenv from "dotenv";
import knex from "../../comman/config/db";
import moment from "moment/moment";
dotenv.config();

class RefreshTokenSerivce {
    async createRefreshToken(userId, email, jti) {
        const newJti = randomBytes(32).toString("hex");

        const payload = {
            sub: userId,
            jti: jti,
            newJti,
            email: email
        }
        const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_REFRESH_EXPIRES
        })

        // console.log("Refresh Token is ------->", refreshToken);
        //decode refresh token
        const decodeRefreshToken = jwt.decode(refreshToken);
        // console.log("Refresh Token decode data is ------->", decodeRefreshToken);
        //store token in database
        await this.storeRefreshToken(newJti, decodeRefreshToken.jti, decodeRefreshToken.exp);
        //return token
        return refreshToken;

    }

    async storeRefreshToken(newJti, jti, expiresAt) {
        return await knex("refresh_token").insert({
            id: newJti,
            accessTokenId: jti,
            expiresAt: moment
                .unix(expiresAt)
                .add(process.env.JWT_REFRESH_EXPIRES)
                .format("YYYY-MM-DD HH:mm:ss")
        })
    }
}

export default new RefreshTokenSerivce();