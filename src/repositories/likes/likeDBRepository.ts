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
        }).sort({createdAt: -1}).lean();
        if (!res) {
            return null;
        }
        return res.status;
    },

    async findReactionByUserId(userId: string) {
        const res = await LikeModel.find({authorId:userId}).sort({createdAt: -1});
        if (!res) {
            return null;
        }
        return res
    }

}