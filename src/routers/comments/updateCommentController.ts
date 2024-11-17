import {Request, Response} from "express";
import {ParamType} from "../../input-output-types/some";
import {matchedData} from "express-validator";
import {CommentInputModel} from "../../input-output-types/comment types";
import {commentService} from "../../domain/commentService";

export const updateCommentController = async (req: Request<ParamType, any, CommentInputModel>,
                                           res: Response) => {

    const foundComment = await commentService.findCommentById(req.params.id);
    if (foundComment === null) {
        res.sendStatus(404)
        return;
    }

    const data: CommentInputModel = matchedData(req);
    const isUpdated: boolean = await commentService.updateComment(req.params.id, data, req.user.id, foundComment);
    if (isUpdated) {
        res.sendStatus(204)
    } else {
        res.sendStatus(403)
    }
}