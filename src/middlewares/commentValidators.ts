import {body} from "express-validator";
import {checkInputErrorsMiddleware} from "./checkInputErrorsMiddleware";

export const contentValidator = body('content')
    .isString().withMessage('not string')
    .trim().isLength({min:20, max:300}).withMessage('from 20 to 300 characters')

export const commentValidators = [
    contentValidator,
    checkInputErrorsMiddleware
]