import {Request, Response} from 'express';
import {ParamType} from "../../input-output-types/some";
import {BlogDBType} from "../../input-output-types/blog types";
import {blogRepository} from "../../repositories/blog-repository";

export const findBlogController = (req: Request<ParamType>,
                                   res: Response<BlogDBType>)=> {

    const searchBlog = blogRepository.findBlog(req.params.id);
    if (searchBlog) {
        res.json(searchBlog)
    } else {
        res.sendStatus(404)
    }

}