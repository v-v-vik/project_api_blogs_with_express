import {PostInputModel, PostInputModel2, PostViewModel} from "../domain/post entity";
import {matchedData} from "express-validator";
import {postService} from "../application/postService";
import {postQueryRepository} from "../repositories/posts/postQueryRepository";
import {Request, Response} from "express";
import {HttpStatuses, resultCode, ResultStatus} from "../domain/result-object/result code";
import {ParamType, QueryType} from "../input-output-types/some";
import {LikeInputModel} from "../domain/like entity";
import {PayloadAT} from "../input-output-types/auth types";
import jwt from "jsonwebtoken";


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
               res: Response){

        let decoded: PayloadAT | null = null;
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1];
            decoded = jwt.decode(token) as PayloadAT;
        }

        const foundPosts = await postQueryRepository.getPostFilter(req.query,req.params.id, decoded?.userId);
        res
            .status(HttpStatuses.Success)
            .json(foundPosts)
    }

    async findById(req: Request,
                   res: Response<PostViewModel | null>){

        let decoded: PayloadAT | null = null;
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1];
            decoded = jwt.decode(token) as PayloadAT;
        }

        const searchPost = await postQueryRepository.getPostById(req.params.id, decoded?.userId);
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

        let decoded: PayloadAT | null = null;
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1];
            decoded = jwt.decode(token) as PayloadAT;
        }

        const foundPosts = await postService.find(req.params.id, req.query, decoded?.userId);
        if (!foundPosts) {
            res
                .status(HttpStatuses.NotFound)
                .json()
        }
        res
            .status(HttpStatuses.Success)
            .json(foundPosts)
    }

    async addReaction(req: Request<ParamType, any, LikeInputModel>,
                      res: Response) {

        const data: LikeInputModel = matchedData(req);
        const result = await postService.addReaction(data, req.params.id, req.user.id);
        if (result.status !== ResultStatus.NoContent) {
            res
                .status(resultCode(result.status))
                .json(result.data)
            return;
        }
        res
            .status(HttpStatuses.NoContent)
            .json();
    }
}

export const postController = new PostController();