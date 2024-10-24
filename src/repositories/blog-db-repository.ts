import {BlogDBType, BlogInputModel} from "../input-output-types/blog types";
import {blogCollection} from "./db";
import {ObjectId} from "mongodb";


export const blogRepository = {
    async createBlog(blog:BlogInputModel) : Promise<ObjectId> {
        const newId = new ObjectId();
        const itemsCount = await blogCollection.countDocuments();
        const newBlog: BlogDBType = {
            _id: newId,
            id: (itemsCount + 1).toString(), //(db_mockup.blogs.length + 1).toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }

        await blogCollection.insertOne(newBlog);
        return newId


    },

    async getAllBlogs(): Promise<BlogDBType[]> {
         return await blogCollection.find({}, {projection:{_id:0}}).toArray()
    },

    async findBlog(id:string) {
        const foundBlog = await blogCollection.findOne({id:id}, {projection:{_id:0}});
        console.log("FoundBlog:", foundBlog, id);
        return foundBlog;

    },

    async findBlogByUUID(_id: ObjectId) {
        return await blogCollection.findOne({_id:_id}, {projection:{_id:0}});
    },

    async updateBlog(id: string, blog: BlogInputModel): Promise<boolean> {
        const foundBlog = await blogCollection.findOne({id: id});
        if (foundBlog) {
           const res = await blogCollection.updateOne(
               {id:id},
               {
                   $set: {...blog}
               }
           )
            return res.matchedCount === 1;
        } else {
            return false;
        }
    },

    async deleteBlog(id:string): Promise<boolean> {
        const foundBlog = await blogCollection.findOne({id: id});
        if (foundBlog) {
            await blogCollection.deleteOne({id: id});
            return true;
        } else {
            return false;
        }
    },

    // async find(id:string): Promise<WithId<BlogDBType> | null> {
    //     const searchBlog = await blogCollection.findOne({id:id}, {projection:{_id:0}});
    //     console.log("blog:", searchBlog);
    //     return searchBlog
    // }

}