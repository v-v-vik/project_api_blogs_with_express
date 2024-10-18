import {Router} from "express";
import {createBlogController} from "./createBlogController";
import {getAllBlogsController} from "./getAllBlogsController";
import {findBlogController} from "./findBlogController";
import {updateBlogController} from "./updateBlogController";
import {deleteBlogController} from "./deleteBlogController";


export const blogRouter = Router();

blogRouter.post("/", createBlogController);
blogRouter.get("/", getAllBlogsController);
blogRouter.get("/:id", findBlogController);
blogRouter.put("/:id", updateBlogController);
blogRouter.delete("/:id", deleteBlogController);