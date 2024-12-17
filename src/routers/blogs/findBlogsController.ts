import {Request, Response} from 'express';
import {Paginator, ParamType, QueryType} from "../../input-output-types/some";
import {blogQueryRepository} from "../../repositories/blogs/blogQueryRepository";
import {BlogViewModel} from "../../domain/blog entity";

export const findBlogsController = async (req: Request<ParamType, any, any, QueryType>,
                                          res: Response<Paginator<BlogViewModel>| BlogViewModel> ) => {



    const searchBlog = await blogQueryRepository.getBlogsFilter(req.params.id, req.query);
    if (searchBlog) {
        res.json(searchBlog)
    } else {
        res.sendStatus(404)
    }
}