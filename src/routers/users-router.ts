import {Router} from "express";
import {authMiddleware} from "../middlewares/authMiddleware";
import {userValidators} from "../middlewares/userValidators";
import {objectIdValidator} from "../middlewares/objectIdValidator";
import {userController} from "../controllers/users-controller";


export const userRouter = Router();

userRouter.post(
    "/",
    authMiddleware,
    userValidators,
    userController.create
);
userRouter.delete(
    "/:id",
    authMiddleware,
    objectIdValidator,
    userController.delete
);
userRouter.get(
    "/",
    authMiddleware,
    userController.find
)