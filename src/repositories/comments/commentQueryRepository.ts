
import {QueryType} from "../../input-output-types/some";
import {sortQueryFields} from "../../utils/sortQueryFields.utils";
import {CommentDBType, CommentModel} from "../../domain/comment entity";
import {LikeDBType, LikeStatus} from "../../domain/like entity";
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
            const res = await likeRepository.findReactionByParentId(id, userId);
            if (res) {
                userReaction = res;
            }
        }
        return commentOutputMapper(comment, userReaction);
    },

    async findCommentsByPostId(id: string, query: QueryType, userId?: string) {

        const sortResult = sortQueryFields(query);

        let allUserReactions: LikeDBType[] | null = [];
        if (userId) {
            allUserReactions = await likeRepository.findReactionByUserId(userId);
        }

        try {
            const items = await CommentModel
                .find({postId: id})
                .sort(sortResult.sort)
                .skip(sortResult.skip)
                .limit(sortResult.pageSize)
                .lean() as CommentDBType[]

            const totalCount = await CommentModel.countDocuments({postId: id});


            const mappedComments = items.map((comment) => {

                let userReaction: LikeStatus = LikeStatus.None;
                if (userId) {
                    if (allUserReactions) {
                        const specificCommReactions: LikeDBType[] = allUserReactions.filter(reaction => reaction.parentId === comment._id.toString());
                        if(specificCommReactions.length > 0){
                            userReaction = specificCommReactions[0].status;
                        }
                    }
                }

                return commentOutputMapper(comment, userReaction);
            })

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