import { config } from "dotenv";
config()

export const SETTINGS = {
    PORT: process.env.port || 3000,
    PATH: {
        BLOGS: "/blogs",
        POSTS: "/posts"
    },
    ADMIN: process.env.ADMIN || 'admin:qwerty',
    MONGO_URI: process.env.mongoURI || "mongodb://localhost:27017",
    DB_NAME: "BlogsDB"
}