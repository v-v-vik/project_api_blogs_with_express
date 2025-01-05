import {QueryType} from "../../input-output-types/some";
import {PostDBType, PostModel} from "../../domain/post entity";
import {sortQueryFields} from "../../utils/sortQueryFields.utils";
import {LikeDBType, LikeStatus, newLikesInfo} from "../../domain/like entity";
import {likeRepository} from "../likes/likeDBRepository";


const postOutputMapper = (post: PostDBType, userReaction: LikeStatus, latestLikes:newLikesInfo[] ) => ({
    id: post._id.toString(),
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId,
    blogName: post.blogName,
    createdAt: post.createdAt,
    extendedLikesInfo: {
        likesCount: post.extendedLikesInfo.likesCount,
        dislikesCount: post.extendedLikesInfo.dislikesCount,
        myStatus: userReaction,
        newestLikes: latestLikes
    }

})

const likeInfoMapper = (reaction: LikeDBType) => ({
    addedAt: reaction.createdAt,
    userId: reaction.authorId,
    login: reaction.authorLogin
})


export const postQueryRepository = {
    async getPostById(id: string, userId?: string ){
        let userReaction: LikeStatus = LikeStatus.None;
        let latestLikes: newLikesInfo[] = [];

        const foundLatestLikes = await likeRepository.getLatestLikes(id);
        if (foundLatestLikes) {
           latestLikes = foundLatestLikes.map((reaction: LikeDBType) => likeInfoMapper(reaction));
        }
        if (userId) {
            const res = await likeRepository.findReactionStatusByParentId(id, userId);
            if (res) {
                userReaction = res;
            }
        }
        const result = await PostModel.findOne({_id:id});
        if (result) {
            return postOutputMapper(result, userReaction, latestLikes);
        }
        return null;
    },

    async getPostFilter(query: QueryType, blogId?: string, userId?: string) {


        let latestLikes: newLikesInfo[] = [];
        let allUserReactions: LikeDBType[] | null = [];

        if (userId) {
            allUserReactions = await likeRepository.findAllReactionByUserId(userId);
        }

        const filter: any = {}
        if (blogId) {
            filter.blogId = blogId;
        }

        console.log("blogId is ", blogId)

        const sortResult = sortQueryFields(query);


        try {
            const items = await PostModel
                .find(filter)
                .sort(sortResult.sort)
                .skip(sortResult.skip)
                .limit(sortResult.pageSize)
                .lean() as PostDBType[]

            const totalCount = await PostModel.countDocuments(filter);

            const postIds = (await PostModel.find(filter).select('_id').lean()).map(item => item._id.toString());
            const foundLatestLikes = await likeRepository.findAllLikeReactionsByParentId(postIds);

            const mappedPosts = items.map((post) => {

                let userReaction: LikeStatus = LikeStatus.None;
                if (userId) {
                    if (allUserReactions) {
                        const specificCommReactions: LikeDBType[] = allUserReactions.filter(reaction => reaction.parentId === post._id.toString());
                        if(specificCommReactions.length > 0){
                            userReaction = specificCommReactions[0].status;
                        }
                    }
                }

                if (foundLatestLikes) {
                    const postLatestLikes = foundLatestLikes.filter(reaction => reaction.parentId === post._id.toString());
                    latestLikes = postLatestLikes.map((reaction: LikeDBType) => likeInfoMapper(reaction)).slice(0,3);
                }

                return postOutputMapper(post, userReaction, latestLikes);
            });

            return {
                pagesCount: Math.ceil(totalCount / sortResult.pageSize),
                page: sortResult.pageNumber,
                pageSize: sortResult.pageSize,
                totalCount: totalCount,
                items: mappedPosts
            }
        } catch (e) {
            console.log(e)
            return {
                pagesCount: 0,
                page: 0,
                pageSize: 0,
                totalCount: 0,
                items: [],
                error: e
            };
        }
    }

    // async getPostFilterByBlogID(query: QueryType, blogId: string) {
    //
    //     const filter: any = {}
    //
    //     if (blogId) {
    //         filter.blogId = blogId;
    //     }
    //
    //     let userReaction: LikeStatus = LikeStatus.None;
    //     let latestLikes: newLikesInfo[] = [];
    //
    //     const searchNameTerm = query.searchNameTerm ?? null;
    //     if (searchNameTerm) {
    //      filter.title = {$regex: query.searchNameTerm, $options: 'i'};
    //     }
    //
    //     const sortResult = sortQueryFields(query);
    //
    //
    //     try {
    //         const items = await PostModel
    //             .find(filter)
    //             .sort(sortResult.sort)
    //             .skip(sortResult.skip)
    //             .limit(sortResult.pageSize)
    //             .lean() as PostDBType[]
    //
    //         const totalCount = await PostModel.countDocuments(filter);
    //         const mappedPosts = items.map((post) => postOutputMapper(post, userReaction, latestLikes));
    //
    //         return {
    //             pagesCount: Math.ceil(totalCount / sortResult.pageSize),
    //             page: sortResult.pageNumber,
    //             pageSize: sortResult.pageSize,
    //             totalCount: totalCount,
    //             items: mappedPosts
    //         }
    //
    //
    //     } catch (e) {
    //         console.log(e)
    //         return {
    //             pagesCount: 0,
    //             page: 0,
    //             pageSize: 0,
    //             totalCount: 0,
    //             items: [],
    //             error: e
    //         };
    //     }
    //
    // },






}