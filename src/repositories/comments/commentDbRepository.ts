
import {ResultStatus} from "../../domain/result-object/result code";
import {CommentDBType, CommentInputModel, CommentModel} from "../../domain/comment entity";


export const commentRepository = {
    async createComment(data: CommentDBType) {
        const result = await CommentModel.create(data);
        if (!result) return null;
        return result.id;
    },

    async deleteAllComments() {
        await CommentModel.deleteMany({});
        return true;
    },

    async findCommentById(id: string) {
        const result = await CommentModel.findOne({_id:id});
        if (!result) {
            return null;
        }
        return result;
    },

    async deleteComment(id: string) {
        await CommentModel.deleteOne({_id: id});
        return true;

    },

    async updateComment(data: CommentInputModel, id: string) {
        const result = await CommentModel.updateOne(
            {_id:id},
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