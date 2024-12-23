import {Request, Response} from 'express';
import {Paginator, UsersQueryFieldsType} from "../../input-output-types/some";
import {userQueryRepository} from "../../repositories/users/userQueryRepository";
import {UserViewModel} from "../../domain/user entity";


export const findUsersController = async (req: Request<any, any, any, UsersQueryFieldsType>,
                                          res: Response<Paginator<UserViewModel>>) => {


    const searchUser = await userQueryRepository.getUsersFilter(req.query);
    if (searchUser) {
        res.json(searchUser)
    } else {
        res.sendStatus(404)
    }
}