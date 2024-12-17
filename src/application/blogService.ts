import {blogRepository} from "../repositories/blogs/blogDbRepository";
import {ObjectId, WithId} from "mongodb";
import {BlogDBType, BlogInputModel} from "../domain/blog entity";


export const blogService: any = {
    async createBlog(data: BlogInputModel): Promise<string> {
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
        const foundBlog: WithId<BlogDBType> | null = await blogRepository.findBlogById(id);
        if (foundBlog) {
            return await blogRepository.updateBlog(blog, id);
        } else {
            return false;
        }
    },

    async deleteBlog(id: string): Promise<boolean> {
        const foundBlog: WithId<BlogDBType> | null = await blogRepository.findBlogById(id);
        if (foundBlog) {
            return await blogRepository.deleteBlog(id);
        } else {
            return false;
        }
    },

    async deleteAllBlogs(): Promise<boolean> {
        return await blogRepository.deleteAllBlogs()
    }


}