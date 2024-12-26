import {UserDBType, UserModel} from "../../src/domain/user entity";
import {randomUUID} from "node:crypto";
import {ObjectId} from "mongodb";
import {bcryptService} from "../../src/adapters/bcrypt.service";
import {SETTINGS} from "../../src/settings";
import {agent} from "supertest";
import {app} from "../../src/app";

export type UserDto = {
    login: string;
    email: string;
    password: string;
}

export type UserTokens = {
    accessToken: string;
    refreshToken: string;
}

const req = agent(app);

export const usersTestManager = {
    createData({ email, login, password }: { email?: string; login?: string; password?: string }): UserDto {
        return {
            login: login ?? 'someUser',
            email: email ?? 'abc@gmail.com',
            password: password ?? 'p123456',

        }
    },

    createUsersData(count: number) : UserDto[] {
        const users = [];
        for (let i = 0; i <= count; i++) {
            users.push({
                login: 'someUser' + i,
                email: `abs${i}@gmail.com`,
                password: 'p123456',
            })
        }
        return users
    },

    async create(userData: UserDto) : Promise<UserDBType> {
        const newId = new ObjectId();
        const hashedPass = await bcryptService.passwordHash(userData.password);
        const newUserData = {
            _id: newId,
            accountData: {
                login: userData.login,
                email: userData.email,
                password: hashedPass,
                createdAt: new Date().toISOString()
            },
            emailConfirmation: {
                confirmationCode: randomUUID(),
                expirationDate: new Date(),
                status: 1
            }
        }
        await UserModel.create(newUserData);
        return newUserData
    },

    async login(loginOrEmail: string, password: string, deviceName?: string ): Promise<UserTokens> {

        const res = await req
            .post(`${SETTINGS.PATH.AUTH}/login`)
            .send({loginOrEmail, password})
            .set({'User-Agent': deviceName ?? 'testDevice'})

        const accessToken = res.body.accessToken;
        const cookies:any = res.headers['set-cookie'];
        let refreshToken: any;
        if (cookies) {
            const refreshCookie = cookies.find((cookie:string) => cookie.startsWith('refreshToken='));
            if (refreshCookie) {
                refreshToken = refreshCookie.split(';')[0].split('=')[1];
            }
        }
        return {accessToken, refreshToken};

    }
}

