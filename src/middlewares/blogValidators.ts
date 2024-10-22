import {body} from 'express-validator';
import {checkInputErrorsMiddleware} from "./checkInputErrorsMiddleware";

export const nameValidator = body('name')
    .isString().withMessage('not string')
    .trim().isLength({min: 1, max: 15}).withMessage('from 1 to 15 characters')


export const descriptionValidator = body('description')
    .isString().withMessage('not string')
    .trim().isLength({min: 1, max: 500}).withMessage('from 1 to 500 characters')

export const websiteUrlValidator = body('websiteUrl')
    .isString().withMessage('not string')
    .trim().isURL().withMessage('not url')
    .isLength({min: 1, max: 100}).withMessage('from 1 to 100 characters')

// export const findBlogValidator = async (req: Request<{ id: string }>,
//                                         res: Response, next: NextFunction) => {
//     const blog = blogRepository.find(req.params.id);
//     if (!blog) {
//         console.log("Validator found no ID")
//         res.sendStatus(404)
//         return
//     }
//     next()
//
// }

export const blogValidators = [
    nameValidator,
    descriptionValidator,
    websiteUrlValidator,
    checkInputErrorsMiddleware
]