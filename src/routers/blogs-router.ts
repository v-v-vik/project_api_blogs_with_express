import {Router} from "express";
import {authMiddleware} from "../middlewares/authMiddleware";
import {blogValidators} from "../middlewares/blogValidators";
import {contentValidator, descriptionValidator, titleValidator} from "../middlewares/postValidators";
import {objectIdValidator} from "../middlewares/objectIdValidator";
import {checkInputErrorsMiddleware} from "../middlewares/checkInputErrorsMiddleware";
import {blogController} from "../controllers/blogs-controller";
import {postController} from "../controllers/posts-controller";


export const blogRouter = Router();

blogRouter.post(
    "/",
    authMiddleware,
    blogValidators,
    blogController.create
);
blogRouter.get(
    "/",
    blogController.find
);
blogRouter.get(
    "/:id",
    objectIdValidator,
    blogController.findById
);
blogRouter.put(
    "/:id",
    authMiddleware,
    objectIdValidator,
    blogValidators,
    blogController.update
);
blogRouter.delete(
    "/:id",
    authMiddleware,
    objectIdValidator,
    blogController.delete
);

//////////////////////posts related routes//////////////////////

blogRouter.get(
    "/:id/posts",
    objectIdValidator,
    postController.findByBlogId
);
blogRouter.post(
    "/:id/posts",
    authMiddleware,
    objectIdValidator,
    titleValidator,
    descriptionValidator,
    contentValidator,
    checkInputErrorsMiddleware,
    postController.createByBlogId
);