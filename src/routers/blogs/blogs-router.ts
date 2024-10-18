import {Router} from "express";
import {SETTINGS} from "../../settings";
import {createBlogController} from "./createBlogController";
import {getAllBlogsController} from "./getAllBlogsController";
import {findBlogController} from "./findBlogController";
import {updateBlogController} from "./updateBlogController";
import {deleteBlogController} from "./deleteBlogController";


export const blogRouter = Router();

blogRouter.post(SETTINGS.PATH.BLOGS, createBlogController);
blogRouter.get(SETTINGS.PATH.BLOGS, getAllBlogsController);
blogRouter.get(SETTINGS.PATH.BLOGS, findBlogController);
blogRouter.put(SETTINGS.PATH.BLOGS, updateBlogController);
blogRouter.delete(SETTINGS.PATH.BLOGS, deleteBlogController);