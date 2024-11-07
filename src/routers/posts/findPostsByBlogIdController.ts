import {Request, Response} from "express";
import {postQueryRepository} from "../../repositories/postQueryRepository";
import {ParamType, QueryType} from "../../input-output-types/some";
import {blogQueryRepository} from "../../repositories/blogQueryRepository";

export const findPostsByBlogIdController = async (req: Request<ParamType, any, any, QueryType>,
                                             res: Response )=> {

    const foundBlog = await blogQueryRepository.getBlogById(req.params.id);
    if (foundBlog) {
        const searchPost = await postQueryRepository.getPostFilterByBlogID(req.query, req.params.id);
        res.json(searchPost);
        return;
    }

    res.sendStatus(404);

}
