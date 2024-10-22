import {Router} from "express";
import {createBlogController} from "./createBlogController";
import {getAllBlogsController} from "./getAllBlogsController";
import {findBlogController} from "./findBlogController";
import {updateBlogController} from "./updateBlogController";
import {deleteBlogController} from "./deleteBlogController";
import {authMiddleware} from "../../middlewares/authMiddleware";
import {blogValidators} from "../../middlewares/blogValidators";


export const blogRouter = Router();

blogRouter.post("/", authMiddleware, blogValidators, createBlogController);
blogRouter.get("/", getAllBlogsController);
blogRouter.get("/:id", findBlogController) //findBlogValidator
blogRouter.put("/:id", authMiddleware, blogValidators, updateBlogController); //findBlogValidator
blogRouter.delete("/:id", authMiddleware,deleteBlogController); //findBlogValidator