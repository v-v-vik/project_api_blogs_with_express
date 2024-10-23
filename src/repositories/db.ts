import {BlogDBType} from "../input-output-types/blog types";
import {PostDBType} from "../input-output-types/post types";
import {SETTINGS} from "../settings";
import {MongoClient} from "mongodb";


export type DBType = {
    blogs: BlogDBType[],
    posts: PostDBType[]
}


export const db_mockup: DBType = {
    blogs: [],
    posts: []
}


export const client = new MongoClient(SETTINGS.MONGO_URI);

export const db = client.db(SETTINGS.DB_NAME);
export const blogCollection = db.collection<BlogDBType>(SETTINGS.PATH.BLOGS);
export const postCollection = db.collection<PostDBType>(SETTINGS.PATH.POSTS);

export async function runDB() {
    try {
        await client.connect();
        await db.command({ ping:1 });
        console.log('DB_NAME', SETTINGS.DB_NAME)
        console.log("Connected successfully to mongo server.");
    } catch {
        console.log("Failed to connect to database.")
        await client.close();
    }


}




