import {Router} from "express";
import {
    emailValidator,
    loginOrEmailValidator,
    loginValidator,
    passwordValidator
} from "../../middlewares/userValidators";
import {loginUserController} from "./loginUserController";
import {checkInputErrorsMiddleware} from "../../middlewares/checkInputErrorsMiddleware";
import {accessTokenMiddleware} from "../../middlewares/accessTokenMiddleware";
import {aboutUserController} from "./aboutUserController";
import {registrationController} from "./registrationController";
import {registrationConfirmationController} from "./registrationConfirmationController";
import {codeValidator} from "../../middlewares/codeValidator";
import {regEmailResendingController} from "./regEmailResendingController";


export const authRouter = Router();


authRouter.post("/login", loginOrEmailValidator, passwordValidator, checkInputErrorsMiddleware, loginUserController)
authRouter.get("/me", accessTokenMiddleware, aboutUserController)
authRouter.post("/registration", loginValidator, emailValidator, passwordValidator, checkInputErrorsMiddleware, registrationController)
authRouter.post("/registration-confirmation", codeValidator, checkInputErrorsMiddleware, registrationConfirmationController)
authRouter.post("/registration-email-resending", emailValidator, checkInputErrorsMiddleware, regEmailResendingController)