import {Request, Response} from "express";
import {OutputErrorsType} from "../../input-output-types/error output types";
import {PostDBType, PostInputModel} from "../../input-output-types/post types";
import {postRepository} from "../../repositories/post-db-repository";


export const createPostController = async (req: Request<any, any, PostInputModel>,
                                           res: Response<PostDBType | OutputErrorsType | any>) => {
    //authorization

    //validation

    const newPostId = await postRepository.createPost(req.body);
    console.log("this is new postId:", newPostId)
    const newPost = await postRepository.getPostByUUID(newPostId);
    console.log("this is new Post:", newPost)
    res
        .status(201)
        .json(newPost)

}