import express from "express";
import validator from "../../comman/config/validation";
import taskController from "./task.controller";
import { taskSchema ,updateTaskSchema} from "./dtos/tasks.dtos";
import authMiddleware from "../../comman/middleware/auth.middleware";
import expressAsyncHandler from "express-async-handler";

const router = express.Router();

router.post("/create-task",
    authMiddleware,
    validator.body(taskSchema),
    expressAsyncHandler(taskController.createTask))

router.put("/update-task/:id",
    authMiddleware,
    validator.body(updateTaskSchema),
    expressAsyncHandler(taskController.updateTask)
)

router.get("/task-by-status",
    authMiddleware,
    expressAsyncHandler(taskController.getTaskByStatus)
)

router.get("/getAllTasks",
    authMiddleware,
    expressAsyncHandler(taskController.getAllTasks)
)

router.delete("/remove-task/:id",
    authMiddleware,
    expressAsyncHandler(taskController.removeTask)
)
export default router;