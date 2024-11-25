import {Router} from "express";
import {loginOrEmailValidator, passwordValidator} from "../../middlewares/userValidators";
import {loginUserController} from "./loginUserController";
import {checkInputErrorsMiddleware} from "../../middlewares/checkInputErrorsMiddleware";
import {accessTokenMiddleware} from "../../middlewares/accessTokenMiddleware";
import {aboutUserController} from "./aboutUserController";


export const authRouter = Router();


authRouter.post("/login", loginOrEmailValidator, passwordValidator, checkInputErrorsMiddleware, loginUserController)
authRouter.get("/me", accessTokenMiddleware, aboutUserController)