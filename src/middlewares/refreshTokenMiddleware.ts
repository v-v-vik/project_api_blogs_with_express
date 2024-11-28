import {NextFunction, Request, Response} from "express";
import {jwtService} from "../adapters/jwtService";
import {HttpStatuses} from "../result-object/result code";
import {tokenRepository} from "../repositories/guard/tokenRepository";

export const refreshTokenMiddleware = async (req: Request,
                                            res: Response,
                                            next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        res.status(HttpStatuses.Unauthorized).send({errorsMessages: [{field: 'token', message: 'unauthorized'}]})
        return;
    }

    const payload = jwtService.verifyRefreshToken(refreshToken);
    if (!payload) {
        res.sendStatus(HttpStatuses.Unauthorized);
        return;
    }


    if (await tokenRepository.isTokenBlacklisted(refreshToken)) {
        res.status(HttpStatuses.Unauthorized).send({errorsMessages: [{field: 'token', message: 'Token is blocked'}]});
        return;
    }

    req.body = payload;


    next()


}