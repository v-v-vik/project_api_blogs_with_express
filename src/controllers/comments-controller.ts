import {PayloadAT} from "../input-output-types/auth types";
import {jwtService} from "../adapters/jwtService";
import {commentService} from "../application/commentService";
import {Request, Response} from "express";
import {HttpStatuses, resultCode, ResultStatus} from "../domain/result-object/result code";
import {CommentDBType, CommentInputModel} from "../domain/comment entity";
import {matchedData} from "express-validator";
import {ParamType} from "../input-output-types/some";
import {LikeInputModel} from "../domain/like entity";
import jwt from "jsonwebtoken";


class CommentsController {

    async create(req: Request<ParamType, any, CommentInputModel>,
                 res: Response){

        const data: CommentDBType = matchedData(req);
        const newComment = await commentService.create(data, req.params.id, req.user.id);
        if (!newComment) {
            res
                .status(HttpStatuses.NotFound)
                .json()
        }
        res
            .status(201)
            .json(newComment)
    }

    async findByPostId(req: Request,
                       res: Response){

        let decoded: PayloadAT | null = null;
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1];
            decoded = jwt.decode(token) as PayloadAT;
            //tokenPayload = jwtService.getUserIdByAccessToken(token) as PayloadAT;
        }
        const result = await commentService.findByPostId(req.params.id, req.query, decoded?.userId);
        if (!result) {
            res
                .status(HttpStatuses.NotFound)
                .json()
        }
        res
            .status(HttpStatuses.Success)
            .json(result)

    }

    async findById(req: Request,
                   res: Response){

        let tokenPayload: PayloadAT | null = null;
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1];
            tokenPayload = jwtService.getUserIdByAccessToken(token) as PayloadAT;
        }
        const foundComment = await commentService.findById(req.params.id, tokenPayload?.userId);
        if (!foundComment) {
            res
                .status(HttpStatuses.NotFound)
                .json()
        }
        res
            .status(HttpStatuses.Success)
            .json(foundComment)
    }

    async update(req: Request<ParamType, any, CommentInputModel>,
                 res: Response) {

        const data: CommentInputModel = matchedData(req);
        const result = await commentService.update(req.params.id, data, req.user.id);
        if (result.status !== ResultStatus.NoContent) {
            res
                .status(resultCode(result.status))
                .json();
            return;
        }
        res
            .status(HttpStatuses.NoContent)
            .json();

    }

    async delete(req: Request<ParamType>,
                 res: Response) {

        const result = await commentService.delete(req.params.id, req.user.id);
        if (result.status !== ResultStatus.NoContent) {
            res
                .status(resultCode(result.status))
                .json();
            return;
        }
        res
            .status(HttpStatuses.NoContent)
            .json();
    }

    async addReaction(req: Request<ParamType, any, LikeInputModel>,
                      res: Response) {

        const data: LikeInputModel = matchedData(req);
        const result = await commentService.addReaction(data, req.params.id, req.user.id);
        if (result.status !== ResultStatus.NoContent) {
            res
                .status(resultCode(result.status))
                .json(result.data)
            return;
        }
        res
            .status(HttpStatuses.NoContent)
            .json();
    }
}

export const commentController = new CommentsController();