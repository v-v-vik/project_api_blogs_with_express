import {Request, Response} from 'express';
import {BlogDBType} from "../../input-output-types/blog types";
import {DBType} from "../../repositories/db";
import {blogRepository} from "../../repositories/blog-repository";

export const getAllBlogsController = (req: Request<any>,
                                      res: Response <BlogDBType | DBType | any>)=> {
    const blogs = blogRepository.getAllBlogs();
    res.json(blogs);
}