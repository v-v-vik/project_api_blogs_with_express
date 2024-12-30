import {ObjectId} from "mongodb";
import {postRepository} from "../repositories/posts/postDbRepository";
import {blogRepository} from "../repositories/blogs/blogDbRepository";
import {PostInputModel, PostInputModel2} from "../domain/post entity";
import {BlogDBType} from "../domain/blog entity";
import {blogQueryRepository} from "../repositories/blogs/blogQueryRepository";
import {postQueryRepository} from "../repositories/posts/postQueryRepository";
import {QueryType} from "../input-output-types/some";
import {LikeInfoDBType, LikeInputModel, LikeStatus} from "../domain/like entity";
import {ResultStatus} from "../domain/result-object/result code";
import {likeRepository} from "../repositories/likes/likeDBRepository";
import {userRepository} from "../repositories/users/userDbRepository";


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
                createdAt: new Date().toISOString(),
                extendedLikesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: LikeStatus.None,
                    newestLikes: []
                }
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

    async find(blogId: string, data: QueryType, userId?: string) {
        const foundBlog = await blogQueryRepository.getBlogById(blogId);
        if (!foundBlog) return null;
        return postQueryRepository.getPostFilter(data, blogId, userId);
    }

    async addReaction(data:LikeInputModel, postId:string, userId: string) {
        const foundPost = await postRepository.findPostById(postId);
        if (!foundPost) {
            return {
                status: ResultStatus.NotFound,
                data: 'Post does not exist'
            }
        }
        const currentStatus = await likeRepository.findReactionStatusByParentId(postId, userId);
        if (currentStatus === data.likeStatus) {
            return {
                status: ResultStatus.NoContent,
                data: 'No changes made'
            }
        }
        const update: Partial<LikeInfoDBType> = {};
        if (data.likeStatus === LikeStatus.Like) {
            update.likesCount = (foundPost.extendedLikesInfo.likesCount || 0) + 1;
            update.dislikesCount = foundPost.extendedLikesInfo.dislikesCount;
            if (currentStatus === LikeStatus.Dislike) {
                update.dislikesCount = (foundPost.extendedLikesInfo.dislikesCount || 0) - 1;
            }
        } else if (data.likeStatus === LikeStatus.Dislike) {
            update.dislikesCount = (foundPost.extendedLikesInfo.dislikesCount || 0) + 1;
            update.likesCount = foundPost.extendedLikesInfo.likesCount;
            if (currentStatus === LikeStatus.Like) {
                update.likesCount = (foundPost.extendedLikesInfo.likesCount || 0) - 1;
            }
        } else if (data.likeStatus === LikeStatus.None) {
            if (currentStatus === LikeStatus.Like) {
                update.likesCount = (foundPost.extendedLikesInfo.likesCount || 0) - 1;
                update.dislikesCount = foundPost.extendedLikesInfo.dislikesCount
            } else if (currentStatus === LikeStatus.Dislike) {
                update.dislikesCount = (foundPost.extendedLikesInfo.dislikesCount || 0) - 1;
                update.likesCount = foundPost.extendedLikesInfo.likesCount;
            }
        }
        const res = await postRepository.updatePostLikes(postId, update);
        if (!res) {
            return {
                status: ResultStatus.BadRequest,
                data: 'Request failed'
            }
        }
        if (currentStatus !== null && currentStatus !== data.likeStatus) {
            console.log("inside the flag block")
            await likeRepository.flagReaction(postId, userId);
        }
        const userLogin = await userRepository.findUserById(userId);
        if (userLogin) {
            await likeRepository.addReaction(data.likeStatus, postId, userId, userLogin.accountData.login);
        }
        return {
            status: ResultStatus.NoContent,
            data: null
        }
    }
}

export const postService = new PostService();