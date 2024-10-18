import {Router} from "express";
import {createPostController} from "./createPostController";
import {getAllPostsController} from "./getAllPostsController";
import {findPostController} from "./findPostController";
import {updatePostController} from "./updatePostController";
import {deletePostController} from "./deletePostController";
import {authMiddleware} from "../../middlewares/authMiddleware";


export const postRouter = Router();

postRouter.post("/", authMiddleware, createPostController);
postRouter.get("/", getAllPostsController);
postRouter.get("/:id", findPostController);
postRouter.put("/:id", authMiddleware, updatePostController);
postRouter.delete("/:id", authMiddleware, deletePostController);