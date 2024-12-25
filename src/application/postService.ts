import {ObjectId} from "mongodb";
import {postRepository} from "../repositories/posts/postDbRepository";
import {blogRepository} from "../repositories/blogs/blogDbRepository";
import {PostInputModel, PostInputModel2} from "../domain/post entity";
import {BlogDBType} from "../domain/blog entity";
import {blogQueryRepository} from "../repositories/blogs/blogQueryRepository";
import {postQueryRepository} from "../repositories/posts/postQueryRepository";
import {QueryType} from "../input-output-types/some";


class PostService {
    async create(data: PostInputModel | PostInputModel2, blogId?: string): Promise<string | null> {
        const newId = new ObjectId();
        const resolvedBlogId: any = blogId || data.blogId;
        const blog: BlogDBType | null = await blogRepository.findBlogById(resolvedBlogId);
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
    }

    async update(id: string, post: PostInputModel): Promise<boolean> {
        const foundPost = await postRepository.findPostById(id);
        if (foundPost) {
            return await postRepository.updatePost(id, post);
        } else {
            return false;
        }
    }

    async delete(id: string) {
        const foundPost = await postRepository.findPostById(id);
        if (foundPost) {
            return await postRepository.deletePost(id);
        } else {
            return false;
        }
    }
    // async findById(id: string) {
    //     return await postRepository.findPostById(id);
    // }

    async find(blogId: string, data: QueryType) {
        const foundBlog = await blogQueryRepository.getBlogById(blogId);
        if (!foundBlog) return null;
        return postQueryRepository.getPostFilterByBlogID(data, blogId);
    }
}

export const postService = new PostService();