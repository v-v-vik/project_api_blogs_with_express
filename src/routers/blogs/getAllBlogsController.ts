import {Request, Response} from 'express';
import {BlogDBType} from "../../input-output-types/blog types";
import {DBType} from "../../repositories/db";
import {blogRepository} from "../../repositories/blog-db-repository";

export const getAllBlogsController = async (req: Request<any>,
                                            res: Response<BlogDBType | DBType | any>) => {
    const blogs = await blogRepository.getAllBlogs();
    res.json(blogs);
}