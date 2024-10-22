import {Request, Response} from "express";
import {OutputErrorsType} from "../../input-output-types/error output types";
import {PostDBType, PostInputModel} from "../../input-output-types/post types";
import {postRepository} from "../../repositories/post-in-memory-repository";


export const createPostController = (req: Request<any, any, PostInputModel>,
                                     res: Response <PostDBType | OutputErrorsType | any>) => {
    //authorization

    //validation

    const newPost: PostDBType = postRepository.createPost(req.body);


    res
        .status(201)
        .json(newPost)

}