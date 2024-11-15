import {userRepository} from "../repositories/users/userDbRepository";
import {LoginInputModel} from "../input-output-types/user types";
import {bcryptService} from "../adapters/bcrypt.service";
import {jwtService} from "../adapters/jwtService";


export const authService = {
    async loginUser(data: LoginInputModel) {
        const { loginOrEmail, password } = data;
        const user = await this.checkCredentials(loginOrEmail, password);
        if (!user) return null;

        return jwtService.createJWT(user);
    },

    async checkCredentials(loginOrEmail: string, password: string) {
        const user = await userRepository.checkUserByEmailOrLogin(loginOrEmail);
        if (!user) return null;

        const isPassCorrect = await bcryptService.checkPassword(password, user.password);
        if(!isPassCorrect) return null;

        return user;

    }
}