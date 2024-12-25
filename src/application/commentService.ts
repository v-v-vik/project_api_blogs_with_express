import {ObjectId} from "mongodb";
import {userService} from "./userService";
import {commentRepository} from "../repositories/comments/commentDbRepository";
import {ResultStatus} from "../domain/result-object/result code";
import {CommentDBType, CommentInputModel} from "../domain/comment entity";
import {LikeInfoDBType, LikeInputModel, LikeStatus} from "../domain/like entity";
import {likeRepository} from "../repositories/likes/likeDBRepository";
import {commentQueryRepository} from "../repositories/comments/commentQueryRepository";
import {postRepository} from "../repositories/posts/postDbRepository";
import {QueryType} from "../input-output-types/some";



class CommentService {
    async create(data: CommentInputModel, postId:string, userId: string) {
        const foundPost = await postRepository.findPostById(postId);
        if (!foundPost) return null;
        const newId = new ObjectId();
        const foundUser = await userService.findById(userId);
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
            const newCommentId = await commentRepository.createComment(newEntry);
            return await commentQueryRepository.getCommentById(newCommentId)
        }
        return null;
    }

    async findById(commentId: string, userId?: string) {
        const foundComment = await commentRepository.findCommentById(commentId);
        if (!foundComment) return null;
        return await commentQueryRepository.getCommentById(commentId, userId)

    }

    async findByPostId(postId: string, query: QueryType, userId?: string) {
        const foundPost = await postRepository.findPostById(postId);
        if (!foundPost) return null;
        return await commentQueryRepository.findCommentsByPostId(postId, query, userId);
    }

    async delete(id: string, userId: string) {
        const foundComment = await commentRepository.findCommentById(id);
        if (!foundComment) {
            return {
                status: ResultStatus.NotFound,
                data: null
            }
        }
        if (userId === foundComment.commentatorInfo.userId) {
              await commentRepository.deleteComment(id);
              return {
                  status: ResultStatus.NoContent,
                  data: null
              }
            }
        return {
            status: ResultStatus.Forbidden,
            data: null
        }
    }

    async update(id: string, data: CommentInputModel, userId: string) {

        const foundComment = await commentRepository.findCommentById(id);
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

    async addReaction(data:LikeInputModel, commentId:string, userId: string) {
        const foundComment = await commentRepository.findCommentById(commentId);
        if (!foundComment) {
            return {
                status: ResultStatus.NotFound,
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

export const commentService = new CommentService();