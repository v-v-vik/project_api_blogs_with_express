import { Request, Response } from 'express';
import {postService} from "../../domain/postService";
import {commentQueryRepository} from "../../repositories/comments/commentQueryRepository";

export const findCommentsByPostIdController = async (req: Request,
                                                     res: Response) => {

    const foundPost = await postService.findPostById(req.params.id);
    if (foundPost === null) {
        res.sendStatus(404)
        return;
    }

    const comments = await commentQueryRepository.findCommentsByPostId(req.params.id, req.query);
    res
        .status(200).json(comments)
}