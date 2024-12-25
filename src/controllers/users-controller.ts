import {UserInputModel, UserViewModel} from "../domain/user entity";
import {matchedData} from "express-validator";
import {userService} from "../application/userService";
import {userQueryRepository} from "../repositories/users/userQueryRepository";
import {Request, Response} from "express";
import {HttpStatuses} from "../domain/result-object/result code";
import {Paginator, ParamType, UsersQueryFieldsType} from "../input-output-types/some";


class UserController {
    async create(req: Request<any, any, UserInputModel>,
                 res: Response) {

        const data:UserInputModel = matchedData(req);
        const result = await userService.create(data);
        if (!result) {
            res
                .status(HttpStatuses.Conflict)
                .json({
                    errorsMessages: [{field: 'email/login', message: 'email or login already exist'}]
                })
            return;
        }
        const newUser = await userQueryRepository.getUserById(result);
        res
            .status(HttpStatuses.Created)
            .json(newUser)
    }

    async find(req: Request<any, any, any, UsersQueryFieldsType>,
               res: Response<Paginator<UserViewModel>>) {

        const foundUsers = await userQueryRepository.getUsersFilter(req.query);
        res
            .status(HttpStatuses.Success)
            .json(foundUsers)

    }

    async delete(req:Request<ParamType>,
                 res:Response) {

        const isDeleted = await userService.delete(req.params.id);
        if (isDeleted) {
            res
                .status(HttpStatuses.NoContent)
                .json()
        } else {
            res
                .status(HttpStatuses.NotFound)
                .json()
        }
    }
}

export const userController = new UserController();
