import express from "express";

const router = express.Router();

import userRoutes from "../api/user/user.routes";
import groupRoutes from "../api/groups/group.routes";
import projectRoutes from "../api/projects/project.route";
import taskRoutes from "../api/tasks/task.routes";

router.use("/user",userRoutes);
router.use("/group",groupRoutes);
router.use("/project",projectRoutes);
router.use("/task",taskRoutes);

export default router;