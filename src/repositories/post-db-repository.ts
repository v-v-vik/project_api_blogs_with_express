import {blogCollection, postCollection} from "./db";
import {PostDBType, PostInputModel} from "../input-output-types/post types";
import {ObjectId} from "mongodb";


export const postRepository = {
    async createPost(post:PostInputModel):Promise<ObjectId> {
        const newId = new ObjectId();
        console.log(newId)
        const itemsCount = await postCollection.countDocuments();
        const blog = await blogCollection.findOne({id: post.blogId});
        if (blog) {
            const newPost = {
                _id: newId,
                id: (itemsCount + 1).toString(),
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: post.blogId,
                blogName: blog.name,
                createdAt: new Date().toString()
            }
            const res = await postCollection.insertOne(newPost);
            console.log("NewPost was added:", res, "newId:", res.insertedId)
        }
        return newId;
    },

    async getPostByUUID(_id: ObjectId) {
        return postCollection.findOne({_id: _id}, {projection:{_id:0}});
    },

    async getAllPosts(): Promise<PostDBType[]> {
        return postCollection.find({}, {projection:{_id:0}}).toArray();
    },

    async findPost(id:string): Promise<PostDBType | null> {
        return postCollection.findOne({id:id}, {projection:{_id:0}});

    },

    async updatePost(id: string, post: PostInputModel) {
        const foundPost = await postCollection.findOne({id:id});
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
        const foundPost = await postCollection.findOne({id: id});
        if (foundPost) {
            await postCollection.deleteOne({id: id});
            return true;
        } else {
            return false;
        }
    },

    async find(id:string) {
        return postCollection.findOne({id:id}, {projection:{_id:0}});
    }

}