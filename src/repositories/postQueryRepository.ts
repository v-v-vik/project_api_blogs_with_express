import {postCollection} from "./db";
import {ObjectId, Sort} from "mongodb";
import {QueryType} from "../input-output-types/some";
import {PostDBType} from "../input-output-types/post types";


const postOutputMapper = (post:any) => ({
    id: post._id.toString(),
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId,
    blogName: post.blogName,
    createdAt: post.createdAt
})


export const postQueryRepository = {
    async getPostById(id: string){
        const result = await postCollection.findOne({_id:new ObjectId(id)});
        if (result) {
            return postOutputMapper(result);
        }
        return null;

    },

    async getPostFilterByBlogID(query: QueryType, blogId: string) {

        const filter: any = {}

        if (blogId) {
            filter.blogId = blogId;
            console.log("BlogId is:", blogId)
        }

        console.log("filter is:", filter)

        // const searchNameTerm = query.searchNameTerm ?? null;
        // if (searchNameTerm) {
        //  filter.title = {$regex: query.searchNameTerm, $options: 'i'};
        // }

        const pageNumber = query.pageNumber ? +query.pageNumber : 1;
        const pageSize = query.pageSize !== undefined ? +query.pageSize : 10;
        const skip = (pageNumber - 1) * pageSize;

        const sort: Sort = {
            [query.sortBy || 'createdAt']: query.sortDirection === 'asc' ? 1 : -1,
        };

        try {
            const items = await postCollection
                .find(filter)
                .sort(sort)
                .skip(skip)
                .limit(pageSize)
                .toArray() as PostDBType[]

            const totalCount = await postCollection.countDocuments(filter);
            const mappedPosts = items.map((post) => postOutputMapper(post));

            return {
                pagesCount: Math.ceil(totalCount / pageSize),
                page: pageNumber,
                pageSize: pageSize,
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
            filter._id = new ObjectId(id);
        }


        // const searchNameTerm = query.searchNameTerm ?? null;
        // if (searchNameTerm) {
        //  filter.title = {$regex: query.searchNameTerm, $options: 'i'};
        // }

        const pageNumber = query.pageNumber ? +query.pageNumber : 1;
        const pageSize = query.pageSize !== undefined ? +query.pageSize : 10;
        const skip = (pageNumber - 1) * pageSize;

        const sort: Sort = {
            [query.sortBy || 'createdAt']: query.sortDirection === 'asc' ? 1 : -1,
        };

        try {
            const items = await postCollection
                .find(filter)
                .sort(sort)
                .skip(skip)
                .limit(pageSize)
                .toArray() as PostDBType[]

            const totalCount = await postCollection.countDocuments(filter);
            const mappedPosts = items.map((post) => postOutputMapper(post));

            return {
                pagesCount: Math.ceil(totalCount / pageSize),
                page: pageNumber,
                pageSize: pageSize,
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