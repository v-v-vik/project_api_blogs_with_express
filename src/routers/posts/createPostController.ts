import {Request, Response} from "express";
import {OutputErrorsType} from "../../input-output-types/error output types";
import {PostDBType, PostInputModel} from "../../input-output-types/post types";
import {matchedData} from "express-validator";
import {postService} from "../../domain/postService";
import {postQueryRepository} from "../../repositories/postQueryRepository";


export const createPostController = async (req: Request<any, any, PostInputModel>,
                                           res: Response<PostDBType | OutputErrorsType | any>) => {
    //authorization

    //validation
    const data:PostInputModel = matchedData(req);
    const newPostId = await postService.createPost(data);

    if (newPostId === null) {
        res.sendStatus(400).json({
            error: "Post was not be created",
        })
        return;
    }

    const newPost = await postQueryRepository.getPostById(newPostId);

    res
        .status(201)
        .json(newPost)

}