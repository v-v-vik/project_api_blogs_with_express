import {UserDBType, UserInputModel} from "../input-output-types/user types";
import {bcryptService} from "../adapters/bcrypt.service";
import {userRepository} from "../repositories/users/userDbRepository";


export const userService = {
    async createUser(data: UserInputModel) {
        const {login, password, email} = data;
        const user = await userRepository.findUserByEmailOrLogin(login, email);
        if (user) return null;

        const hashedPassword = await bcryptService.passwordHash(password);

        const newUserData:UserDBType = {
            login,
            email,
            password: hashedPassword,
            createdAt: new Date().toISOString()
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
    }

}