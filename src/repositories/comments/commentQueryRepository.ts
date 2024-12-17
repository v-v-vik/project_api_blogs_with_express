
import {QueryType} from "../../input-output-types/some";
import {sortQueryFields} from "../../utils/sortQueryFields.utils";
import {CommentDBType, CommentModel} from "../../domain/comment entity";

const commentOutputMapper = (comment: CommentDBType) =>  ({
    id: comment._id,
    content: comment.content,
    commentatorInfo: {
        userId: comment.commentatorInfo.userId,
        userLogin: comment.commentatorInfo.userLogin
    },
    createdAt: comment.createdAt
})

export const commentQueryRepository = {
    async getCommentById(id: string) {
        const comment = await CommentModel.findOne({_id: id});
        if (!comment) return null;
        return commentOutputMapper(comment);
    },

    async findCommentsByPostId(id: string, query: QueryType) {



        const sortResult = sortQueryFields(query);



        try {
            const items = await CommentModel
                .find({postId:id})
                .sort(sortResult.sort)
                .skip(sortResult.skip)
                .limit(sortResult.pageSize)
                .lean() as CommentDBType[]



            const totalCount = await CommentModel.countDocuments({postId:id});

            const mappedComments = items.map((comment) => commentOutputMapper(comment));

            return {
                pagesCount: Math.ceil(totalCount / sortResult.pageSize),
                page: sortResult.pageNumber,
                pageSize: sortResult.pageSize,
                totalCount: totalCount,
                items: mappedComments
            }
        } catch (error) {
            console.log(error);
            return {
                pagesCount: 0,
                page: 0,
                pageSize: 0,
                totalCount: 0,
                items: [],
                error: error
            };
        }

    }
}