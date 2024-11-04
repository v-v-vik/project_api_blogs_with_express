import {PostInputModel, PostInputModel2} from "../input-output-types/post types";
import {ObjectId} from "mongodb";
import {BlogViewModel} from "../input-output-types/blog types";
import {postRepository} from "../repositories/postDbRepository";
import {postQueryRepository} from "../repositories/postQueryRepository";
import {blogQueryRepository} from "../repositories/blogQueryRepository";


export const postService = {
    async createPost(data: PostInputModel | PostInputModel2, blogId?:string): Promise<string | null> {
        const newId = new ObjectId();
        const resolvedBlogId: any = blogId || data.blogId;
        const blog:BlogViewModel | null = await blogQueryRepository.getBlogById(resolvedBlogId);
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
      return null

    },


    async updatePost(id: string, post: PostInputModel):Promise<boolean> {
        const foundPost = await postQueryRepository.getPostById(id);
        if (foundPost) {
          return await postRepository.updatePost(id, post);
        } else {
            return false;
        }
    },

    async deletePost(id: string) {
        const foundPost = await postQueryRepository.getPostById(id);
        if (foundPost) {
            return await postRepository.deletePost(id);
        } else {
            return false;
        }
    },

    async deleteAllPosts() {
        return await postRepository.deleteAllPosts();
    }
}