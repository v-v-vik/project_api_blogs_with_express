import {userDbRepository} from "../repositories/users/userDbRepository";
import {LoginInputModel} from "../input-output-types/user types";
import {bcryptService} from "../adapters/bcrypt.service";


export const authService = {
    async loginUser(data: LoginInputModel) {
        const { loginOrEmail, password } = data;
        const user = await userDbRepository.checkUserByEmailOrLogin(loginOrEmail);
        console.log(user);
        if (!user) {
            return null;
        }
        const result = await bcryptService.checkPassword(password, user.password);
        console.log("result", result);
        if (!result) {
            return null;
        }
        return true;
    }
}