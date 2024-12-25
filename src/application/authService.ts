import {userRepository} from "../repositories/users/userDbRepository";
import {CodePayload, NewPwRecoveryInputModel, PasswordRecoveryModel, PayloadRT} from "../input-output-types/auth types";
import {bcryptService} from "../adapters/bcrypt.service";
import {jwtService} from "../adapters/jwtService";
import {randomUUID} from "node:crypto";
import add from "date-fns/add";
import {nodemailerService} from "../adapters/nodemailerService";
import {emailTemplates} from "../adapters/emailTemplates";
import {ResultStatus} from "../domain/result-object/result code";
import {userService} from "./userService";
import {ObjectId} from "mongodb";
import {sessionRepository} from "../repositories/guard/sessionRepository";
import {AccountStatusCodes, LoginInputModel, UserDBType, UserInputModel} from "../domain/user entity";


class AuthService {
    async loginUser(data: LoginInputModel, ip: string, deviceName: string) {
        const { loginOrEmail, password } = data;
        const user = await this.checkCredentials(loginOrEmail, password);
        if (!user) return {
            status: ResultStatus.Unauthorized,
            data: null
        }
        if (user.emailConfirmation.status === 0) {
            return {
                status: ResultStatus.Unauthorized,
                data: null
            }
        }
        const dId = randomUUID();
        const accessToken = jwtService.createAccessToken(user._id.toString());
        const refreshToken = jwtService.createRefreshToken(user._id.toString(),dId);
        const payload = jwtService.verifyRefreshToken(refreshToken) as PayloadRT;
        const result = await sessionRepository.addSession(payload, ip, deviceName, dId);
        if (result) {
            return {
                status: ResultStatus.Success,
                data: [accessToken, refreshToken]
            }
        }
        return {
            status: ResultStatus.BadRequest,
            data: null
        }
    }

    async checkCredentials(loginOrEmail: string, password: string) {
        const user = await userRepository.checkUserByEmailOrLogin(loginOrEmail);
        if (!user) return null;
        const isPassCorrect = await bcryptService.checkPassword(password, user.accountData.password);
        if(!isPassCorrect) return null;
        return user;

    }

    async registerUser(data: UserInputModel) {
        const {login, password, email} = data;
        const user = await userRepository.findUserByEmailOrLogin(login, email);
        if (user?.accountData.login === login) return {
            status: ResultStatus.BadRequest,
            data: {
                errorsMessages: [{field: 'login', message: 'login already exists'}]
            }
        };
        if (user?.accountData.email === email) return {
            status: ResultStatus.BadRequest,
            data: {
                errorsMessages: [{field: 'email', message: 'email already exists'}]
            }
        }
        const hashedPassword = await bcryptService.passwordHash(password);
        const newUserData:UserDBType = {
            _id: new ObjectId(),
            accountData: {
                login,
                email,
                password: hashedPassword,
                createdAt: new Date().toISOString()
            },
            emailConfirmation: {
                confirmationCode: randomUUID(),
                expirationDate: add(new Date(), {
                    hours: 1,
                    minutes: 2
                }),
                status: AccountStatusCodes.notConfirmed
            }
        }
        const newUserId = await userRepository.createUser(newUserData);
        nodemailerService
            .sendRegistrationConfirmationEmail(
                newUserData.accountData.email,
                newUserData.emailConfirmation.confirmationCode,
                emailTemplates.registrationEmail
            )
            .catch(error => console.log("error when trying to send email", error));
        return {
            status: ResultStatus.Success,
            data: newUserId
        }
    }

    async confirmRegistration(code: string) {
        const user = await userService.findByCode(code);
        console.log("user to confirm:", user)
        if (!user) return {
            status: ResultStatus.BadRequest,
            data: { errorsMessages: [{field: 'code', message: 'code does not exist'}] }
        }
        if (user.emailConfirmation.status === 1) return {
            status: ResultStatus.BadRequest,
            data: { errorsMessages: [{field: 'code', message: 'user is confirmed'}] }
        }
        if (user.emailConfirmation.confirmationCode === code && user.emailConfirmation.expirationDate > new Date()) {
            const userId = user._id.toString();
            console.log("this user id", userId);
            return await userRepository.updateRegistrationStatus(userId);
        }
        return {
            status: ResultStatus.BadRequest,
            data: { errorsMessages: [{field: 'code', message: 'code expired'}] }
        }
    }

    async confirmationEmailResend(email: string) {
        const user = await userRepository.checkUserByEmailOrLogin(email);
        if (!user) return {
            status: ResultStatus.BadRequest,
            data: {errorsMessages: [{field: 'email', message: 'user does not exist'}]}
        }
        if (user.emailConfirmation.status === 1) {
            return {
                status: ResultStatus.BadRequest,
                data: {errorsMessages: [{field: 'email', message: 'email was already confirmed'}]}
            }
        }
        const newCode = randomUUID();
        const result = await userService.updateConfirmationCode(newCode, user._id.toString());
        if (!result) return {
            status: ResultStatus.BadRequest,
            data: null
        }
        nodemailerService
            .sendRegistrationConfirmationEmail(
                user.accountData.email,
                newCode,
                emailTemplates.registrationEmail
            )
            .catch(error => console.log("error when trying to send email", error))
        return {
            status: ResultStatus.NoContent,
            data: null
        }
    }

    async refreshToken(userData: PayloadRT) {
        const userId = userData.userId;
        const newAccessToken = jwtService.createAccessToken(userId);
        const newRefreshToken = jwtService.createRefreshToken(userId, userData.deviceId);
        const newTokenDate = jwtService.verifyRefreshToken(newRefreshToken) as { iat: number };
        await sessionRepository.updateSession(userData, newTokenDate.iat);
        return {
            status: ResultStatus.Success,
            data: [newAccessToken, newRefreshToken]
        }
    }

    async logoutUser(deviceId: string) {
        const res = await sessionRepository.terminateSessionById(deviceId);
        if (!res) {
            return {
                status: ResultStatus.BadRequest,
                data: null
            }
        }
        return {
            status: ResultStatus.NoContent,
            data:null
        }
    }

    async newPasswordRequest(data: PasswordRecoveryModel) {

        const newCode = jwtService.createRecoveryCode(data.email);
        nodemailerService
            .sendPasswordRecoveryEmail(
                data.email,
                newCode,
                emailTemplates.passwordRecoveryEmail
            )
            .catch(error => console.log("error when trying to send email", error));
        return true
    }

    async passwordUpdate(data: NewPwRecoveryInputModel) {
        const { newPassword, recoveryCode } = data;
        const codePayload = jwtService.verifyRecoveryCode(recoveryCode) as CodePayload;
        if (!codePayload) {
            return {
                status: ResultStatus.BadRequest,
                data: {errorsMessages: [{field: 'recoveryCode', message: 'code expired or incorrect'}] }
            }
        }
        const user: UserDBType | null = await userRepository.checkUserByEmailOrLogin(codePayload.email);
        if (!user) {
            return {
                status: ResultStatus.Unauthorized,
                data: { errorsMessages: [{field: 'user', message: 'user does not exist'}] }
            }
        }
        const newHashedPassword = await bcryptService.passwordHash(newPassword);
        const res = await userRepository.updatePassword(user?._id.toString(), newHashedPassword);
        if (!res) {
            return {
                status: ResultStatus.BadRequest,
                data: {errorsMessages: [{field: 'password recovery', message: 'could not update password'}] }
            }
        }
        return {
            status: ResultStatus.NoContent,
            data: null
        }
    }
}

export const authService = new AuthService();