import {Request, Response} from "express";
import {ParamType} from "../../input-output-types/some";
import {BlogInputModel} from "../../input-output-types/blog types";
import {blogRepository} from "../../repositories/blog-repository";


export const updateBlogController = (req: Request<ParamType, any, BlogInputModel>,
                                     res: Response) => {
    //authorization

    //validation


    const isUpdated: boolean = blogRepository.updateBlog(req.params.id, req.body);
    if (isUpdated) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
}
