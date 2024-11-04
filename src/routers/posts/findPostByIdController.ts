import {Request, Response} from "express";
import {postQueryRepository} from "../../repositories/postQueryRepository";

export const findPostByIdController = async (req: Request<any>,
                                             res: Response )=> {

    const searchPost = await postQueryRepository.getPostById(req.params.id);
    if (searchPost) {
        res.json(searchPost);
    } else {
        res.sendStatus(404);
    }
}