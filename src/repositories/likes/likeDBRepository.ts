import {LikeModel, LikeStatus} from "../../domain/like entity";
import {ObjectId} from "mongodb";


export const likeRepository = {
    async addReaction(data:LikeStatus, commentId: string, userId: string, userLogin:string) {
        const res = await LikeModel.create({
            _id: new ObjectId(),
            createdAt: new Date(),
            status: data,
            authorId: userId,
            authorLogin: userLogin,
            parentId: commentId,
            isDeleted: false
        })
        return !!res.id;
    },

    async findReactionStatusByParentId(commentId: string, userId: string) {
        const res = await LikeModel.findOne({
            parentId: commentId,
            authorId: userId
        }).sort({createdAt: -1}).lean();
        if (!res) {
            return null;
        }
        return res.status;
    },

    async findAllReactionByUserId(userId: string) {
        const res = await LikeModel.find({authorId:userId, isDeleted:false}).sort({createdAt: -1});
        if (!res) {
            return null;
        }
        return res
    },

    async flagReaction(postId: string, userId: string) {
        const res = await LikeModel.updateOne(
        {
            parentId: postId,
            authorId: userId,
            isDeleted: false
        },{

            $set: {isDeleted: true}
        });
        return res.matchedCount === 1

    },

    async getLatestLikes(postId: string) {
        const res = await LikeModel.find({
            parentId: postId,
            status:LikeStatus.Like,
            isDeleted: false
        }).sort({createdAt: -1}).limit(3);
        if (!res) {
            return null;
        }
        return res
    },

    async findAllLikeReactionsByParentId(postId: string[]) {
        const res = await LikeModel.find({
            parentId: {$in: postId},
            isDeleted: false,
            status: LikeStatus.Like
        }).sort({createdAt: -1});
        if (!res) {
            return null;
        }
        return res
    },

}