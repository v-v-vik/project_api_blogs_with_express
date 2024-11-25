import {Router} from "express";
import {createPostController} from "./createPostController";
import {findPostByIdController} from "./findPostByIdController";
import {findPostsController} from "./findPostsController";
import {updatePostController} from "./updatePostController";
import {deletePostController} from "./deletePostController";
import {authMiddleware} from "../../middlewares/authMiddleware";
import {postValidators} from "../../middlewares/postValidators";
import {objectIdValidator} from "../../middlewares/objectIdValidator";
import {accessTokenMiddleware} from "../../middlewares/accessTokenMiddleware";
import {commentValidators} from "../../middlewares/commentValidators";
import {createCommentController} from "../comments/createCommentController";
import {findCommentsByPostIdController} from "../comments/findCommentsByPostIdController";


export const postRouter = Router();

postRouter.post("/", authMiddleware, postValidators, createPostController);
postRouter.post("/:id/comments", accessTokenMiddleware, objectIdValidator, commentValidators, createCommentController)
postRouter.get("/", findPostsController);
postRouter.get("/:id", objectIdValidator, findPostByIdController);
postRouter.get("/:id/comments", objectIdValidator, findCommentsByPostIdController)
postRouter.put("/:id", authMiddleware, objectIdValidator, postValidators, updatePostController);
postRouter.delete("/:id", authMiddleware, objectIdValidator, deletePostController);