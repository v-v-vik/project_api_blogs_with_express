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
    MONGO_URI: process.env.mongoURI || "mongodb://localhost:27017",
    DB_NAME: isTesting ? process.env.DB_NAME_TEST : process.env.DB_NAME,
    ACCESS_TOKEN_SECRET: process.env.JWT_SECRET || 'accesstokensecret',
    REFRESH_TOKEN_SECRET: process.env.JWT_SECRET || 'refreshtokensecret',
    EMAIL: "veradev1327@gmail.com",
    EMAIL_PASS: "mowh qhfq addx qdvr"
    }