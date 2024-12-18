import {Request, Response} from 'express';
import {postRepository} from "../../repositories/posts/postDbRepository";
import {matchedData} from "express-validator";
import {commentService} from "../../application/commentService";
import {commentQueryRepository} from "../../repositories/comments/commentQueryRepository";
import {ParamType} from "../../input-output-types/some";
import {CommentDBType, CommentInputModel} from "../../domain/comment entity";

export const createCommentController = async (req: Request<ParamType, any, CommentInputModel>,
                                              res: Response) => {

    const foundPost = await postRepository.findPostById(req.params.id);

    if (!foundPost) {
        res.status(404).json()
        return;
    }

    const data: CommentDBType = matchedData(req);


    const newCommentId = await commentService.createComment(data, req.params.id, req.user.id);
    if (newCommentId === null) {
        res.status(400)
        return;
    }

    const newComment = await commentQueryRepository.getCommentById(newCommentId);

    res
        .status(201)
        .json(newComment);



}