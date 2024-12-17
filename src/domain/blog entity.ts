import * as mongoose from "mongoose";
import {ObjectId, WithId} from "mongodb";
import {HydratedDocument, Model} from "mongoose";

export type BlogDBType = {
    _id: ObjectId;
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean
}

export type BlogViewModel = {
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean
}

export type BlogInputModel = {
    name: string,
    description: string,
    websiteUrl: string


}

export type BlogEntryModel = {
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean
}

export const blogSchema = new mongoose.Schema<WithId<BlogDBType>>({
    _id: {type: ObjectId, require: true},
    name: {type: String, require: true},
    description: {type: String, require: true},
    websiteUrl: {type: String, require: true},
    createdAt: {type: String, require: true},
    isMembership: {type: Boolean, require: true},
});
export const BlogModel = mongoose.model<BlogDBType, BlogModelType>('blogs', blogSchema);


export type BlogModelType = Model<BlogDBType>;

export type BlogDocument = HydratedDocument<BlogDBType>;