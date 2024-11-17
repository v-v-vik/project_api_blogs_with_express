import {CommentDBType, CommentInputModel} from "../input-output-types/comment types";
import {ObjectId} from "mongodb";
import {userService} from "./userService";
import {commentRepository} from "../repositories/comments/commentDbRepository";


export const commentService = {
    async createComment(data: CommentInputModel, postId:string, userId: string): Promise<string | null> {
        const newId = new ObjectId();
        const foundUser = await userService.findUserById(userId);

        if (foundUser) {
            const newEntry: CommentDBType = {
                _id: newId,
                content: data.content,
                commentatorInfo: {
                    userId: userId,
                    userLogin: foundUser.login
                },
                createdAt: new Date().toISOString(),
                postId:postId
            }

            return await commentRepository.createComment(newEntry);
        }
        return null;

    }
}