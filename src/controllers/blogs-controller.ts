import {BlogInputModel, BlogViewModel} from "../domain/blog entity";
import {matchedData} from "express-validator";
import {blogService} from "../application/blogService";
import {blogQueryRepository} from "../repositories/blogs/blogQueryRepository";
import {Request, Response} from "express";
import {HttpStatuses} from "../domain/result-object/result code";
import {Paginator, ParamType, QueryType} from "../input-output-types/some";


class BlogController {
    async create(req: Request<any, any, BlogInputModel>,
                 res: Response<BlogViewModel | null>){

        const data:BlogInputModel = matchedData(req);
        const newBlogId = await blogService.create(data);
        const newBlog = await blogQueryRepository.getBlogById(newBlogId);
        res
            .status(HttpStatuses.Created)
            .json(newBlog)

    }

    async find(req: Request<ParamType, any, any, QueryType>,
               res: Response<Paginator<BlogViewModel>>){

        const foundBlogs = await blogQueryRepository.getBlogsFilter(req.params.id, req.query);
        res
            .status(HttpStatuses.Success)
            .json(foundBlogs)
    }

    async findById(req: Request<ParamType>,
                   res: Response<BlogViewModel | null>){

        const searchBlog = await blogQueryRepository.getBlogById(req.params.id);
        if (searchBlog) {
            res
                .status(HttpStatuses.Success)
                .json(searchBlog)
        } else {
            res
                .status(HttpStatuses.NotFound)
                .json()
        }
    }

    async update(req: Request<ParamType, any, BlogInputModel>,
                 res: Response<boolean>){

        const data:BlogInputModel = matchedData(req);
        const isUpdated: boolean = await blogService.update(req.params.id, data);
        if (isUpdated) {
            res
                .status(HttpStatuses.NoContent)
                .json()
        } else {
            res
                .status(HttpStatuses.NotFound)
                .json()
        }
    }

    async delete(req: Request<ParamType>,
                 res: Response){

        const isDeleted: boolean = await blogService.delete(req.params.id);
        if (isDeleted) {
            res
                .status(HttpStatuses.NoContent)
                .json()
        } else {
            res
                .status(HttpStatuses.NotFound)
                .json()
        }
    }
}

export const blogController = new BlogController();