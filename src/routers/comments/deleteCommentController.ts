import {Request, Response} from "express";
import {ParamType} from "../../input-output-types/some";
import {commentService} from "../../application/commentService";

export const deleteCommentController = async (req: Request<ParamType>,
                                           res: Response) => {



    const foundComment = await commentService.findCommentById(req.params.id);
    console.log("found comment is:",foundComment);
    if (foundComment === null) {
        res.sendStatus(404)
        return;
    }

    const isDeleted = await commentService.deleteComment(req.params.id, req.user.id, foundComment);

    if (isDeleted) {
        res.sendStatus(204)
    } else {
        res.sendStatus(403)
    }

}