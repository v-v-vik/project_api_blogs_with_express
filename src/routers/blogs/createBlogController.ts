import {Request, Response} from 'express';
import {OutputErrorsType} from "../../input-output-types/error output types";
import {blogService} from "../../application/blogService";
import {matchedData} from "express-validator";
import {blogQueryRepository} from "../../repositories/blogs/blogQueryRepository";
import {BlogDBType, BlogInputModel} from "../../domain/blog entity";


export const createBlogController = async (req: Request<any, any, BlogInputModel>,
                                           res: Response<BlogDBType | OutputErrorsType | any>) => {
    //authorization

    //validation
    const data:BlogInputModel = matchedData(req);
    const newBlogId = await blogService.createBlog(data);
    console.log(newBlogId)

    const newBlog = await blogQueryRepository.getBlogById(newBlogId);

    res
        .status(201)
        .json(newBlog)

}

