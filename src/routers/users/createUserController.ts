import {UserInputModel} from "../../input-output-types/user types";
import {Request, Response} from "express";
import {matchedData} from "express-validator";
import {userService} from "../../domain/userService";
import {userQueryRepository} from "../../repositories/users/userQueryRepository";


export const createUserController = async (req: Request<any, any, UserInputModel>,
                                           res: Response) => {
    //authorisation
    //validation
    const data:UserInputModel = matchedData(req);

    const newUserId = await userService.createUser(data);
    if (newUserId === null) {
        res
            .status(409)
            .json({
                errorsMessages: [{field: 'email', message: 'email should be unique'}]
            })
        return;
    }
    const newUser = await userQueryRepository.getUserById(newUserId);

    res
        .status(201)
        .json(newUser);
}