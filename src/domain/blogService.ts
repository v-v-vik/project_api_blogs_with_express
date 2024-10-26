import {BlogDBType, BlogInputModel, BlogViewModel} from "../input-output-types/blog types";
import {blogRepository} from "../repositories/blog-db-repository";
import {ObjectId} from "mongodb";
import {blogCollection} from "../repositories/db";

const blogOutputMapper = (blog:BlogDBType) => {


}

export const blogService = {
    async createBlog(data: BlogInputModel) {
        const newId = new ObjectId();
        const itemsCount = await blogCollection.countDocuments();
        const newEntry: BlogDBType = {
            _id: newId,
            // id: (itemsCount + 1).toString(), //(db_mockup.blogs.length + 1).toString(),
            name: data.name,
            description: data.description,
            websiteUrl: data.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }
        const newBlogId = await blogRepository.createBlog(newEntry);
        return await blogRepository.findBlogByObjectId(newBlogId)

    },

    async updateBlog(id: string, blog: BlogInputModel): Promise<boolean> {
        const foundBlog = await blogRepository.findBlogByObjectId(new ObjectId(id));
        if (foundBlog) {
            return await blogRepository.updateBlog(blog, new ObjectId(id));
        } else {
            return false;
        }
    },

    async deleteBlog(id: string): Promise<boolean> {
        const foundBlog = await blogRepository.findBlogByObjectId(new ObjectId(id));
        if (foundBlog) {
           return await blogRepository.deleteBlog(new ObjectId(id));
        } else {
            return false;
        }
    }
}