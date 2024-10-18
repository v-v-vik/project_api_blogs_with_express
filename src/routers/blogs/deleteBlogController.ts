import {Request, Response} from 'express';
import {ParamType} from "../../input-output-types/some";
import {blogRepository} from "../../repositories/blog-repository";


export const deleteBlogController = (req: Request<ParamType>,
                                   res: Response)=> {

    //authorisation

    const isDeleted: boolean = blogRepository.deleteBlog(req.params.id);
    if (isDeleted) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }

}