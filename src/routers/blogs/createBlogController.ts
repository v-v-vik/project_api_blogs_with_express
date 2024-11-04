import {Request, Response} from 'express';
import {BlogDBType, BlogInputModel} from "../../input-output-types/blog types";
import {OutputErrorsType} from "../../input-output-types/error output types";
import {blogService} from "../../domain/blogService";
import {matchedData} from "express-validator";
import {blogQueryRepository} from "../../repositories/blogQueryRepository";


export const createBlogController = async (req: Request<any, any, BlogInputModel>,
                                           res: Response<BlogDBType | OutputErrorsType | any>) => {
    //authorization

    //validation
    const data:BlogInputModel = matchedData(req);
    const newBlogId= await blogService.createBlog(data);

    const newBlog = await blogQueryRepository.getBlogById(newBlogId);

    res
        .status(201)
        .json(newBlog)

}

