import {bcryptService} from "../adapters/bcrypt.service";
import {userRepository} from "../repositories/users/userDbRepository";
import {randomUUID} from "node:crypto";
import add from "date-fns/add";
import {ObjectId} from "mongodb";
import {AccountStatusCodes, UserDBType, UserInputModel} from "../domain/user entity";


export const userService = {
    async createUser(data: UserInputModel) {
        const {login, password, email} = data;
        const user = await userRepository.findUserByEmailOrLogin(login, email);
        if (user) return null;

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
                status: AccountStatusCodes.confirmed
            }
        }

        return await userRepository.createUser(newUserData);

    },


    async deleteUser(id: string): Promise<boolean> {
        const user = await userRepository.findUserById(id);
        if (user) {
            return await userRepository.deleteUser(id);
        } else {
           return false;
        }
    },

    async deleteAllUsers() {
        return await userRepository.deleteAllUsers();
    },

    async findUserById(id: string) {
        return await userRepository.findUserById(id);
    },

    async findUserByCode(code: string): Promise<UserDBType | null> {
        return await userRepository.findUserByCode(code);
    },

    async userConfirmationCodeUpdate(code: string, id: string): Promise<boolean> {
        return await userRepository.confirmationCodeUpdate(code, id);
    }

}