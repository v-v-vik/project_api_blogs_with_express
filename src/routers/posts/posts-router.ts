import {Router} from "express";
import {createPostController} from "./createPostController";
import {findPostByIdController} from "./findPostByIdController";
import {findPostsController} from "./findPostsController";
import {updatePostController} from "./updatePostController";
import {deletePostController} from "./deletePostController";
import {authMiddleware} from "../../middlewares/authMiddleware";
import {postValidators} from "../../middlewares/postValidators";
import {objectIdValidator} from "../../middlewares/objectIdValidator";


export const postRouter = Router();

postRouter.post("/", authMiddleware, postValidators, createPostController);
postRouter.get("/", findPostsController);
postRouter.get("/:id", objectIdValidator, findPostByIdController); //findPostValidator
postRouter.put("/:id", authMiddleware, objectIdValidator, postValidators, updatePostController); //findPostValidator
postRouter.delete("/:id", authMiddleware, objectIdValidator, deletePostController); //findPostValidator