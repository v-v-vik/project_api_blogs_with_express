import express from 'express';
import cors from 'cors';
import {deleteAllDataController} from "./controllers/deleteAllDataController";
import {SETTINGS} from "./settings";
import {blogRouter} from "./routers/blogs-router";
import {postRouter} from "./routers/posts-router";
import {userRouter} from "./routers/users-router";
import {authRouter} from "./routers/auth-router";
import {commentRouter} from "./routers/comments-router";
import cookieParser from "cookie-parser";
import {sessionRouter} from "./routers/sessions-router";

export const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());



// app.get("/", (req, res) => {
//     res
//         .status(200)
//         .json({version: '1.0'})
// });
app.use(SETTINGS.PATH.BLOGS, blogRouter);
app.use(SETTINGS.PATH.POSTS, postRouter);
app.use(SETTINGS.PATH.USERS, userRouter);
app.use(SETTINGS.PATH.AUTH, authRouter);
app.use(SETTINGS.PATH.COMMENTS, commentRouter);
app.use(SETTINGS.PATH.SECURITY, sessionRouter);

app.delete("/testing/all-data", deleteAllDataController)

