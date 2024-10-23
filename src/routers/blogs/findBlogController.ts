import {Request, Response} from 'express';
import {ParamType} from "../../input-output-types/some";
import {BlogDBType} from "../../input-output-types/blog types";
import {blogRepository} from "../../repositories/blog-db-repository";

export const findBlogController = async (req: Request<ParamType>,
                                         res: Response<BlogDBType>) => {

    const searchBlog = await blogRepository.findBlog(req.params.id);
    if (searchBlog) {
        res.json(searchBlog)
    } else {
        res.sendStatus(404)
    }

}