import express from 'express';
import cors from 'cors';
import {deleteAllDataController} from "./routers/deleteAllDataController";
import {SETTINGS} from "./settings";
import {blogRouter} from "./routers/blogs/blogs-router";
import {postRouter} from "./routers/posts/posts-router";
import {userRouter} from "./routers/users/users-router";
import {authRouter} from "./routers/auth/auth-router";
import {commentRouter} from "./routers/comments/comments-router";

export const app = express();
app.use(express.json());
app.use(cors());


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

app.delete("/testing/all-data", deleteAllDataController)

