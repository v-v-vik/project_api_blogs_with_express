import {Router} from "express";
import {createPostController} from "./createPostController";
import {getAllPostsController} from "./getAllPostsController";
import {findPostController} from "./findPostController";
import {updatePostController} from "./updatePostController";
import {deletePostController} from "./deletePostController";


export const postRouter = Router();

postRouter.post("/", createPostController);
postRouter.get("/", getAllPostsController);
postRouter.get("/:id", findPostController);
postRouter.put("/:id", updatePostController);
postRouter.delete("/:id", deletePostController);