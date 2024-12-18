import {LikeModel, LikeStatus} from "../../domain/like entity";
import {ObjectId} from "mongodb";


export const likeRepository = {
    async addReaction(data:LikeStatus, commentId: string, userId: string) {
        const res = await LikeModel.create({
            _id: new ObjectId(),
            createdAt: new Date(),
            status: data,
            authorId: userId,
            parentId: commentId
        })
        return !!res.id;
    },

    async findReactionByParentId(commentId: string, userId: string) {
        const res = await LikeModel.findOne({
            parentId: commentId,
            authorId: userId
        })
        if (!res) {
            return null;
        }
        return res.status;
    },

    async deleteReaction(commentId: string, userId: string) {
        const res = await LikeModel.deleteOne({
            authorId: userId,
            parentId: commentId
        })
        if (!res) {
            return null;
        }
        return res;
    }
}