import {UserDBType} from "../../input-output-types/user auth types";
import {userCollection} from "../db";
import {ObjectId} from "mongodb";
import {ResultStatus} from "../../result-object/result code";


export const userRepository = {
    async createUser(data: UserDBType):Promise<string | null> {
        const result = await userCollection.insertOne(data);
        return result.insertedId.toString();
    },

    async findUserByEmailOrLogin(login: string, email: string) {
        const user = await userCollection.findOne({
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

    async checkUserByEmailOrLogin(loginOrEmail: string) {
        const user = await userCollection.findOne({
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
        return await userCollection.findOne({_id:new ObjectId(id)});
    },

    async deleteUser(id: string): Promise<boolean> {
        await userCollection.deleteOne({_id:new ObjectId(id)});
        return true;
    },

    async deleteAllUsers(): Promise<boolean> {
        await userCollection.deleteMany({});
        return true;
    },

    async findUserByCode(code: string): Promise<UserDBType | null> {
       return await userCollection.findOne({"emailConfirmation.confirmationCode" : code})
    },

    async updateRegistrationStatus(id: string) {
        const result = await userCollection.updateOne(
            {_id:new ObjectId(id)},
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
        const result = await userCollection.updateOne(
            {_id:new ObjectId(id)},
            {
                $set: {"emailConfirmation.confirmationCode": code}
            }
        );
        return result.matchedCount === 1;



    }
}