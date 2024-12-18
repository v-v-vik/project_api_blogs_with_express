import {ObjectId, WithId} from "mongodb";
import mongoose, {HydratedDocument, Model} from "mongoose";


export type LikeDBType = {
    _id: ObjectId;
    createdAt: Date;
    status: LikeStatus;
    authorId: string;
    parentId: string;

}


export type LikeInputModel = {
    likeStatus: LikeStatus

}

export enum LikeStatus {
    None = 'None',
    Like = 'Like',
    Dislike = 'Dislike'
}



export type LikeInfoView = {
    likesCount: number;
    dislikesCount: number;
    myStatus: LikeStatus;
}

export type LikeInfoDBType = {
    likesCount: number;
    dislikesCount: number;
}


export const likeSchema = new mongoose.Schema<WithId<LikeDBType>>({
    _id: {type: ObjectId, require: true},
    createdAt: {type: Date, require: true},
    status: {type: String, require: true},
    authorId: {type: String, require: true},
    parentId: {type: String, require: true}
});
export const LikeModel = mongoose.model<LikeDBType, LikeModelType>('reactions', likeSchema);


export type LikeModelType = Model<LikeDBType>;

export type LikeDocument = HydratedDocument<LikeDBType>;