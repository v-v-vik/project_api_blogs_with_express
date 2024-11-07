import {postCollection} from "../db";
import {PostDBType, PostInputModel} from "../../input-output-types/post types";
import {ObjectId} from "mongodb";


export const postRepository = {
    async createPost(newPost:PostDBType):Promise<string> {
        const result = await postCollection.insertOne(newPost);
        return result.insertedId.toString();
    },


    async updatePost(id: string, post: PostInputModel): Promise<boolean> {
       const res = await postCollection.updateOne(
                {_id:new ObjectId(id)},
                {
                    $set: {...post}
                }
            )
        return res.matchedCount === 1;
    },

    async deletePost(id:string) {
        await postCollection.deleteOne({_id:new ObjectId(id)});
            return true;

    },

    async deleteAllPosts(): Promise<boolean> {
        await postCollection.deleteMany({});
        return true;
    },

    async findPostById(id: string)  {
        const result = await postCollection.findOne({_id:new ObjectId(id)});
        if (result) {
            return result;
        }
        return null;
    }
}