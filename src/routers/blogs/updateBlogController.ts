import {Request, Response} from "express";
import {ParamType} from "../../input-output-types/some";
import {BlogInputModel} from "../../input-output-types/blog types";
import {blogService} from "../../domain/blogService";
import {matchedData} from "express-validator";


export const updateBlogController = async (req: Request<ParamType, any, BlogInputModel>,
                                           res: Response) => {
    //authorization

    //validation

    const data = matchedData(req);
    const isUpdated: boolean = await blogService.updateBlog(req.params.id, data);
    if (isUpdated) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
}
