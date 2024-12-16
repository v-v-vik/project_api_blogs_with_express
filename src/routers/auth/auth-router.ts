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
import {codeValidator, recoveryCodeValidator} from "../../middlewares/codeValidator";
import {regEmailResendingController} from "./regEmailResendingController";
import {refreshTokenMiddleware} from "../../middlewares/refreshTokenMiddleware";
import {refreshTokenController} from "./refreshTokenController";
import {logoutController} from "./logoutController";
import {rateLimitMiddleware} from "../../middlewares/rate limits/rateLimit";
import {passwordRecoveryController} from "./passwordRecoveryController";
import {newPasswordController} from "./newPasswordController";


export const authRouter = Router();


authRouter.post(
    "/login",
    rateLimitMiddleware,
    loginOrEmailValidator,
    passwordValidator,
    checkInputErrorsMiddleware,
    loginUserController
)
authRouter.get(
    "/me",
    accessTokenMiddleware,
    aboutUserController
)
authRouter.post(
    "/registration",
    rateLimitMiddleware,
    loginValidator,
    emailValidator,
    passwordValidator,
    checkInputErrorsMiddleware,
    registrationController)
authRouter.post(
    "/registration-confirmation",
    rateLimitMiddleware,
    codeValidator,
    checkInputErrorsMiddleware,
    registrationConfirmationController
)
authRouter.post(
    "/registration-email-resending",
    rateLimitMiddleware, emailValidator,
    checkInputErrorsMiddleware,
    regEmailResendingController
)
authRouter.post(
    "/refresh-token",
    refreshTokenMiddleware,
    refreshTokenController
)
authRouter.post(
    "/logout",
    refreshTokenMiddleware,
    logoutController
)
authRouter.post(
    "/password-recovery",
    rateLimitMiddleware,
    emailValidator,
    checkInputErrorsMiddleware,
    passwordRecoveryController)
authRouter.post(
    "/new-password",
    rateLimitMiddleware,
    passwordValidator,
    recoveryCodeValidator,
    checkInputErrorsMiddleware,
    newPasswordController )