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

        const accessToken = jwtService.createJWT(user);

        return {
            status: ResultStatus.Success,
            data: accessToken
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
            data: { ErrorMessage: "The user with this code does not exist" }
        }

        if (user.emailConfirmation.confirmationCode === code && user.emailConfirmation.expirationDate > new Date()) {
            const userId = user._id.toString();
            console.log("this user id", userId);
            return await userRepository.updateRegistrationStatus(userId);

        }

        return {
            status: ResultStatus.BadRequest,
            data: { ErrorMessage: "The code does not exist or expired" }
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
    }
}