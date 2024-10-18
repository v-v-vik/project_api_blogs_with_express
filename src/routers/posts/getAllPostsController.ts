import {Request, Response} from "express";
import {BlogDBType} from "../../input-output-types/blog types";
import {DBType} from "../../repositories/db";
import {PostDBType} from "../../input-output-types/post types";
import {postRepository} from "../../repositories/post-repository";

export const getAllPostsController = (req: Request<any>,
                                      res: Response <BlogDBType | DBType | any>)=> {
    const posts: PostDBType[] = postRepository.getAllPosts();
    res.json(posts);
}