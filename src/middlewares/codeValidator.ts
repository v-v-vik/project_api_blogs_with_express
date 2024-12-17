import {body} from "express-validator";


export const codeValidator = body('code')
    .custom(async code => {
        const isUuid = new RegExp(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
        ).test(code);
        if (!isUuid) {
            throw new Error("Incorrect code");
        }
    })

export const recoveryCodeValidator = body('recoveryCode')
    .isString().withMessage('Code is not valid')
