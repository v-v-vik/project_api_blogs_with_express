import {Request, Response} from 'express';
import {ParamType} from "../../input-output-types/some";
import {blogService} from "../../domain/blogService";


export const deleteBlogController = async (req: Request<ParamType>,
                                           res: Response) => {

    //authorisation



    const isDeleted: boolean = await blogService.deleteBlog(req.params.id);

    if (isDeleted) {
        res.sendStatus(204)
    } else {
       res.sendStatus(404)
    }

}