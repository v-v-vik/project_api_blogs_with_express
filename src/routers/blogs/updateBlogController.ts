import {Request, Response} from "express";
import {ParamType} from "../../input-output-types/some";
import {blogService} from "../../application/blogService";
import {matchedData} from "express-validator";
import {BlogInputModel} from "../../domain/blog entity";


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
