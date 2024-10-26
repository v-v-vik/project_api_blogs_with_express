import {blogCollection, postCollection} from "./db";
import {PostDBType, PostInputModel} from "../input-output-types/post types";
import {ObjectId} from "mongodb";


export const postRepository = {
    async createPost(post:PostInputModel):Promise<ObjectId> {
        const newId = new ObjectId();
        console.log(newId)
        const itemsCount = await postCollection.countDocuments();
        const blog = await blogCollection.findOne({id: post.blogId});
        console.log("finding blog in create-rep:", blog)
        if (blog) {
            const newPost = {
                _id: newId,
                id: (itemsCount + 1).toString(),
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: post.blogId,
                blogName: blog.name,
                createdAt: new Date().toISOString()
            }
            await postCollection.insertOne(newPost);

        }
        return newId;
    },

    async getPostByObjectId(_id: ObjectId) {
        return await postCollection.findOne({_id: _id}, {projection:{_id:0}});
    },

    async getAllPosts(): Promise<PostDBType[]> {
        return await postCollection.find({}, {projection:{_id:0}}).toArray();
    },

    async findPost(id:string): Promise<PostDBType | null> {
        return await postCollection.findOne({id}, {projection:{_id:0}});

    },

    async updatePost(id: string, post: PostInputModel) {
        const foundPost = await postCollection.findOne({id});
        if (foundPost) {
             await postCollection.updateOne(
                {id:id},
                {
                    $set: {...post}
                }
            )
            return true;
        } else {
            return false;
        }
    },

    async deletePost(id:string) {
        const foundPost = await postCollection.findOne({id});
        if (foundPost) {
            await postCollection.deleteOne({id});
            return true;
        } else {
            return false;
        }
    },

    async find(id:string) {
        return postCollection.findOne({id}, {projection:{_id:0}});
    }

}