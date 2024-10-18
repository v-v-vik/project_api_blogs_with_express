import {Router} from "express";
import {createBlogController} from "./createBlogController";
import {getAllBlogsController} from "./getAllBlogsController";
import {findBlogController} from "./findBlogController";
import {updateBlogController} from "./updateBlogController";
import {deleteBlogController} from "./deleteBlogController";
import {authMiddleware} from "../../middlewares/authMiddleware";
import {blogValidators, findBlogValidator} from "../../middlewares/blogValidators";


export const blogRouter = Router();

blogRouter.post("/", authMiddleware, ...blogValidators, createBlogController);
blogRouter.get("/", getAllBlogsController);
blogRouter.get("/:id", findBlogValidator, findBlogController);
blogRouter.put("/:id", authMiddleware, findBlogValidator, ...blogValidators, updateBlogController);
blogRouter.delete("/:id", authMiddleware, findBlogValidator, deleteBlogController);