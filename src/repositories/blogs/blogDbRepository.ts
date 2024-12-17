
import {BlogDBType, BlogInputModel, BlogModel} from "../../domain/blog entity";


export const blogRepository = {
    async createBlog(newBlog:BlogDBType) : Promise<string> {
        const blog = await BlogModel.create(newBlog);
        return blog.id;
    },

    async updateBlog(blog: BlogInputModel, id: string): Promise<boolean> {
        const res = await BlogModel.updateOne(
               {_id: id},
               {
                   $set: {...blog}
               }
           );
            return res.matchedCount === 1;
    },

    async deleteBlog(id: string): Promise<boolean> {
        await BlogModel.deleteOne({_id: id});
        return true;
        },

    async deleteAllBlogs(): Promise<boolean> {
        await BlogModel.deleteMany({});
        return true;
    },

    async findBlogById(id: string) {
        const res = await BlogModel.findOne({_id: id});
        if (!res) return null;
        return res

    }
}


