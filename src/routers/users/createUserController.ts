import {UserInputModel} from "../../input-output-types/user auth types";
import {Request, Response} from "express";
import {matchedData} from "express-validator";
import {userService} from "../../application/userService";
import {userQueryRepository} from "../../repositories/users/userQueryRepository";


export const createUserController = async (req: Request<any, any, UserInputModel>,
                                           res: Response) => {
    //authorisation
    //validation
    const data:UserInputModel = matchedData(req);

    const result = await userService.createUser(data);
    if (result === null) {
        res
            .status(409)
            .json({
                errorsMessages: [{field: 'email/login', message: 'email or login already exist'}]
            })
        return;
    }
    const newUser = await userQueryRepository.getUserById(result);

    res
        .status(201)
        .json(newUser);
}