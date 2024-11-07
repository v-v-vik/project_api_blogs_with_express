import {BlogDBType, BlogInputModel} from "../input-output-types/blog types";
import {blogRepository} from "../repositories/blogDbRepository";
import {ObjectId} from "mongodb";


export const blogService: any = {
    async createBlog(data: BlogInputModel) {
        const newId = new ObjectId();
        const newEntry: BlogDBType = {
            _id: newId,
            name: data.name,
            description: data.description,
            websiteUrl: data.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }
        return await blogRepository.createBlog(newEntry)

    },

    async updateBlog(id: string, blog: BlogInputModel): Promise<boolean> {
        const foundBlog = await blogRepository.findBlogById(id);
        if (foundBlog) {
            return await blogRepository.updateBlog(blog, id);
        } else {
            return false;
        }
    },

    async deleteBlog(id: string): Promise<boolean> {
        const foundBlog = await blogRepository.findBlogById(id);
        if (foundBlog) {
            return await blogRepository.deleteBlog(id);
        } else {
            return false;
        }
    },

    async deleteAllBlogs() {
        return await blogRepository.deleteAllBlogs()
    }


}