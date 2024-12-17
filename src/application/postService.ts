import {ObjectId} from "mongodb";
import {postRepository} from "../repositories/posts/postDbRepository";
import {blogRepository} from "../repositories/blogs/blogDbRepository";
import {PostInputModel, PostInputModel2} from "../domain/post entity";
import {BlogDBType} from "../domain/blog entity";


export const postService = {
    async createPost(data: PostInputModel | PostInputModel2, blogId?:string): Promise<string | null> {
        const newId = new ObjectId();
        const resolvedBlogId: any = blogId || data.blogId;
        const blog:BlogDBType | null = await blogRepository.findBlogById(resolvedBlogId);
        if (blog) {
            const newEntry = {
                _id: newId,
                title: data.title,
                shortDescription: data.shortDescription,
                content: data.content,
                blogId: resolvedBlogId,
                blogName: blog.name,
                createdAt: new Date().toISOString()
            }
            return await postRepository.createPost(newEntry);

        }
      return null;

    },


    async updatePost(id: string, post: PostInputModel):Promise<boolean> {
        const foundPost = await postRepository.findPostById(id);
        if (foundPost) {
          return await postRepository.updatePost(id, post);
        } else {
            return false;
        }
    },

    async deletePost(id: string) {
        const foundPost = await postRepository.findPostById(id);
        if (foundPost) {
            return await postRepository.deletePost(id);
        } else {
            return false;
        }
    },

    async deleteAllPosts() {
        return await postRepository.deleteAllPosts();
    },

    async findPostById(id: string) {
        return await postRepository.findPostById(id);
    }
}