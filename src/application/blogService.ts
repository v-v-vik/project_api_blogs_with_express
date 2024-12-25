import {blogRepository} from "../repositories/blogs/blogDbRepository";
import {ObjectId, WithId} from "mongodb";
import {BlogDBType, BlogInputModel} from "../domain/blog entity";


class BlogService {
    async create(data: BlogInputModel): Promise<string> {
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

    }

    async update(id: string, blog: BlogInputModel): Promise<boolean> {
        const foundBlog: WithId<BlogDBType> | null = await blogRepository.findBlogById(id);
        if (foundBlog) {
            return await blogRepository.updateBlog(blog, id);
        } else {
            return false;
        }
    }

    async delete(id: string): Promise<boolean> {
        const foundBlog: WithId<BlogDBType> | null = await blogRepository.findBlogById(id);
        if (foundBlog) {
            return await blogRepository.deleteBlog(id);
        } else {
            return false;
        }
    }
    //
    // async deleteAllBlogs(): Promise<boolean> {
    //     return await blogRepository.deleteAllBlogs()
    // }
}

export const blogService = new BlogService();