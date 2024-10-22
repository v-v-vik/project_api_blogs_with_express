import {Request, Response} from 'express';
import {BlogDBType, BlogInputModel} from "../../input-output-types/blog types";
import {blogRepository} from "../../repositories/blog-db-repository";
import {OutputErrorsType} from "../../input-output-types/error output types";
import {ObjectId} from "mongodb";


export const createBlogController = async (req: Request<any, any, BlogInputModel>,
                                           res: Response<BlogDBType | OutputErrorsType | any>) => {
    //authorization

    //validation

    const newBlogID: ObjectId = await blogRepository.createBlog(req.body);
    const newBlog = await blogRepository.findBlogByUUID(newBlogID)

    res
        .status(201)
        .json(newBlog)

}

