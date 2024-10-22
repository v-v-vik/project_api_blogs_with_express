import {Request, Response} from 'express';
import {db_mockup} from "../repositories/db";



export const deleteAllDataController = (req: Request, res: Response) => {
    db_mockup.blogs = [];
    db_mockup.posts = [];
    res.sendStatus(204);
}