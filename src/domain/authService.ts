import {userRepository} from "../repositories/users/userDbRepository";
import {AccountStatusCodes, LoginInputModel, UserDBType, UserInputModel} from "../input-output-types/user auth types";
import {bcryptService} from "../adapters/bcrypt.service";
import {jwtService} from "../adapters/jwtService";
import {randomUUID} from "node:crypto";
import add from "date-fns/add";
import {nodemailerService} from "../adapters/nodemailerService";
import {emailTemplates} from "../adapters/emailTemplates";
import {ResultStatus} from "../result-object/result code";
import {userService} from "./userService";
import {ObjectId} from "mongodb";
import {tokenRepository} from "../repositories/guard/tokenRepository";
import {Payload} from "../input-output-types/token";



export const authService = {
    async loginUser(data: LoginInputModel) {
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

        const accessToken = jwtService.createAccessToken(user._id.toString());
        const refreshToken = jwtService.createRefreshToken(user._id.toString());


        return {
            status: ResultStatus.Success,
            data: [accessToken, refreshToken]
        }



    },

    async checkCredentials(loginOrEmail: string, password: string) {
        const user = await userRepository.checkUserByEmailOrLogin(loginOrEmail);
        if (!user) return null;

        const isPassCorrect = await bcryptService.checkPassword(password, user.accountData.password);
        if(!isPassCorrect) return null;

        return user;

    },

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
            .sendEmail(
                newUserData.accountData.email,
                newUserData.emailConfirmation.confirmationCode,
                emailTemplates.registrationEmail
            )
            .catch(error => console.log("error when trying to send email", error));



        return {
            status: ResultStatus.Success,
            data: newUserId
        }

    },

    async confirmRegistration(code: string) {
        const user = await userService.findUserByCode(code);
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

    },

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
        const result = await userService.userConfirmationCodeUpdate(newCode, user._id.toString());
        if (!result) return {
            status: ResultStatus.BadRequest,
            data: null
        }

        nodemailerService
            .sendEmail(
                user.accountData.email,
                newCode,
                emailTemplates.registrationEmail
            )
            .catch(error => console.log("error when trying to send email", error))

        return {
            status: ResultStatus.NoContent,
            data: null
        }
    },

    async refreshToken(oldToken: string, userData: Payload) {
        await tokenRepository.addToken(oldToken, new Date(userData.exp * 1000));
        const userId = userData.id;
        const newAccessToken = jwtService.createAccessToken(userId);
        const newRefreshToken = jwtService.createRefreshToken(userId);

        return {
            status: ResultStatus.Success,
            data: [newAccessToken, newRefreshToken]
        }

    },

    async logout(token: string, userData: Payload) {
        await tokenRepository.addToken(token, new Date(userData.exp * 1000));

        return {
            status: ResultStatus.NoContent,
            data: null
        }
    }
}