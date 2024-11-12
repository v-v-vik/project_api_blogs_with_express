import {UserDBType} from "../input-output-types/user types";
import jwt from "jsonwebtoken";
import {SETTINGS} from "../settings";

export const jwtService = {
    async createJWT(user: UserDBType) {
        return jwt.sign({userId: user._id}, SETTINGS.JWT_SECRET, {expiresIn: '1h'});
    }
}