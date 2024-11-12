

export type CommentDBType = {
    _id: string;
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