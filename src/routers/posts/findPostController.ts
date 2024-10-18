import {Request, Response} from "express";
import {ParamType} from "../../input-output-types/some";
import {postRepository} from "../../repositories/post-repository";
import {PostDBType} from "../../input-output-types/post types";

export const findPostController = (req: Request<ParamType>,
                                   res: Response<PostDBType>)=> {

    const searchPost: PostDBType | undefined = postRepository.findPost(req.params.id);
    if (searchPost) {
        res.json(searchPost)
    } else {
        res.sendStatus(404)
    }

}