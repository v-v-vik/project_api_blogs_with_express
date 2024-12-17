import {Request, Response} from "express";
import {Paginator, ParamType, QueryType} from "../../input-output-types/some";
import {postQueryRepository} from "../../repositories/posts/postQueryRepository";
import {PostViewModel} from "../../domain/post entity";

export const findPostsController = async (req: Request<ParamType, any, any, QueryType>,
                                          res: Response<Paginator<PostViewModel>>) => {

    const searchPost = await postQueryRepository.getPostFilter(req.query,req.params.id);
    if (searchPost) {
        res.json(searchPost)
    } else {
        res.sendStatus(404)
    }

}