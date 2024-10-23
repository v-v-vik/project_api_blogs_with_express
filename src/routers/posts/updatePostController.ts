import {Request, Response} from "express";
import {ParamType} from "../../input-output-types/some";
import {PostInputModel} from "../../input-output-types/post types";
import {postRepository} from "../../repositories/post-db-repository";


export const updatePostController = async (req: Request<ParamType, any, PostInputModel>,
                                           res: Response) => {
    //authorization

    //validation


    const isUpdated: boolean = await postRepository.updatePost(req.params.id, req.body);
    if (isUpdated) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
}
