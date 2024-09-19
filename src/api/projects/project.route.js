
import express from "express";
import projectCntroller from "./project.cntroller";
import validator from "../../comman/config/validation";
import { projectSchema } from "./dtos/project.dtos";
import authMiddleware from "../../comman/middleware/auth.middleware";
import expressAsyncHandler from "express-async-handler";

const router = express.Router();

router.post("/create-project",
    authMiddleware,
    validator.body(projectSchema),
    expressAsyncHandler(projectCntroller.createProject)
);

router.put("/update-project/:id",
    authMiddleware,
    validator.body(projectSchema),
    expressAsyncHandler(projectCntroller.updateProject)
)

router.delete("/delete-project/:projectId",
    authMiddleware,
    expressAsyncHandler(projectCntroller.deleteProject)
)

router.get("/all-projects/:groupId",
    authMiddleware,
    expressAsyncHandler(projectCntroller.getAllProjects)
)
export default router;