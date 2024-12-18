import {ObjectId} from "mongodb";
import {userService} from "./userService";
import {commentRepository} from "../repositories/comments/commentDbRepository";
import {ResultStatus} from "../domain/result-object/result code";
import {CommentDBType, CommentInputModel} from "../domain/comment entity";
import {LikeInfoDBType, LikeInputModel, LikeStatus} from "../domain/like entity";
import {likeRepository} from "../repositories/likes/likeDBRepository";


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
                postId:postId,
                likesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                }
            }

            return await commentRepository.createComment(newEntry);
        }
        return null;

    },
    // async deleteAllComments() {
    //     return await commentRepository.deleteAllComments();
    // },

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
    },

    async manageReaction(data:LikeInputModel, commentId:string, userId: string) {
        const foundComment = await commentRepository.findCommentById(commentId);
        if (!foundComment) {
            return {
                status: ResultStatus.BadRequest,
                data: 'Comment does not exist'

            }
        }

        const currentStatus = await likeRepository.findReactionByParentId(commentId, userId);
        console.log("current status is", currentStatus)
        if (currentStatus === data.likeStatus) {
            return {
                status: ResultStatus.NoContent,
                data: 'No changes made'
            }
        }

        const update: Partial<LikeInfoDBType> = {};
        if (data.likeStatus === LikeStatus.Like) {
            update.likesCount = (foundComment.likesInfo.likesCount || 0) + 1;
            update.dislikesCount = foundComment.likesInfo.dislikesCount;
            if (currentStatus === LikeStatus.Dislike) {
                update.dislikesCount = (foundComment.likesInfo.dislikesCount || 0) - 1;
            }
        } else if (data.likeStatus === LikeStatus.Dislike) {
            update.dislikesCount = (foundComment.likesInfo.dislikesCount || 0) + 1;
            update.likesCount = foundComment.likesInfo.likesCount;
            if (currentStatus === LikeStatus.Like) {
                update.likesCount = (foundComment.likesInfo.likesCount || 0) - 1;
            }
        } else if (data.likeStatus === LikeStatus.None) {
            if (currentStatus === LikeStatus.Like) {
                update.likesCount = (foundComment.likesInfo.likesCount || 0) - 1;
                update.dislikesCount = foundComment.likesInfo.dislikesCount
            } else if (currentStatus === LikeStatus.Dislike) {
                update.dislikesCount = (foundComment.likesInfo.dislikesCount || 0) - 1;
                update.likesCount = foundComment.likesInfo.likesCount;
            }
        }

        const res = await commentRepository.updateCommentLikes(commentId, update);
        if (!res) {
            return {
                status: ResultStatus.BadRequest,
                data: 'Request failed'
            }
        }
        await likeRepository.addReaction(data.likeStatus, commentId, userId);

        return {
            status: ResultStatus.NoContent,
            data: null
        }

    }
}