import {UsersQueryFieldsType} from "../../input-output-types/some";
import {sortQueryFields} from "../../utils/sortQueryFields.utils";
import {UserDBType, UserModel} from "../../domain/user entity";


const userOutputMapper = (user:any) => ({
    id: user._id,
    login: user.accountData.login,
    email: user.accountData.email,
    createdAt: user.accountData.createdAt
})

const userAuthOutputMapper = (user:any) => ({
    login: user.accountData.login,
    email: user.accountData.email,
    userId: user._id
})


export const userQueryRepository = {

    async getMeInfo(id: string){
      const result = await UserModel.findOne({_id:id});
      if (!result) {
          return null;
      }
      return userAuthOutputMapper(result);
    },

    async getUserById(id: string){
        const result = await UserModel.findOne({_id:id});
        if (!result) {
            return null;
        }
        return userOutputMapper(result);
    },


    async getUsersFilter(query: UsersQueryFieldsType) {

        // const filter:any = {$or: []};

        const filter:any = { $or: [] };


        const searchLoginTerm = query.searchLoginTerm ?? null;
        const searchEmailTerm = query.searchEmailTerm ?? null;




        if (searchLoginTerm) {
            filter.$or.push({"accountData.login": {$regex: query.searchLoginTerm, $options: 'i'}})
        }
        if (searchEmailTerm) {
            filter.$or.push({"accountData.email": {$regex: query.searchEmailTerm, $options: 'i'}})
        }

        if (filter.$or.length === 0) {
            delete filter.$or;
        }


        const sortResult = sortQueryFields(query);



        try {
            const items = await UserModel
                .find(filter)
                .sort(sortResult.sort)
                .skip(sortResult.skip)
                .limit(sortResult.pageSize)
                .lean() as UserDBType[]


            const totalCount = await UserModel.countDocuments(filter);
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