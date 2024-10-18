import {Router} from "express";
import {createPostController} from "./createPostController";
import {getAllPostsController} from "./getAllPostsController";
import {findPostController} from "./findPostController";
import {updatePostController} from "./updatePostController";
import {deletePostController} from "./deletePostController";
import {authMiddleware} from "../../middlewares/authMiddleware";
import {findPostValidator, postValidators} from "../../middlewares/postValidators";



export const postRouter = Router();

postRouter.post("/", authMiddleware, ...postValidators, createPostController);
postRouter.get("/", getAllPostsController);
postRouter.get("/:id", findPostValidator, findPostController);
postRouter.put("/:id", authMiddleware, findPostValidator, ...postValidators, updatePostController);
postRouter.delete("/:id", authMiddleware, findPostValidator, deletePostController);