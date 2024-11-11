import {Router} from "express";
import {loginOrEmailValidator, passwordValidator} from "../../middlewares/userValidators";
import {loginUserController} from "./loginUserController";
import {checkInputErrorsMiddleware} from "../../middlewares/checkInputErrorsMiddleware";


export const authRouter = Router();


authRouter.post("/login", loginOrEmailValidator, passwordValidator, checkInputErrorsMiddleware, loginUserController)