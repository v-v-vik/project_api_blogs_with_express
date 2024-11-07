import {Request, Response} from 'express';
import {blogService} from "../domain/blogService";
import {postService} from "../domain/postService";


export const deleteAllDataController = async (req: Request, res: Response) => {
    const blogsDeleted = await blogService.deleteAllBlogs();
    const postsDeleted = await postService.deleteAllPosts();
    if (blogsDeleted && postsDeleted) {
        res.sendStatus(204);
    }

}