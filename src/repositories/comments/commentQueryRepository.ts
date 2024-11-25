import {CommentDBType, CommentViewModel} from "../../input-output-types/comment types";
import {commentCollection} from "../db";
import {ObjectId} from "mongodb";
import {QueryType} from "../../input-output-types/some";
import {sortQueryFields} from "../../utils/sortQueryFields.utils";

const commentOutputMapper = (comment: CommentDBType) =>  ({
    id: comment._id.toString(),
    content: comment.content,
    commentatorInfo: {
        userId: comment.commentatorInfo.userId,
        userLogin: comment.commentatorInfo.userLogin
    },
    createdAt: comment.createdAt
})

export const commentQueryRepository = {
    async getCommentById(id: string): Promise<CommentViewModel | null> {
        const comment = await commentCollection.findOne({_id: new ObjectId(id)});
        if (!comment) return null;
        return commentOutputMapper(comment);
    },

    async findCommentsByPostId(id: string, query: QueryType) {



        const sortResult = sortQueryFields(query);



        try {
            const items = await commentCollection
                .find({postId:id})
                .sort(sortResult.sort)
                .skip(sortResult.skip)
                .limit(sortResult.pageSize)
                .toArray() as CommentDBType[]



            const totalCount = await commentCollection.countDocuments({postId:id});

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