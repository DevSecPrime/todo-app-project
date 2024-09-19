//import router
import express from "express";

import groupController from "./group.controller";
import expressAsyncHandler from "express-async-handler";
import validator from "../../comman/config/validation";
import { groupSchema } from "./dtos/group.dtos";
import authMiddleware from "../../comman/middleware/auth.middleware";

// create router instance
const router = express.Router();

router.post("/create-group",
    authMiddleware,
    validator.body(groupSchema),
    expressAsyncHandler(groupController.createGroup)
)

router.put("/update-group/:id",
    authMiddleware,
    validator.body(groupSchema),
    expressAsyncHandler(groupController.updateGroup)
)

router.get("/all-groups",
    authMiddleware,
    expressAsyncHandler(groupController.getAllGroups)
)

router.delete("/delete-group/:id",
    authMiddleware,
    expressAsyncHandler(groupController.deleleteGroup)
)
//export router
export default router;