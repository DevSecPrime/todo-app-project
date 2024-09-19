import passport from "passport";
import UnauthorizedException from "../exceptions/unAuthorized.exception";

export default (req, res, next) => {
    passport.authenticate("jwt", { session: false }, (err, user, info) => {
        try {
            //chekle if user is authenticated
            if (!user) {
                throw new UnauthorizedException((info && info.message) || "Token is invalid or expired");
            }
            //if authentication is successful,
            req.user = user
            return next();
        } catch (error) {
            return next(error);
        }
    })(req, res, next)
}