import {Request, Response} from "express";
import {BlogDBType} from "../../input-output-types/blog types";
import {DBType} from "../../repositories/db";
import {PostDBType} from "../../input-output-types/post types";
import {postRepository} from "../../repositories/post-db-repository";

export const getAllPostsController = async (req: Request<any>,
                                      res: Response <BlogDBType | DBType | any>)=> {

    const posts: PostDBType[] = await postRepository.getAllPosts();
    res.json(posts);
}