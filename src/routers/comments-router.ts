import {Router} from "express";
import {objectIdValidator} from "../middlewares/objectIdValidator";
import {accessTokenMiddleware} from "../middlewares/accessTokenMiddleware";
import {commentValidators} from "../middlewares/commentValidators";
import {likeStatusValidator} from "../middlewares/likeValidator";
import {checkInputErrorsMiddleware} from "../middlewares/checkInputErrorsMiddleware";
import {commentController} from "../controllers/comments-controller";


export const commentRouter = Router();

commentRouter.get(
    "/:id",
    objectIdValidator,
    commentController.findById
);
commentRouter.put(
    "/:id",
    accessTokenMiddleware,
    objectIdValidator,
    commentValidators,
    commentController.update
);
commentRouter.put(
    "/:id/like-status",
    accessTokenMiddleware,
    objectIdValidator,
    likeStatusValidator,
    checkInputErrorsMiddleware,
    commentController.addReaction
)
commentRouter.delete(
    "/:id",
    accessTokenMiddleware,
    objectIdValidator,
    commentController.delete
);
