import {UsersQueryFieldsType} from "../../input-output-types/some";
import {ObjectId} from "mongodb";
import {userCollection} from "../db";
import {UserDBType} from "../../input-output-types/user types";
import {sortQueryFields} from "../../utils/sortQueryFields.utils";


const userOutputMapper = (user:any) => ({
    id: user._id.toString(),
    login: user.login,
    email: user.email,
    createdAt: user.createdAt
})


export const userQueryRepository = {

    async getUserById(id: string){
        const result = await userCollection.findOne({_id:new ObjectId(id)});
        if (!result) {
            return null;
        }
        return userOutputMapper(result);
    },


    async getUsersFilter(query: UsersQueryFieldsType) {

        const filter:any = {};
        const searchLoginTerm = query.searchLoginTerm ?? null;
        const searchEmailTerm = query.searchEmailTerm ?? null

        if (searchLoginTerm) {
            filter.login = {$regex: query.searchLoginTerm, $options: 'i'}
        }
        if (searchEmailTerm) {
            filter.email = {$regex: query.searchEmailTerm, $options: 'i'}
        }

        const sortResult = sortQueryFields(query);


        try {
            const items = await userCollection
                .find(filter)
                .sort(sortResult.sort)
                .skip(sortResult.skip)
                .limit(sortResult.pageSize)
                .toArray() as UserDBType[]


            const totalCount = await userCollection.countDocuments(filter);
            const mappedUsers = items.map((user) => userOutputMapper(user));

            return {
                pagesCount: Math.ceil(totalCount / sortResult.pageSize),
                page: sortResult.pageNumber,
                pageSize: sortResult.pageSize,
                totalCount: totalCount,
                items: mappedUsers
            }

        } catch (error) {
            console.log(error)
            return {
                pagesCount: 0,
                page: 0,
                pageSize: 0,
                totalCount: 0,
                items: [],
                error: error
            };
        }
    }
}