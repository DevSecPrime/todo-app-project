import passport from "passport";
import { ExtractJwt, Strategy as jwtStrategy } from "passport-jwt";
import dotenv from "dotenv";
import moment from "moment";
import knex from "../config/db";
dotenv.config();

//1. configure JWT options
const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
}
//2. Define the startergy...
passport.use(
    new jwtStrategy(options, async (jwtPayload, done) => {
        // console.log("inside.....")
        try {
            //3. check token expiration
            if (moment.utc().unix() > jwtPayload.exp) {
                //if current time is greater than token expiration time, than return false (token is expired...)
                return done(null, false);
            }
            //4. verify if token is availabe in Database
            const checkToken = await knex("access_token")
                .where("access_token.id", jwtPayload.jti)
                .where({
                    user_id: jwtPayload.sub,//match with userId (sub)
                    revoked: false,//check if token is revoked
                })
                .innerJoin("users", "access_token.user_id", "=", "users.id")
                .first();
            //5. Check if token is still valid 

            if (!checkToken || moment.utc().unix() > checkToken.expiresAt) {
                //if token not found or expired return false
                return done(null, false)
            }
            //6. Retrive token from the dataabase
            const user = await knex("users").where({
                id: jwtPayload.sub,
            }).first();

            //7. Handle the case when user doesnt exist
            if (!user) {
                //if user not found return false
                return done(null, false);
            }

            //8. remove the password filed from security purpose
            delete user.password;

            //9. Attach the token id to the user
            user.jti = jwtPayload.jti;

            //10.Authenticat User            
            return done(null, user); //pass the user object to the nect middleware 

        } catch (error) {
            //11.in catch --- handle any error diring the process.. 
            return done(error, false); //return an error if error occurs
        }
    })
)





