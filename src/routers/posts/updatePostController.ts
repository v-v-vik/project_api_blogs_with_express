import {Request, Response} from "express";
import {ParamType} from "../../input-output-types/some";
import {PostInputModel} from "../../input-output-types/post types";
import {postService} from "../../domain/postService";
import {matchedData} from "express-validator";


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
