import {Request, Response} from "express";
import {ParamType} from "../../input-output-types/some";
import {commentService} from "../../domain/commentService";

export const deleteCommentController = async (req: Request<ParamType>,
                                           res: Response) => {

    const foundComment = await commentService.findCommentById(req.params.id);
    if (!foundComment) {
        res.status(404)
        return;
    }

    const isDeleted: boolean = await commentService.deleteComment(req.params.id, req.user.id, foundComment);

    if (isDeleted) {
        res.sendStatus(204)
    } else {
        res.sendStatus(403)
    }

}