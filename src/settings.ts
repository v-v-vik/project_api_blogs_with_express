import { config } from "dotenv";
config()

const isTesting = process.env.ENV === 'TESTING'

export const SETTINGS = {
    PORT: process.env.port || 3000,
    PATH: {
        BLOGS: "/blogs",
        POSTS: "/posts",
        USERS: "/users",
        AUTH: "/auth",
        COMMENTS: "/comments",
        SECURITY: "/security/devices"
    },
    ADMIN: process.env.ADMIN || 'admin:qwerty',
    MONGO_URI: process.env.mongoURI || "mongodb://127.0.0.1:27017",
    DB_NAME: isTesting ? process.env.DB_NAME_TEST : process.env.DB_NAME,
    ACCESS_TOKEN_SECRET: process.env.JWT_SECRET || 'accesstokensecret',
    REFRESH_TOKEN_SECRET: process.env.JWT_SECRET || 'refreshtokensecret',
    EMAIL: process.env.EMAIL,
    EMAIL_PASS: process.env.EMAIL_PASS
    }