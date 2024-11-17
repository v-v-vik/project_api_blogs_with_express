import {Request, Response} from 'express';
import {blogService} from "../domain/blogService";
import {postService} from "../domain/postService";
import {userService} from "../domain/userService";
import {commentService} from "../domain/commentService";


export const deleteAllDataController = async (req: Request, res: Response) => {
    const blogsDeleted = await blogService.deleteAllBlogs();
    const postsDeleted = await postService.deleteAllPosts();
    const usersDeleted = await userService.deleteAllUsers();
    const commentsDeleted = await commentService.deleteAllComments();
    if (blogsDeleted && postsDeleted && usersDeleted && commentsDeleted) {
        res.sendStatus(204);
    }

}