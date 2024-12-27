import {QueryType} from "../../input-output-types/some";
import {PostDBType, PostModel} from "../../domain/post entity";
import {sortQueryFields} from "../../utils/sortQueryFields.utils";


const postOutputMapper = (post:any) => ({
    id: post._id,
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId,
    blogName: post.blogName,
    createdAt: post.createdAt
})


export const postQueryRepository = {
    async getPostById(id: string ){
        const result = await PostModel.findOne({_id:id});
        if (result) {
            return postOutputMapper(result);
        }
        return null;

    },

    async getPostFilterByBlogID(query: QueryType, blogId: string) {

        const filter: any = {}

        if (blogId) {
            filter.blogId = blogId;

        }

        const searchNameTerm = query.searchNameTerm ?? null;
        if (searchNameTerm) {
         filter.title = {$regex: query.searchNameTerm, $options: 'i'};
        }

        const sortResult = sortQueryFields(query);


        try {
            const items = await PostModel
                .find(filter)
                .sort(sortResult.sort)
                .skip(sortResult.skip)
                .limit(sortResult.pageSize)
                .lean() as PostDBType[]

            const totalCount = await PostModel.countDocuments(filter);
            const mappedPosts = items.map((post) => postOutputMapper(post));

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

    },


    async getPostFilter(query: QueryType, id?: string, blogId?: string) {

        const filter: any = {}

        if (id) {
            filter._id = id;
        }

        const sortResult = sortQueryFields(query);


        try {
            const items = await PostModel
                .find(filter)
                .sort(sortResult.sort)
                .skip(sortResult.skip)
                .limit(sortResult.pageSize)
                .lean() as PostDBType[]

            const totalCount = await PostModel.countDocuments(filter);
            const mappedPosts = items.map((post) => postOutputMapper(post));

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



}