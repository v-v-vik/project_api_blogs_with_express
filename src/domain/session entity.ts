import {ObjectId, WithId} from "mongodb";
import mongoose, {HydratedDocument, Model} from "mongoose";

export type SessionViewModel = {
    ip: string;
    title: string;
    lastActiveDate: string;
    deviceId: string;

}

export type SessionDBType = {
    _id: ObjectId,
    ip: string;
    title: string;
    lastActiveDate: string;
    deviceId: string;
    userId: string;
    expDate: string;
};


export const sessionSchema = new mongoose.Schema<WithId<SessionDBType>>({
    _id: {type: ObjectId, require: true},
    ip:  {type: String, require: true},
    title:  {type: String, require: true},
    lastActiveDate:  {type: String, require: true},
    deviceId:  {type: String, require: true},
    userId:  {type: String, require: true},
    expDate:  {type: String, require: true}

});
export const SessionModel = mongoose.model<SessionDBType, SessionModelType>('sessions', sessionSchema);


export type SessionModelType = Model<SessionDBType>;

export type SessionDocument = HydratedDocument<SessionDBType>;