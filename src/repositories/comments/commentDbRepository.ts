import {CommentDBType, CommentInputModel} from "../../input-output-types/comment types";
import {commentCollection} from "../db";
import {ObjectId} from "mongodb";


export const commentRepository = {
    async createComment(data: CommentDBType) {
        const result = await commentCollection.insertOne(data);
        if (!result) return null;
        return result.insertedId.toString();
    },

    async deleteAllComments() {
        await commentCollection.deleteMany({});
        return true;
    },

    async findCommentById(id: string) {
        const result = await commentCollection.findOne({_id:new ObjectId(id)});
        if (!result) {
            return null;
        }
        return result;
    },

    async deleteComment(id: string) {
        const result = await commentCollection.deleteOne({_id:new ObjectId(id)});
        if (!result) return false;
        return true;
    },

    async updateComment(data: CommentInputModel, id: string) {
        const result = await commentCollection.updateOne(
            {_id:new ObjectId(id)},
            {
                $set: {...data}
            }
        );
        return result.matchedCount === 1;
    }


}