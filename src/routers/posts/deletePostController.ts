import {Request, Response} from "express";
import {ParamType} from "../../input-output-types/some";
import {postService} from "../../domain/postService";

export const deletePostController = async (req: Request<ParamType>,
                                     res: Response)=> {

    //authorisation

    const isDeleted: boolean = await postService.deletePost(req.params.id);
    if (isDeleted) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }

}