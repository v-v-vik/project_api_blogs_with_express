import {Request, Response} from "express";
import {ParamType} from "../../input-output-types/some";
import {matchedData} from "express-validator";
import {CommentInputModel} from "../../input-output-types/comment types";
import {commentService} from "../../domain/commentService";
import {ResultStatus} from "../../result-object/result code";
import {HttpStatuses, resultCodeToHttpException} from "../../result-object/resultCodeToHttpException";

export const updateCommentController = async (req: Request<ParamType, any, CommentInputModel>,
                                           res: Response) => {


    const data: CommentInputModel = matchedData(req);
    const result = await commentService.updateComment(req.params.id, data, req.user.id);
    if (result.status !== ResultStatus.NoContent) {
        res.status(resultCodeToHttpException(result.status)).send();
        return;
    }
     res.status(HttpStatuses.NoContent).send();

}