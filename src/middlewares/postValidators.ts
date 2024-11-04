import {body} from "express-validator";
import {checkInputErrorsMiddleware} from "./checkInputErrorsMiddleware";
import {blogQueryRepository} from "../repositories/blogQueryRepository";


export const titleValidator = body('title')
    .isString().withMessage('not string')
    .trim().isLength({min: 1, max: 30}).withMessage('from 1 to 30 characters');

export const descriptionValidator = body('shortDescription')
    .isString().withMessage('not string')
    .trim().isLength({min: 1, max: 100}).withMessage('from 1 to 100 characters');

export const contentValidator = body('content')
    .isString().withMessage('not string')
    .trim().isLength({min: 1, max: 1000}).withMessage('from 1 to 1000 characters');

export const blogIdValidator = body('blogId')
    .isString().withMessage('not string')
    .trim()
    .custom(async blogId => {
        const blog = await blogQueryRepository.getBlogById(blogId);
        if (!blog) {
            throw new Error("invalid blogId field");
        }
    })



export const postValidators = [
    titleValidator,
    descriptionValidator,
    contentValidator,
    blogIdValidator,
    checkInputErrorsMiddleware
]