import {ObjectId} from "mongodb";


export type PostDBType = {
    _id: ObjectId,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string
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
    createdAt: string

}

export type PostInputModel2 = {
    title: string,
    shortDescription: string,
    content: string,
    blogId?: string,
}