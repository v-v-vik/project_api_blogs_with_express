import {CommentDBType} from "../../input-output-types/comment types";
import {commentCollection} from "../db";


export const commentRepository = {
    async createComment(data: CommentDBType) {
        const result = await commentCollection.insertOne(data);
        if (!result) return null;
        return result.insertedId.toString();
    }
}