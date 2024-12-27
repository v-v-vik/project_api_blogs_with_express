import {Router} from "express";
import {
    emailValidator,
    loginOrEmailValidator,
    loginValidator,
    newPasswordValidator,
    passwordValidator
} from "../middlewares/userValidators";
import {checkInputErrorsMiddleware} from "../middlewares/checkInputErrorsMiddleware";
import {accessTokenMiddleware} from "../middlewares/accessTokenMiddleware";
import {codeValidator, recoveryCodeValidator} from "../middlewares/codeValidator";
import {refreshTokenMiddleware} from "../middlewares/refreshTokenMiddleware";
import {rateLimitMiddleware} from "../middlewares/rate limits/rateLimit";
import {authController} from "../controllers/auth-controller";


export const authRouter = Router();


authRouter.post(
    "/login",
    rateLimitMiddleware,
    loginOrEmailValidator,
    passwordValidator,
    checkInputErrorsMiddleware,
    authController.login
)
authRouter.get(
    "/me",
    accessTokenMiddleware,
    authController.about
)
authRouter.post(
    "/registration",
    rateLimitMiddleware,
    loginValidator,
    emailValidator,
    passwordValidator,
    checkInputErrorsMiddleware,
    authController.register
)
authRouter.post(
    "/registration-confirmation",
    rateLimitMiddleware,
    codeValidator,
    checkInputErrorsMiddleware,
    authController.confirmRegistration
)
authRouter.post(
    "/registration-email-resending",
    rateLimitMiddleware, emailValidator,
    checkInputErrorsMiddleware,
    authController.resendConfirmationEmail
)
authRouter.post(
    "/refresh-token",
    refreshTokenMiddleware,
    authController.refreshToken
)
authRouter.post(
    "/logout",
    refreshTokenMiddleware,
    authController.logout
)
authRouter.post(
    "/password-recovery",
    rateLimitMiddleware,
    emailValidator,
    checkInputErrorsMiddleware,
    authController.passwordRecovery
)
authRouter.post(
    "/new-password",
    rateLimitMiddleware,
    newPasswordValidator,
    recoveryCodeValidator,
    checkInputErrorsMiddleware,
    authController.changePassword
)