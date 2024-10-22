import {Request, Response} from "express";
import {ParamType} from "../../input-output-types/some";
import {postRepository} from "../../repositories/post-in-memory-repository";

export const deletePostController = (req: Request<ParamType>,
                                     res: Response)=> {

    //authorisation

    const isDeleted: boolean = postRepository.deletePost(req.params.id);
    if (isDeleted) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }

}