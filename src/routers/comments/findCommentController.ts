import { Request, Response } from "express";
import {commentService} from "../../application/commentService";
import {commentQueryRepository} from "../../repositories/comments/commentQueryRepository";


export const findCommentByIdController = async (req: Request,
                                                res: Response) => {

    const foundComment = await commentService.findCommentById(req.params.id);
    if (foundComment === null) {
        res.sendStatus(404)
        return;
    }

    const comment = await commentQueryRepository.getCommentById(req.params.id);

    res.status(200).json(comment)
}