import {Request, Response} from 'express';
import {BlogModel} from "../domain/blog entity";
import {PostModel} from "../domain/post entity";
import {UserModel} from "../domain/user entity";
import {CommentModel} from "../domain/comment entity";
import {RequestModel} from "../domain/request entity";
import {SessionModel} from "../domain/session entity";
import {LikeModel} from "../domain/like entity";


export const deleteAllDataController = async (req: Request, res: Response) => {

    await BlogModel.collection.drop();
    await PostModel.collection.drop();
    await CommentModel.collection.drop();
    await RequestModel.collection.drop();
    await UserModel.collection.drop();
    await SessionModel.collection.drop();
    await LikeModel.collection.drop();
    res.sendStatus(204);

}