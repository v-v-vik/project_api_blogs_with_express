import {ObjectId, Sort} from "mongodb";
import {blogCollection} from "../db";
import {QueryType} from "../../input-output-types/some";
import {BlogDBType} from "../../input-output-types/blog types";

const blogOutputMapper = (blog:any) => ({
    id: blog._id.toString(),
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    createdAt: blog.createdAt,
    isMembership: blog.isMembership
})



export const blogQueryRepository = {

    async getBlogById(id: string)  {
        const result = await blogCollection.findOne({_id: new ObjectId(id)});
        if (result) {
            return blogOutputMapper(result);
        }
        return null;

    },


    async getBlogsFilter(id: string | undefined, query: QueryType) {

        const filter: any = {};
        //Set the filter to search by id if provided
        if (id) {
            filter._id = new ObjectId(id);
        }
        //Set the filter to search by term in blog title
        const searchNameTerm = query.searchNameTerm ?? null;
        if (searchNameTerm) {
            filter.name = {$regex: query.searchNameTerm, $options: 'i'}
        }



        // Set pagination defaults
        const pageNumber = query.pageNumber ? +query.pageNumber : 1;

        const pageSize = query.pageSize !== undefined ? +query.pageSize : 10;

        const skip = (pageNumber - 1) * pageSize;

        //Sort settings
        const sort: Sort = {
            [query.sortBy || 'createdAt']: query.sortDirection === 'asc' ? 1 : -1,
        };


        try {
            const items = await blogCollection
                .find(filter)
                .sort(sort)
                .skip(skip)
                .limit(pageSize)
                .toArray() as BlogDBType[]



            //Count total documents
            const totalCount = await blogCollection.countDocuments(filter);
            const mappedBlogs = items.map((blog) => blogOutputMapper(blog));


            return {
                pagesCount: Math.ceil(totalCount / pageSize),
                page: pageNumber,
                pageSize: pageSize,
                totalCount: totalCount,
                items: mappedBlogs
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




