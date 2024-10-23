import {Router} from "express";
import {createPostController} from "./createPostController";
import {getAllPostsController} from "./getAllPostsController";
import {findPostController} from "./findPostController";
import {updatePostController} from "./updatePostController";
import {deletePostController} from "./deletePostController";
import {authMiddleware} from "../../middlewares/authMiddleware";
import {postValidators} from "../../middlewares/postValidators";



export const postRouter = Router();

postRouter.post("/", authMiddleware, ...postValidators, createPostController);
postRouter.get("/", getAllPostsController);
postRouter.get("/:id", findPostController); //findPostValidator
postRouter.put("/:id", authMiddleware, ...postValidators, updatePostController); //findPostValidator
postRouter.delete("/:id", authMiddleware, deletePostController); //findPostValidator