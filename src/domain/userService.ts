import {UserDBType, UserInputModel} from "../input-output-types/user types";
import {bcryptService} from "../adapters/bcrypt.service";
import {userDbRepository} from "../repositories/users/userDbRepository";


export const userService = {
    async createUser(data: UserInputModel) {
        const {login, password, email} = data;
        const user = await userDbRepository.findUserByEmailOrLogin(login, email);
        if (user) return null;

        const hashedPassword = await bcryptService.passwordHash(password);

        const newUserData:UserDBType = {
            login,
            email,
            password: hashedPassword,
            createdAt: new Date().toISOString()
        }

        return await userDbRepository.createUser(newUserData);

    },

    async deleteUser(id: string): Promise<boolean> {
        const user = await userDbRepository.findUserById(id);
        if (user) {
            return await userDbRepository.deleteUser(id);
        } else {
           return false;
        }
    },

    async deleteAllUsers() {
        return await userDbRepository.deleteAllUsers();
    },

    async findUserById(id: string) {
        return await userDbRepository.findUserById(id);
    }

}