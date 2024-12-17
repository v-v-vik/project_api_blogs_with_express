import {Sort} from "mongodb";
import {QueryType} from "../../input-output-types/some";
import {BlogDBType, BlogModel} from "../../domain/blog entity";


const blogOutputMapper = (blog:any) => ({
    id: blog._id,
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    createdAt: blog.createdAt,
    isMembership: blog.isMembership
})



export const blogQueryRepository = {

    async getBlogById(id: string)  {
        const result = await BlogModel.findOne({_id: id});
        if (!result) {
            return null;
        }
        return blogOutputMapper(result);
    },


    async getBlogsFilter(id: string | undefined, query: QueryType) {

        const filter: any = {};
        //Set the filter to search by id if provided
        if (id) {
            filter._id = id
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
            const items = await BlogModel
                .find(filter)
                .sort(sort)
                .skip(skip)
                .limit(pageSize)
                .lean() as BlogDBType[]




            //Count total documents
            const totalCount = await BlogModel.countDocuments(filter);
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




