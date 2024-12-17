import {Request, Response} from "express";
import {ParamType} from "../../input-output-types/some";
import {postService} from "../../application/postService";
import {matchedData} from "express-validator";
import {PostInputModel} from "../../domain/post entity";


export const updatePostController = async (req: Request<ParamType, any, PostInputModel>,
                                           res: Response) => {
    //authorization

    //validation

    const data: PostInputModel = matchedData(req);
    const isUpdated: boolean = await postService.updatePost(req.params.id, data);
    if (isUpdated) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
}
