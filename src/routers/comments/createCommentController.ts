import {Request, Response} from 'express';
import {postRepository} from "../../repositories/posts/postDbRepository";
import {matchedData} from "express-validator";
import {commentService} from "../../domain/commentService";
import {CommentDBType} from "../../input-output-types/comment types";
import {commentQueryRepository} from "../../repositories/comments/commentQueryRepository";

export const createCommentController = async (req: Request,
                                              res: Response) => {

    const foundPost = await postRepository.findPostById(req.body.params);
    if (!foundPost) {
        res.status(404).json()
        return;
    }

    const data: CommentDBType = matchedData(req);


    const newCommentId = await commentService.createComment(data, req.body.params, req.params.id);
    if (!newCommentId) {
        res.status(400)
        return;
    }
    const newComment = await commentQueryRepository.getCommentById(newCommentId);

    res
        .status(201)
        .json(newComment);

}