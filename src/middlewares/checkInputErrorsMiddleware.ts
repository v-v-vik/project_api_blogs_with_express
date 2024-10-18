import {NextFunction, Request, Response} from "express";
import {FieldNamesType, OutputErrorsType} from "../input-output-types/error output types";
import {validationResult} from "express-validator";

export const checkInputErrorsMiddleware = (req: Request,
                                           res: Response<OutputErrorsType>,
                                           next: NextFunction) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
        const errArray = err.array({onlyFirstError:true}) as {path: FieldNamesType, msg: string}[]
        console.log(errArray)
        res.status(400).json({
            errorsMessages: errArray.map(err=>({field: err.path, message: err.msg}))
        })
        return
    }
    next()
}