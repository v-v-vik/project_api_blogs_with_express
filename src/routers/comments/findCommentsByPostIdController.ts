import { Request, Response } from 'express';
import {postService} from "../../application/postService";
import {commentQueryRepository} from "../../repositories/comments/commentQueryRepository";
import {PayloadAT} from "../../input-output-types/auth types";
import {jwtService} from "../../adapters/jwtService";

export const findCommentsByPostIdController = async (req: Request,
                                                     res: Response) => {
    let tokenPayload: PayloadAT | null = null;
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1];

        tokenPayload = jwtService.getUserIdByAccessToken(token) as PayloadAT;
    }

    const foundPost = await postService.findPostById(req.params.id);

    if (foundPost === null) {
        res.sendStatus(404)
        return;
    }

    const comments = await commentQueryRepository.findCommentsByPostId(req.params.id, req.query, tokenPayload?.userId);
    res
        .status(200).json(comments)
}