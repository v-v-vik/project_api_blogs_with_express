import {ObjectId} from "mongodb";


export type CommentDBType = {
    _id: ObjectId;
    content: string;
    commentatorInfo: {
        userId: string;
        userLogin: string;
    }
    createdAt: string;
    postId: string;
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

export type CommentatorInfoModel = {
    userId: string;
    userLogin: string;
}

export type CommentInputModel = {
    content: string;
}