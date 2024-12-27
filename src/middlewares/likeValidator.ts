import {body} from "express-validator";
import {LikeStatus} from "../domain/like entity";


export const likeStatusValidator = body('likeStatus')
    .isIn(Object.values(LikeStatus))
    .withMessage(`Invalid value. Must be one of: ${Object.values(LikeStatus).join(', ')}`);