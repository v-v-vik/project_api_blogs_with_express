import {NextFunction, Request, Response} from "express";
import {jwtService} from "../adapters/jwtService";
import {userService} from "../domain/userService";

export const accessTokenMiddleware = async (req: Request,
                                      res: Response,
                                      next: NextFunction) => {
    if (!req.headers.authorization) {
        res.sendStatus(401);
        return;
    }

    const token = req.headers.authorization.split(' ')[1];

    const tokenUserId = jwtService.getUserIdByToken(token);
    if (!tokenUserId) {
        res.sendStatus(401);
        return;
    }

    const user = await userService.findUserById(tokenUserId.id);
    if (!user) {
        res.sendStatus(401);
        return;
    }

    req.user = tokenUserId;
    next()

}