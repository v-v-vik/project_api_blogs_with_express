
import {ObjectId} from "mongodb";
import {userService} from "./userService";
import {commentRepository} from "../repositories/comments/commentDbRepository";
import {ResultStatus} from "../domain/result-object/result code";
import {CommentDBType, CommentInputModel} from "../domain/comment entity";


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
                    userLogin: foundUser.accountData.login
                },
                createdAt: new Date().toISOString(),
                postId:postId
            }

            return await commentRepository.createComment(newEntry);
        }
        return null;

    },
    async deleteAllComments() {
        return await commentRepository.deleteAllComments();
    },

    async findCommentById(id: string) {
        return await commentRepository.findCommentById(id);
    },

    async deleteComment(id: string, userId: string, comment: CommentDBType) {
        if (userId === comment.commentatorInfo.userId) {
              return await commentRepository.deleteComment(id);
            }
        return false;


    },

    async updateComment(id: string, data: CommentInputModel, userId: string) {

        const foundComment = await commentService.findCommentById(id);
        if (foundComment === null) {
            return {
                status: ResultStatus.NotFound,
                data: null
            };
        }

        if(userId === foundComment.commentatorInfo.userId) {
            return await commentRepository.updateComment(data, id);
        }
        return {
            status: ResultStatus.Forbidden,
            data: null
        };
    }
}