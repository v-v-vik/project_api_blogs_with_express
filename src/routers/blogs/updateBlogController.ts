import {Request, Response} from "express";
import {ParamType} from "../../input-output-types/some";
import {BlogInputModel} from "../../input-output-types/blog types";
import {blogRepository} from "../../repositories/blog-db-repository";
import {blogService} from "../../domain/blogService";


export const updateBlogController = async (req: Request<ParamType, any, BlogInputModel>,
                                           res: Response) => {
    //authorization

    //validation


    const isUpdated: boolean = await blogService.updateBlog(req.params.id, req.body);
    if (isUpdated) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
}
