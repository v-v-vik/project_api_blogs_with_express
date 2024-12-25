import {PostInputModel, PostInputModel2, PostViewModel} from "../domain/post entity";
import {matchedData} from "express-validator";
import {postService} from "../application/postService";
import {postQueryRepository} from "../repositories/posts/postQueryRepository";
import {Request, Response} from "express";
import {HttpStatuses} from "../domain/result-object/result code";
import {Paginator, ParamType, QueryType} from "../input-output-types/some";


class PostController{
    async create(req: Request<any, any, PostInputModel>,
                 res: Response<PostViewModel | null>){

        const data:PostInputModel = matchedData(req);
        const newPostId = await postService.create(data);
        if (newPostId){
            const newPost = await postQueryRepository.getPostById(newPostId);
            res
                .status(HttpStatuses.Created)
                .json(newPost)
            return;
        }
        res
            .status(HttpStatuses.BadRequest)
            .json()
    }

    async find(req: Request<ParamType, any, any, QueryType>,
               res: Response<Paginator<PostViewModel>>){

        const foundPosts = await postQueryRepository.getPostFilter(req.query,req.params.id);
        res
            .status(HttpStatuses.Success)
            .json(foundPosts)
    }

    async findById(req: Request,
                   res: Response<PostViewModel | null>){

        const searchPost = await postQueryRepository.getPostById(req.params.id);
        if (searchPost) {
            res
                .status(HttpStatuses.Success)
                .json(searchPost)
        } else {
            res
                .status(HttpStatuses.NotFound)
                .json()
        }
    }

    async update(req: Request<ParamType, any, PostInputModel>,
                 res: Response){

        const data: PostInputModel = matchedData(req);
        const isUpdated: boolean = await postService.update(req.params.id, data);
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

        const isDeleted: boolean = await postService.delete(req.params.id);
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

    async createByBlogId(req: Request<ParamType, any, PostInputModel2>,
                         res: Response) {

        const data: PostInputModel2 = matchedData(req);
        const newPostId: string | null = await postService.create(data, req.params.id);
        if (!newPostId) {
            res
                .status(HttpStatuses.NotFound)
                .json()
            return;
        }
        const newPost = await postQueryRepository.getPostById(newPostId);
            res
                .status(HttpStatuses.Created)
                .json(newPost)
            return;

    }

    async findByBlogId(req: Request<ParamType, any, any, QueryType>,
                       res: Response){

        const foundPosts = await postService.find(req.params.id, req.query);
        if (!foundPosts) {
            res
                .status(HttpStatuses.NotFound)
                .json()
        }
        res
            .status(HttpStatuses.Success)
            .json(foundPosts)
    }
}

export const postController = new PostController();