import {Request, Response} from "express";
import {ParamType} from "../../input-output-types/some";
import {matchedData} from "express-validator";
import {commentService} from "../../application/commentService";
import {ResultStatus} from "../../domain/result-object/result code";
import {HttpStatuses, resultCode} from "../../domain/result-object/result code";
import {CommentInputModel} from "../../domain/comment entity";

export const updateCommentController = async (req: Request<ParamType, any, CommentInputModel>,
                                           res: Response) => {


    const data: CommentInputModel = matchedData(req);
    const result = await commentService.updateComment(req.params.id, data, req.user.id);
    console.log("result:", result)
    if (result.status !== ResultStatus.NoContent) {
        res.status(resultCode(result.status)).send();
        return;
    }
     res.status(HttpStatuses.NoContent).send();

}