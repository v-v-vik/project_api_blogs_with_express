import {Request, Response} from 'express';
import {Paginator, ParamType, QueryType} from "../../input-output-types/some";
import {BlogViewModel} from "../../input-output-types/blog types";
import {blogQueryRepository} from "../../repositories/blogQueryRepository";

export const findBlogsController = async (req: Request<ParamType, any, any, QueryType>,
                                          res: Response<Paginator<BlogViewModel>| BlogViewModel> ) => {



    const searchBlog = await blogQueryRepository.getBlogsFilter(req.params.id, req.query);
    if (searchBlog) {
        res.json(searchBlog)
    } else {
        res.sendStatus(404)
    }
}