import {Request, Response} from "express";
import {ParamType} from "../../input-output-types/some";
import {postRepository} from "../../repositories/post-db-repository";
import {PostDBType} from "../../input-output-types/post types";

export const findPostController = async (req: Request<ParamType>,
                                         res: Response<PostDBType>) => {

    const searchPost = await postRepository.findPost(req.params.id);
    if (searchPost) {
        res.json(searchPost)
    } else {
        res.sendStatus(404)
    }

}