import jwt from "jsonwebtoken";
import {SETTINGS} from "../settings";


export const jwtService = {
    createAccessToken(id: string) {
        return jwt.sign({userId: id}, SETTINGS.ACCESS_TOKEN_SECRET, {expiresIn: '10m'});
    },

    createRefreshToken(id: string, deviceId: string) {
        return jwt.sign({userId: id,deviceId}, SETTINGS.REFRESH_TOKEN_SECRET, {expiresIn: '20m'})
    },

    getUserIdByAccessToken(token: string) {
        try {
            return jwt.verify(token, SETTINGS.ACCESS_TOKEN_SECRET);
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

    createRecoveryCode(userEmail: string) {
        return jwt.sign({email:userEmail}, 'RecoveryPasswordSecret', {expiresIn: '5m'});
    },

    verifyRecoveryCode(code: string) {
        try {
            return jwt.verify(code, 'RecoveryPasswordSecret');
        } catch (error) {
            console.error("Code verification error");
            return null;
        }
    }
}