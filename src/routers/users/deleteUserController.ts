import {Request, Response} from 'express';
import {userService} from "../../domain/userService";
import {ParamType} from "../../input-output-types/some";

export const deleteUserController = async (req:Request<ParamType>,
                                           res:Response) => {


    const isDeleted = await userService.deleteUser(req.params.id);

    if (isDeleted) {
        res.sendStatus(204)

    } else {
        res.sendStatus(404)
    }
}