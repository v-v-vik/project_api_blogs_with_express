import {Request, Response} from "express";
import {userQueryRepository} from "../../repositories/users/userQueryRepository";


export const aboutUserController = async (req: Request,
                                          res: Response) => {


    const user = await userQueryRepository.getMeInfo(req.user.id);
    if (!user) {
        res.sendStatus(401);
        return;
    }

    res.status(200).json(user);


}