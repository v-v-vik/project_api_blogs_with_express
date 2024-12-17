import {PostDBType, PostDocument, PostInputModel, PostModel} from "../../domain/post entity";


export const postRepository = {
    async createPost(newPost:PostDBType):Promise<string> {
        const result: PostDocument = await PostModel.create(newPost);
        return result.id;
    },


    async updatePost(id: string, post: PostInputModel): Promise<boolean> {
       const res = await PostModel.updateOne(
                {_id:id},
                {
                    $set: {...post}
                }
            )
        return res.matchedCount === 1;
    },

    async deletePost(id:string):Promise<boolean> {
        await PostModel.deleteOne({_id:id});
            return true;

    },

    async deleteAllPosts(): Promise<boolean> {
        await PostModel.deleteMany({});
        return true;
    },

    async findPostById(id: string)  {
        const result = await PostModel.findOne({_id:id});
        if (!result) {
            return null;
        }
        return result;
    }
}