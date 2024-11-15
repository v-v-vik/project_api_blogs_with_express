import {CommentDBType, CommentViewModel} from "../../input-output-types/comment types";
import {commentCollection} from "../db";
import {ObjectId} from "mongodb";

const commentOutputMapper = (comment: CommentDBType) =>  ({
    id: comment._id.toString(),
    content: comment.content,
    commentatorInfo: {
        userId: comment.commentatorInfo.userId,
        userLogin: comment.commentatorInfo.userId
    },
    createdAt: comment.createdAt
})

export const commentQueryRepository = {
    async getCommentById(id: string): Promise<CommentViewModel | null> {
        const comment = await commentCollection.findOne({_id: new ObjectId(id)});
        if (!comment) return null;
        return commentOutputMapper(comment);
    }
}