import {Request, Response} from 'express';
import {ParamType} from "../../input-output-types/some";
import {blogQueryRepository} from "../../repositories/blogs/blogQueryRepository";
import {BlogDBType} from "../../domain/blog entity";

export const findBlogByIdController = async (req: Request<ParamType>,
                                            res: Response<BlogDBType | any>) => {


    const searchBlog = await blogQueryRepository.getBlogById(req.params.id);
    if (searchBlog) {
        res.json(searchBlog)
    } else {
        res.sendStatus(404)
    }
}