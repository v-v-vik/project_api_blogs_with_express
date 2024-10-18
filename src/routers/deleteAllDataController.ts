import {Request, Response} from 'express';
import {db} from "../repositories/db";



export const deleteAllDataController = (req: Request, res: Response) => {
    db.blogs = [];
    db.posts = [];
    res.sendStatus(204);
}