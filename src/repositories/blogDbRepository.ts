import {BlogDBType, BlogInputModel} from "../input-output-types/blog types";
import {blogCollection} from "./db";
import {ObjectId} from "mongodb";


export const blogRepository = {
    async createBlog(newBlog:BlogDBType) : Promise<string> {
        const result = await blogCollection.insertOne(newBlog);
        return result.insertedId.toString();
    },

    async updateBlog(blog: BlogInputModel, id: string): Promise<boolean> {
        const res = await blogCollection.updateOne(
               {_id:new ObjectId(id)},
               {
                   $set: {...blog}
               }
           );
            return res.matchedCount === 1;
    },

    async deleteBlog(id: string): Promise<boolean> {
        await blogCollection.deleteOne({_id: new ObjectId(id)});
        return true;
        },

    async deleteAllBlogs(): Promise<boolean> {
        await blogCollection.deleteMany({});
        return true;
    }
}


