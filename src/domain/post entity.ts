import * as mongoose from "mongoose";
import {ObjectId, WithId} from "mongodb";
import {HydratedDocument, Model} from "mongoose";
import {commentLikeInfoSchema} from "./comment entity";
import {PostLikesInfo} from "./like entity";

export type PostDBType = {
    _id: ObjectId,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string,
    extendedLikesInfo: PostLikesInfo
}

export type PostInputModel = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string
}

export type PostViewModel = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string,
    extendedLikesInfo: PostLikesInfo

}

export type PostInputModel2 = {
    title: string,
    shortDescription: string,
    content: string,
    blogId?: string,
}


export const postSchema = new mongoose.Schema<WithId<PostDBType>>({
    _id: {type: ObjectId, require: true},
    title: {type: String, require: true},
    shortDescription: {type: String, require: true},
    content: {type: String, require: true},
    blogId: {type: String, require: true},
    blogName: {type: String, require: true},
    createdAt: {type: String, require: true},
    extendedLikesInfo: {type: commentLikeInfoSchema, require: true}


});
export const PostModel = mongoose.model<PostDBType, PostModelType>('posts', postSchema);


export type PostModelType = Model<PostDBType>;

export type PostDocument = HydratedDocument<PostDBType>;