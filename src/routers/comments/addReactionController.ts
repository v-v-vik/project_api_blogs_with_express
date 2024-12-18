import {Request, Response} from "express";
import {ParamType} from "../../input-output-types/some";
import {matchedData} from "express-validator";
import {commentService} from "../../application/commentService";
import {LikeInputModel} from "../../domain/like entity";
import {HttpStatuses, resultCode, ResultStatus} from "../../domain/result-object/result code";

export const addReactionController = async (req: Request<ParamType, any, LikeInputModel>,
                                              res: Response) => {


    const data: LikeInputModel = matchedData(req);
    const result = await commentService.manageReaction(data, req.params.id, req.user.id);

    if (result.status !== ResultStatus.NoContent) {
        res
            .status(resultCode(result.status))
            .send(result.data)
    }

    res.status(HttpStatuses.NoContent).send();





}