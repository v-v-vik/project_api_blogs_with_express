import {UserDBType} from "../../input-output-types/user types";
import {userCollection} from "../db";


export const userDbRepository = {
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
    }
}