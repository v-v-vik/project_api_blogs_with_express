import {Request, Response} from 'express';
import {BlogDBType} from "../../input-output-types/blog types";
import {DBType} from "../../repositories/db";
import {ParamType} from "../../input-output-types/some";
import {blogQueryRepository} from "../../repositories/blogQueryRepository";

export const findBlogByIdController = async (req: Request<ParamType>,
                                            res: Response<BlogDBType | DBType | any>) => {


    const searchBlog = await blogQueryRepository.getBlogById(req.params.id);
    if (searchBlog) {
        res.json(searchBlog)
    } else {
        res.sendStatus(404)
    }
}