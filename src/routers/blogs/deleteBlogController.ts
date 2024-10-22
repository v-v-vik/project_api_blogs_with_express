import {Request, Response} from 'express';
import {ParamType} from "../../input-output-types/some";
import {blogRepository} from "../../repositories/blog-db-repository";


export const deleteBlogController = async (req: Request<ParamType>,
                                           res: Response) => {

    //authorisation

    const isDeleted: boolean = await blogRepository.deleteBlog(req.params.id);
    if (isDeleted) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }

}