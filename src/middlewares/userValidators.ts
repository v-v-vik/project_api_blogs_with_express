import {body} from "express-validator";
import {checkInputErrorsMiddleware} from "./checkInputErrorsMiddleware";


export const loginValidator = body('login')
    .isString().withMessage('not string')
    .trim().isLength({ min: 3, max: 10 }).withMessage('from 3 to 10 characters').matches(/^[a-zA-Z0-9_-]*$/)
    .withMessage("Login must contain only letters, numbers or underscores")

export const passwordValidator = body('password')
    .isString().withMessage('not string')
    .trim().isLength({min:6, max:20}).withMessage('from 6 to 20 characters')

export const emailValidator = body('email')
    .isString().withMessage('not string')
    .trim().isEmail().withMessage('not email')

export const loginOrEmailValidator = body('loginOrEmail')
    .isString().withMessage('not string')
    .trim().isLength({min:3}).withMessage('Login or Email is too short')
export const userValidators = [
    loginValidator,
    passwordValidator,
    emailValidator,
    checkInputErrorsMiddleware
]