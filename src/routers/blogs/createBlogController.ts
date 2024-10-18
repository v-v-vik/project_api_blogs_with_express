import {Request, Response} from 'express';
import {BlogDBType, BlogInputModel} from "../../input-output-types/blog types";
import {blogRepository} from "../../repositories/blog-repository";
import {OutputErrorsType} from "../../input-output-types/error output types";


export const createBlogController = (req: Request<any, any, BlogInputModel>,
                                      res: Response <BlogDBType | OutputErrorsType | any>) => {
    //authorization

    //validation

    const newBlog: BlogDBType = blogRepository.createBlog(req.body);
    res
        .sendStatus(201)
        .json(newBlog)

}

