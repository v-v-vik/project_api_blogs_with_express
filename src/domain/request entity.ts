import mongoose, {HydratedDocument, Model} from "mongoose";
import {ObjectId, WithId} from "mongodb";


export type RequestLogDBModel = {
    _id: ObjectId;
    ip: string;
    url: string;
    date: Date;

}

export const requestEntity = new mongoose.Schema<WithId<RequestLogDBModel>>({
    _id: {type: ObjectId, require: true},
    ip: {type: String, require: true},
    url: {type: String, require: true},
    date: {type: Date, require: true}
});
export const RequestModel = mongoose.model<RequestLogDBModel, RequestModelType>('requests', requestEntity);


export type RequestModelType = Model<RequestLogDBModel>;

export type RequestDocument = HydratedDocument<RequestLogDBModel>;