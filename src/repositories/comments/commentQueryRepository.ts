
import {QueryType} from "../../input-output-types/some";
import {sortQueryFields} from "../../utils/sortQueryFields.utils";
import {CommentDBType, CommentModel} from "../../domain/comment entity";
import {LikeStatus} from "../../domain/like entity";
import {likeRepository} from "../likes/likeDBRepository";

const commentOutputMapper = (comment: CommentDBType, userReaction: LikeStatus) =>  ({
    id: comment._id,
    content: comment.content,
    commentatorInfo: {
        userId: comment.commentatorInfo.userId,
        userLogin: comment.commentatorInfo.userLogin
    },
    createdAt: comment.createdAt,
    likesInfo: {
        likesCount: comment.likesInfo.likesCount,
        dislikesCount: comment.likesInfo.dislikesCount,
        myStatus: userReaction
    }
})

export const commentQueryRepository = {
    async getCommentById(id: string, userId?: string) {
        let userReaction: LikeStatus = LikeStatus.None;
        const comment = await CommentModel.findOne({_id: id});
        if (!comment) return null;
        if (userId) {
            console.log("passed userId:", userId)
            const res = await likeRepository.findReactionByParentId(id, userId);
            if (res) {
                userReaction = res;
            }
        }
        console.log("comment before mapping:", comment)

        return commentOutputMapper(comment, userReaction);
    },

    async findCommentsByPostId(id: string, query: QueryType, userId?: string) {

        const sortResult = sortQueryFields(query);

        console.log("userId passed in QRepo", userId)

        try {
            const items = await CommentModel
                .find({postId:id})
                .sort(sortResult.sort)
                .skip(sortResult.skip)
                .limit(sortResult.pageSize)
                .lean() as CommentDBType[]

            const totalCount = await CommentModel.countDocuments({postId:id});


            const mappedComments = await Promise.all (items.map(async(comment) => {

                let userReaction: LikeStatus = LikeStatus.None;
                if (userId) {
                    console.log("passed in mapping userId:", userId)
                    const res = await likeRepository.findReactionByParentId(comment._id.toString(), userId);
                    console.log("last reaction:", res)
                    if (res) {
                        userReaction = res;
                    }
                }
                return commentOutputMapper(comment, userReaction);

            }));

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