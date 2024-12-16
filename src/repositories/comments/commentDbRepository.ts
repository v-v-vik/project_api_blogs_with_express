import {CommentDBType, CommentInputModel} from "../../input-output-types/comment types";
import {commentCollection} from "../db";
import {ObjectId} from "mongodb";
import {ResultStatus} from "../../domain/result-object/result code";


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
        return await commentCollection.deleteOne({_id: new ObjectId(id)});

    },

    async updateComment(data: CommentInputModel, id: string) {
        const result = await commentCollection.updateOne(
            {_id:new ObjectId(id)},
            {
                $set: {...data}
            }
        );
        if (result.matchedCount === 1) {
            return {
                status: ResultStatus.NoContent,
                data: null
            }
        }
        return {
            status: ResultStatus.NotFound,
            data: null
        }
    }


}