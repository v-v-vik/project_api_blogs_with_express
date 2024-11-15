import {UserDBType} from "../../input-output-types/user types";
import {userCollection} from "../db";
import {ObjectId} from "mongodb";


export const userRepository = {
    async createUser(data: UserDBType):Promise<string | null> {
        const result = await userCollection.insertOne(data);
        return result.insertedId.toString();
    },

    async findUserByEmailOrLogin(login: string, email: string) {
        const user = await userCollection.findOne({
            $or: [
                {login},
                {email}
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
                {login: loginOrEmail},
                {email: loginOrEmail}
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
    }
}