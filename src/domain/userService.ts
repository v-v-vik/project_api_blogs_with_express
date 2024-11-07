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

    }
}