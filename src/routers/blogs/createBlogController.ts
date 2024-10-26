import {Request, Response} from 'express';
import {BlogDBType, BlogInputModel} from "../../input-output-types/blog types";
import {blogRepository} from "../../repositories/blog-db-repository";
import {OutputErrorsType} from "../../input-output-types/error output types";
import {ObjectId} from "mongodb";
import {blogService} from "../../domain/blogService";


export const createBlogController = async (req: Request<any, any, BlogInputModel>,
                                           res: Response<BlogDBType | OutputErrorsType | any>) => {
    //authorization

    //validation

    const newBlog= await blogService.createBlog(req.body);


    res
        .status(201)
        .json(newBlog)

}

