import {BlogDBType, BlogInputModel, BlogModel} from "../../src/domain/blog entity";
import {ObjectId} from "mongodb";
import {PostDBType, PostInputModel, PostModel} from "../../src/domain/post entity";


export const blogsTestManager = {
    createData({ description, name, websiteUrl }: { description?: string; name?: string; websiteUrl?: string }): BlogInputModel {
        return {
            description: description ?? 'Some blog description',
            name: name ?? 'Some Blog Name',
            websiteUrl: websiteUrl ?? 'https://some-blog.com/'
        }
    },

    createBlogsData(count: number): BlogInputModel[] {
        const blogs = [];
        for (let i = 0; i <= count; i++) {
            blogs.push({
                description: 'Some blog description' + i,
                name: 'Some Blog Name' + i,
                websiteUrl: `https://some-blog${i}.com/`
            })
        }
        return blogs
    },

    async createBlog(data: BlogInputModel, count?: number): Promise<BlogDBType[]> {
        if (count) {
            const blogs = [];
            for (let i = 0; i <= count; i++) {
                blogs.push({
                    _id: new ObjectId(),
                    name: data.name + i,
                    description: data.description + i,
                    websiteUrl: `https://some-blog${i}.com/`,
                    createdAt: new Date().toISOString(),
                    isMembership: false
                })
            }
            await BlogModel.insertMany(blogs);
            return blogs

        }
        const blogData = {
            _id: new ObjectId(),
            name: data.name,
            description: data.description,
            websiteUrl: data.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }
        await BlogModel.create(blogData)
        return [blogData]
    }

}

export const postsTestManager = {
    createData({ title, content, shortDescription, blogId }: { title?: string; content?: string; shortDescription?: string, blogId: string }): PostInputModel {
        return {
            title: title ?? 'Post title',
            content: content ?? 'Some content',
            shortDescription: shortDescription ?? 'some very short description',
            blogId
        }
    },

    async createPost(blogId: string, blogName: string, data: PostInputModel, count?: number): Promise<PostDBType[]> {
        if (count) {
            const posts = [];
            for (let i = 0; i <= count; i++) {
                posts.push({
                    _id: new ObjectId(),
                    title: data.title + i,
                    shortDescription: data.shortDescription + i,
                    content: data.content + i,
                    blogId,
                    blogName,
                    createdAt: new Date().toISOString()
                })
            }
            await PostModel.insertMany(posts);
            return posts

        }
        const postData = {
            _id: new ObjectId(),
            title: data.title ?? 'Some title',
            shortDescription: data.shortDescription ?? 'some very short description',
            content: data.content ?? 'Some content',
            blogId,
            blogName,
            createdAt: new Date().toISOString()
        }
        await BlogModel.create(postData);
        return [postData]
    }
}