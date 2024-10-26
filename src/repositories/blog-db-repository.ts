import {BlogDBType, BlogInputModel} from "../input-output-types/blog types";
import {blogCollection} from "./db";
import {ObjectId} from "mongodb";


export const blogRepository = {
    async createBlog(newBlog:BlogDBType) : Promise<ObjectId> {
        const result = await blogCollection.insertOne(newBlog);
        return result.insertedId;
    },

    async getAllBlogs(): Promise<BlogDBType[]> {
         return await blogCollection.find({}, {projection:{_id:0}}).toArray()
    },

    async findBlog(id:string) {
        return await blogCollection.findOne({id:id}, {projection:{_id:0}});

    },

    async findBlogByObjectId(_id: ObjectId) {
        return await blogCollection.findOne({_id:_id}, {projection:{_id:0}});
    },

    async updateBlog(blog: BlogInputModel, objId: ObjectId): Promise<boolean> {
        const res = await blogCollection.updateOne(
               {_id:objId},
               {
                   $set: {...blog}
               }
           );
            return res.matchedCount === 1;
    },

    async deleteBlog(objId: ObjectId): Promise<boolean> {
        await blogCollection.deleteOne({_id: objId});
        return true;
        }
    }

    // async find(id:string): Promise<WithId<BlogDBType> | null> {
    //     const searchBlog = await blogCollection.findOne({id:id}, {projection:{_id:0}});
    //     console.log("blog:", searchBlog);
    //     return searchBlog
    // }

