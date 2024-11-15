import {UserDBType} from "../input-output-types/user types";
import jwt from "jsonwebtoken";
import {SETTINGS} from "../settings";

export const jwtService = {
    createJWT(user: UserDBType) {
        return jwt.sign({id: user._id}, SETTINGS.JWT_SECRET, {expiresIn: '1h'});
    },

    getUserIdByToken(token: string) {
        try {
            return jwt.verify(token, SETTINGS.JWT_SECRET) as { id: string };
        } catch (error) {
            console.error("Error while token verification");
            return null;
        }
    }
}