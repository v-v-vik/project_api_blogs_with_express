import {NextFunction, Request, Response} from "express";
import {jwtService} from "../adapters/jwtService";
import {HttpStatuses} from "../result-object/result code";
import {sessionRepository} from "../repositories/guard/sessionRepository";
import {Payload} from "../input-output-types/token";

export const refreshTokenMiddleware = async (req: Request,
                                            res: Response,
                                            next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        res.status(HttpStatuses.Unauthorized).send({errorsMessages: [{field: 'token', message: 'unauthorized'}]})
        return;
    }

    const payload = jwtService.verifyRefreshToken(refreshToken) as Payload;
    if (!payload) {
        res.sendStatus(HttpStatuses.Unauthorized);
        return;
    }


    if (await sessionRepository.tokenListed(payload)) {

        req.body = payload;


        next()

    }

    res.status(HttpStatuses.Unauthorized).send({errorsMessages: [{field: 'token', message: 'Token is blocked'}]});
    return;




}