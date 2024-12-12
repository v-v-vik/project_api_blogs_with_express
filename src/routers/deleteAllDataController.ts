import {Request, Response} from 'express';
import {blogService} from "../domain/blogService";
import {postService} from "../domain/postService";
import {userService} from "../domain/userService";
import {commentService} from "../domain/commentService";
import {sessionRepository} from "../repositories/guard/sessionRepository";
import {requestRepository} from "../repositories/guard/requestRepository";


export const deleteAllDataController = async (req: Request, res: Response) => {
    const blogsDeleted = await blogService.deleteAllBlogs();
    const postsDeleted = await postService.deleteAllPosts();
    const usersDeleted = await userService.deleteAllUsers();
    const commentsDeleted = await commentService.deleteAllComments();
    const sessionsDeleted = await sessionRepository.deleteAllSessions();
    const requestLogsDeleted = await requestRepository.deleteAllRequests();
    if (blogsDeleted && postsDeleted && usersDeleted && commentsDeleted && sessionsDeleted && requestLogsDeleted) {
        res.sendStatus(204);
    }

}