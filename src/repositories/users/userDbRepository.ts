import {ObjectId} from "mongodb";
import {ResultStatus} from "../../domain/result-object/result code";
import {UserDBType, UserModel} from "../../domain/user entity";


export const userRepository = {
    async createUser(data: UserDBType):Promise<string | null> {
        const result = await UserModel.create(data);
        return result.id;
    },

    async findUserByEmailOrLogin(login: string, email: string) {
        const user = await UserModel.findOne({
            $or: [
                {"accountData.login": login},
                {"accountData.email": email}
            ]
        });
        if (!user) {
            return null
        }
        return user
    },

    async checkUserByEmailOrLogin(loginOrEmail: string): Promise<UserDBType | null> {
        const user = await UserModel.findOne({
            $or: [
                {"accountData.login": loginOrEmail},
                {"accountData.email": loginOrEmail}
            ]
        });
        if (!user) {
            return null
        }
        return user
    },

    async findUserById(id: string): Promise<UserDBType | null> {
        const result = UserModel.findOne({_id:id});
        if (!result) {
            return null;
        }
        return result;
    },

    async deleteUser(id: string): Promise<boolean> {
        await UserModel.deleteOne({_id:new ObjectId(id)});
        return true;
    },

    async deleteAllUsers(): Promise<boolean> {
        await UserModel.deleteMany({});
        return true;
    },

    async findUserByCode(code: string): Promise<UserDBType | null> {
       return UserModel.findOne({"emailConfirmation.confirmationCode" : code})
    },

    async updateRegistrationStatus(id: string) {
        const result = await UserModel.updateOne(
            {_id:id},
            {
                $set: {"emailConfirmation.status": 1}
            }
        );
        if (result.matchedCount === 1) {
            return {
                status: ResultStatus.NoContent,
                data: null
            }
        }
        return {
            status: ResultStatus.NotFound,
            data: null
        }
    },

    async confirmationCodeUpdate(code: string, id: string): Promise<boolean> {
        const result = await UserModel.updateOne(
            {_id:id},
            {
                $set: {"emailConfirmation.confirmationCode": code}
            }
        );
        return result.matchedCount === 1;



    },

    async updatePassword(id: string, newPassword: string): Promise<boolean> {
        const result = await UserModel.updateOne(
            {_id:id},
            {
                $set: {"accountData.password": newPassword}
            }
        );
        return result.matchedCount === 1;
    }
}