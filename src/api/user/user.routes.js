//create express instance
import express from "express";
import expressAsyncHandler from "express-async-handler";
import UserController from "./user.controller";
import validator from "../../comman/config/validation"
import { otpSchema, registrationSchema, loginSchema, profileCredentials } from "./dtos/user.dtos";
import authMiddleware from "../../comman/middleware/auth.middleware";

//create router
const router = express.Router();

//import controller
router.post("/register",
    validator.body(registrationSchema),
    expressAsyncHandler(UserController.register)
)
router.post(
    "/send-otp",
    expressAsyncHandler(UserController.sendOtp)
)

router.post("/verify-otp",
    validator.body(otpSchema),
    expressAsyncHandler(UserController.verifyOtp)
)

router.post("/login",
    validator.body(loginSchema),
    expressAsyncHandler(UserController.login)
)

router.get("/profile",
    authMiddleware,
    expressAsyncHandler(UserController.getProfile)
)

router.put("/updateProfile",
    authMiddleware,
    validator.body(profileCredentials),
    expressAsyncHandler(UserController.updateProfile)
)
router.post("/logout",
    authMiddleware,
    expressAsyncHandler(UserController.logOut)
)

router.delete("/delete-account",
    authMiddleware,
    expressAsyncHandler(UserController.deleteAccount)
)
router.post("/forgetPassword",
    expressAsyncHandler(UserController.forgetPassword)
)

router.post("/changePassword",
    authMiddleware,
    expressAsyncHandler(UserController.changePassword)
)

router.post("/resetPasswordToken",
    expressAsyncHandler(UserController.resetPasswordToken)
)


//export router
export default router;
