import { Request, Response } from "express";
import {commentService} from "../../application/commentService";
import {commentQueryRepository} from "../../repositories/comments/commentQueryRepository";
import {PayloadAT} from "../../input-output-types/auth types";
import {jwtService} from "../../adapters/jwtService";


export const findCommentByIdController = async (req: Request,
                                                res: Response) => {

    let tokenPayload: PayloadAT | null = null;
    console.log("there was something in the headers:", req.headers.authorization)
    if (req.headers.authorization) {

        const token = req.headers.authorization.split(' ')[1];

        tokenPayload = jwtService.getUserIdByAccessToken(token) as PayloadAT;
    }

    const foundComment = await commentService.findCommentById(req.params.id);
    if (foundComment === null) {
        res.sendStatus(404)
        return;
    }

    const comment = await commentQueryRepository.getCommentById(req.params.id, tokenPayload?.userId);

    res.status(200).json(comment)
}