import {Router} from "express";
import {authMiddleware} from "../../middlewares/authMiddleware";
import {userValidators} from "../../middlewares/userValidators";
import {createUserController} from "./createUserController";
import {findUsersController} from "./findUsersController";
import {deleteUserController} from "./deleteUserController";


export const userRouter = Router();

userRouter.post("/", authMiddleware, userValidators, createUserController);
userRouter.delete("/:id", authMiddleware, deleteUserController);
userRouter.get("/", authMiddleware, findUsersController)