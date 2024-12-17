import {ParamType} from "../../input-output-types/some";
import {Request, Response} from "express";
import {matchedData} from "express-validator";
import {postService} from "../../application/postService";
import {postQueryRepository} from "../../repositories/posts/postQueryRepository";
import {PostInputModel2} from "../../domain/post entity";


export const createPostByBlogIdController = async (req: Request<ParamType, any, PostInputModel2>,
                                                   res: Response) => {
    const data: PostInputModel2 = matchedData(req);
    const newPostId: string | null = await postService.createPost(data, req.params.id);
    if (newPostId) {
        const newPost = await postQueryRepository.getPostById(newPostId);
        res
            .status(201)
            .json(newPost)
        return
    }
    res.sendStatus(404);



}