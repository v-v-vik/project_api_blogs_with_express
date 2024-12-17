import {SETTINGS} from "../settings";
import mongoose from "mongoose";


// export const client = new MongoClient(SETTINGS.MONGO_URI);

// export const db = client.db(SETTINGS.DB_NAME);

// //export const blogCollection = db.collection<BlogDBType>(SETTINGS.PATH.BLOGS);
// export const postCollection = db.collection<PostDBType>(SETTINGS.PATH.POSTS);
// export const userCollection = db.collection<UserDBType>(SETTINGS.PATH.USERS);
// export const commentCollection = db.collection<CommentDBType>(SETTINGS.PATH.COMMENTS);
// export const sessionCollection = db.collection<DeviceAuthSessionDBModel>("deviceAuthSessions");
// export const requestCollection = db.collection<RequestLogDBModel>("requestLogs");

export async function runDB() {

    try {
        await mongoose.connect(SETTINGS.MONGO_URI + "/" + SETTINGS.DB_NAME);
        console.log("Connected successfully with Mongoose.");
    } catch {
        console.log("Failed to connect to database.");
        await mongoose.disconnect();
    }


}




