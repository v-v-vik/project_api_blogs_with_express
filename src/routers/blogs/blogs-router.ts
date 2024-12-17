import {Router} from "express";
import {createBlogController} from "./createBlogController";
// import {findBlogsController} from "./findBlogsController";
import {updateBlogController} from "./updateBlogController";
import {deleteBlogController} from "./deleteBlogController";
import {authMiddleware} from "../../middlewares/authMiddleware";
import {blogValidators} from "../../middlewares/blogValidators";
import {contentValidator, descriptionValidator, titleValidator} from "../../middlewares/postValidators";
import {findBlogByIdController} from "./findBlogByIdController";
import {objectIdValidator} from "../../middlewares/objectIdValidator";
import {createPostByBlogIdController} from "../posts/createPostByBlogIdController";
import {checkInputErrorsMiddleware} from "../../middlewares/checkInputErrorsMiddleware";
import {findPostsByBlogIdController} from "../posts/findPostsByBlogIdController";
import {findBlogsController} from "./findBlogsController";


export const blogRouter = Router();

blogRouter.post(
    "/",
    authMiddleware,
    blogValidators,
    createBlogController
);
blogRouter.post(
    "/:id/posts",
    authMiddleware,
    objectIdValidator,
    titleValidator,
    descriptionValidator,
    contentValidator,
    checkInputErrorsMiddleware,
    createPostByBlogIdController);
blogRouter.get(
    "/",
    findBlogsController
);
blogRouter.get(
    "/:id",
    objectIdValidator,
    findBlogByIdController)
blogRouter.get(
    "/:id/posts",
    objectIdValidator,
    findPostsByBlogIdController
);
blogRouter.put(
    "/:id",
    authMiddleware,
    objectIdValidator,
    blogValidators,
    updateBlogController
);
blogRouter.delete(
    "/:id",
    authMiddleware,
    objectIdValidator,
    deleteBlogController
);
