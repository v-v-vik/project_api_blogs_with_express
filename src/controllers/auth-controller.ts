import {LoginInputModel, RegistrationEmailResendingModel, UserInputModel} from "../domain/user entity";
import {matchedData} from "express-validator";
import {authService} from "../application/authService";
import {HttpStatuses, resultCode, ResultModel, ResultStatus} from "../domain/result-object/result code";
import {Request, Response} from "express";
import {userQueryRepository} from "../repositories/users/userQueryRepository";
import {RegistrationConfirmationCodeModel} from "../input-output-types/some";
import {NewPwRecoveryInputModel, PasswordRecoveryModel} from "../input-output-types/auth types";


class AuthController {
    async login(req: Request<any, any, LoginInputModel>,
                res: Response) {

        const data: LoginInputModel = matchedData(req);
        const userAgent = req.headers['user-agent'] || 'unknown device'
        if (req.ip) {
            const result = await authService.loginUser(data, req.ip, userAgent);
            if (result === null) {
                res
                    .status(HttpStatuses.BadRequest)
                    .json()
                return;
            }
            if (result?.status === ResultStatus.Unauthorized) {
                res
                    .status(HttpStatuses.Unauthorized)
                    .json()
                return;
            }
            if (result?.data) {
                res
                    .cookie("refreshToken", result.data[1], {
                        httpOnly: true,
                        secure: true,
                    })
                    .status(HttpStatuses.Success)
                    .json({accessToken: result.data[0]})
            }
        }
        res
            .status(HttpStatuses.ServerError)
            .json();
    }

    async logout(req: Request,
                 res: Response) {

        const result: ResultModel = await authService.logoutUser(req.body.deviceId);
        if (result.status === ResultStatus.BadRequest) {
            res
                .status(HttpStatuses.BadRequest)
                .json({"Error": "Failed to logout"})
            return;
        }
        res
            .clearCookie("refreshToken")
            .status(HttpStatuses.NoContent)
            .json();
    }

    async about(req: Request,
                res: Response) {

        const user = await userQueryRepository.getMeInfo(req.user.id);
        if (!user) {
            res
                .status(HttpStatuses.Unauthorized)
                .json()
            return;
        }
        res
            .status(HttpStatuses.Success)
            .json(user);
    }

    async register(req: Request<any, any, UserInputModel>,
                   res: Response) {

        const data:UserInputModel = matchedData(req);
        const result = await authService.registerUser(data);
        if (result === null) {
            res.status(HttpStatuses.BadRequest);
            return;
        }
        if (result.status !== ResultStatus.Success ) {
            res
                .status(resultCode(result.status))
                .json(result.data)
            return;
        }
        res
            .status(HttpStatuses.NoContent)
            .json()
    }

    async confirmRegistration(req: Request<any, any, RegistrationConfirmationCodeModel>,
                              res: Response){

        const data: RegistrationConfirmationCodeModel = matchedData(req);
        const result = await authService.confirmRegistration(data.code);
        if (result.status !== ResultStatus.NoContent) {
            res
                .status(resultCode(result.status))
                .json(result.data);
            return;
        }
        res
            .status(HttpStatuses.NoContent)
            .json();

    }

    async resendConfirmationEmail(req: Request<any, any, RegistrationEmailResendingModel>,
                                  res: Response) {

        const data: RegistrationEmailResendingModel = matchedData(req);
        const result = await authService.confirmationEmailResend(data.email);
        if (result === null) {
            res.status(HttpStatuses.BadRequest)
            return;
        }
        if (result.status !== ResultStatus.NoContent) {
            res
                .status(resultCode(result.status))
                .json(result.data)
            return;
        }
        res
            .status(HttpStatuses.NoContent)
            .json(result.data);
    }

    async refreshToken(req: Request,
                       res: Response) {

        const result = await authService.refreshToken(req.body);
        if (result.status !== ResultStatus.Success) {
            res
                .status(HttpStatuses.Unauthorized)
                .json();
            return;
        }
        res
            .cookie("refreshToken", result.data[1], {
                httpOnly: true,
                secure: true
            })
            .status(HttpStatuses.Success)
            .json({ accessToken: result.data[0]});
    }

    async passwordRecovery(req: Request<any, any, PasswordRecoveryModel>,
                           res: Response){

        const data: PasswordRecoveryModel = matchedData(req);
        const result = await authService.newPasswordRequest(data);
        if (!result) {
            res
                .status(HttpStatuses.BadRequest)
                .json()
            return;
        }
        res
            .status(HttpStatuses.NoContent)
            .json()
    }

    async changePassword(req: Request<any, any, NewPwRecoveryInputModel>,
                         res: Response) {

        const data: NewPwRecoveryInputModel = matchedData(req);
        const result = await authService.passwordUpdate(data);
        if (result.status !== ResultStatus.NoContent) {
            res
                .status(resultCode(result.status))
                .json(result.data);
            return;
        }
        res
            .status(HttpStatuses.NoContent)
            .json()
    }

}

export const authController = new AuthController();