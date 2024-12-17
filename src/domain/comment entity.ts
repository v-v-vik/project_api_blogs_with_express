import * as mongoose from "mongoose";
import {ObjectId, WithId} from "mongodb";
import {HydratedDocument, Model} from "mongoose";



export type CommentDBType = {
    _id: ObjectId;
    content: string;
    commentatorInfo: CommentatorInfoModel
    createdAt: string;
    postId: string;
}

export type CommentatorInfoModel = {
    userId: string;
    userLogin: string;
}


export type CommentViewModel = {
    id: string;
    content: string;
    commentatorInfo: {
        userId: string;
        userLogin: string;
    }
    createdAt: string;
}


export type CommentInputModel = {
    content: string;
}


export const commentatorInfoSchema = new mongoose.Schema<CommentatorInfoModel>({
    userId: {type: String, require: true},
    userLogin: {type: String, require: true}
})


export const commentSchema = new mongoose.Schema<WithId<CommentDBType>>({
    _id: {type: ObjectId, require: true},
    content: {type: String, require: true},
    commentatorInfo: {type:commentatorInfoSchema},
    createdAt: {type: String, require: true},
    postId: {type: String, require: true}
});



export const CommentModel = mongoose.model<CommentDBType, CommentModelType>('comments', commentSchema);


export type CommentModelType = Model<CommentDBType>;

export type CommentDocument = HydratedDocument<CommentDBType>;