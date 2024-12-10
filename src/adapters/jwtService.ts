import jwt from "jsonwebtoken";
import {SETTINGS} from "../settings";

export const jwtService = {
    createAccessToken(id: string) {
        return jwt.sign({id}, SETTINGS.ACCESS_TOKEN_SECRET, {expiresIn: '10m'});
    },

    createRefreshToken(id: string, deviceId: string) {
        return jwt.sign({id,deviceId}, SETTINGS.REFRESH_TOKEN_SECRET, {expiresIn: '20m'})
    },

    getUserIdByAccessToken(token: string) {
        try {
            return jwt.verify(token, SETTINGS.ACCESS_TOKEN_SECRET) as { id: string };
        } catch (error) {
            console.error("Error while token verification");
            return null;
        }
    },

    verifyRefreshToken(token: string) {
        try {
            return jwt.verify(token, SETTINGS.REFRESH_TOKEN_SECRET);
        } catch (error) {
            console.error("Error while token verification");
            return null;
        }
    },

    // decodeToken(token: string) {
    //     try {
    //         return jwt.decode(token);
    //     } catch (error) {
    //         console.error("Error while token decoding");
    //         return null;
    //     }
    // }
}