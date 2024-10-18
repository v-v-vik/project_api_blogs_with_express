import {NextFunction, Request, Response} from "express";
import {SETTINGS} from "../settings";



// export const fromBase64ToUTF8 = (code: string) => {
//     const buff = Buffer.from(code, 'base64');
//     return buff.toString('utf8');
// }

export const fromUTFToBase64 = (code:string) => {
    const buff2 = Buffer.from(code, 'utf8');
    return buff2.toString('base64');
}


export const authMiddleware = (req: Request,
                               res: Response,
                               next: NextFunction)=> {
    const auth = req.headers['authorization'] as string;
    if (!auth) {
        res.sendStatus(401)
        return
    }
    if (auth.slice(0, 6) !== "Basic ") {
        res.sendStatus(401)
        return
    }

    const decodedAuth = fromUTFToBase64(SETTINGS.ADMIN);
    if (auth.slice(6) !== decodedAuth) {
        res.sendStatus(401)
        return
    }

    next();
}