import {Router} from "express";
import {authMiddleware} from "../middlewares/authMiddleware";
import {postValidators} from "../middlewares/postValidators";
import {objectIdValidator} from "../middlewares/objectIdValidator";
import {accessTokenMiddleware} from "../middlewares/accessTokenMiddleware";
import {commentValidators} from "../middlewares/commentValidators";
import {postController} from "../controllers/posts-controller";
import {commentController} from "../controllers/comments-controller";
import {likeStatusValidator} from "../middlewares/likeValidator";
import {checkInputErrorsMiddleware} from "../middlewares/checkInputErrorsMiddleware";


export const postRouter = Router();

postRouter.post(
    "/",
    authMiddleware,
    postValidators,
    postController.create
);
postRouter.get(
    "/",
    postController.find
);
postRouter.get(
    "/:id",
    objectIdValidator,
    postController.findById
);
postRouter.put(
    "/:id",
    authMiddleware,
    objectIdValidator,
    postValidators,
    postController.update
);

postRouter.put(
    "/:id/like-status",
    accessTokenMiddleware,
    objectIdValidator,
    likeStatusValidator,
    checkInputErrorsMiddleware,
    postController.addReaction
);

postRouter.delete(
    "/:id",
    authMiddleware,
    objectIdValidator,
    postController.delete
);

//////////////////////comments related routes//////////////////////

postRouter.post(
    "/:id/comments",
    accessTokenMiddleware,
    objectIdValidator,
    commentValidators,
    commentController.create
);

postRouter.get(
    "/:id/comments",
    objectIdValidator,
    commentController.findByPostId
)