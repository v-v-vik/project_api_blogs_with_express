import {Request, Response} from 'express';
import {blogService} from "../domain/blogService";
import {postService} from "../domain/postService";
import {userService} from "../domain/userService";


export const deleteAllDataController = async (req: Request, res: Response) => {
    const blogsDeleted = await blogService.deleteAllBlogs();
    const postsDeleted = await postService.deleteAllPosts();
    const usersDeleted = await userService.deleteAllUsers();
    if (blogsDeleted && postsDeleted && usersDeleted) {
        res.sendStatus(204);
    }

}