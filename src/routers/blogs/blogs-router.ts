import {Router} from "express";
import {createBlogController} from "./createBlogController";
import {getAllBlogsController} from "./getAllBlogsController";
import {findBlogController} from "./findBlogController";
import {updateBlogController} from "./updateBlogController";
import {deleteBlogController} from "./deleteBlogController";
import {authMiddleware} from "../../middlewares/authMiddleware";


export const blogRouter = Router();

blogRouter.post("/", authMiddleware, createBlogController);
blogRouter.get("/", getAllBlogsController);
blogRouter.get("/:id", findBlogController);
blogRouter.put("/:id", authMiddleware, updateBlogController);
blogRouter.delete("/:id", authMiddleware, deleteBlogController);