import {SETTINGS} from "../../src/settings";
import {
    blogCollection,
    postCollection,
    requestCollection,
    sessionCollection,
    userCollection
} from "../../src/repositories/db";
import {agent} from "supertest";
import {app} from "../../src/app";
import {ObjectId} from "mongodb";
import {bcryptService} from "../../src/adapters/bcrypt.service";
import {randomUUID} from "node:crypto";
import {jwtService} from "../../src/adapters/jwtService";
import {Payload} from "../../src/input-output-types/token";

const req = agent(app);

function generateRt(userId: string, count: number) {
    const results = [];
    for (let i = 0; i < count; i++) {
        const dID = randomUUID();
        const rToken = jwtService.createRefreshToken(userId, dID);
        const payload = jwtService.verifyRefreshToken(rToken) as Payload;

        results.push({ dID, rToken, payload });
    }
    return results;

}

describe(SETTINGS.PATH.SECURITY, () => {

    let userId: ObjectId;
    let userLogin: string;

    let tokensData:{ dID: string, rToken: string, payload: Payload }[];
    let token: string;

    beforeAll(async () => {
        await blogCollection.deleteMany({});
        await postCollection.deleteMany({});
        await userCollection.deleteMany({})
        await requestCollection.deleteMany({});
        await sessionCollection.deleteMany({});
    })

    it ("it should return active sessions", async () => {
        //create new user
        userId = new ObjectId();
        userLogin = "myLogin123";
        const hashedPass = await bcryptService.passwordHash("password12345");
        await userCollection.insertOne({
            _id: userId,
            accountData: {
                login: userLogin,
                email: "email123@gmail.com",
                password: hashedPass,
                createdAt: new Date().toISOString()
            },
            emailConfirmation: {
                confirmationCode: randomUUID(),
                expirationDate: new Date(),
                status: 1
            }
        });
        //login user 4 times
        tokensData = generateRt(userId.toString(), 4);
        token = jwtService.createAccessToken(userId.toString());

        await sessionCollection.insertMany([
            {
            _id: new ObjectId(),
            ip: "1:1:1",
            title: "Device1",
            lastActiveDate:tokensData[0].payload.iat.toString(),
            deviceId: tokensData[0].dID,
            userId: userId.toString(),
            expDate: tokensData[0].payload.exp.toString()
        }, {
            _id: new ObjectId(),
            ip: "1:1:1",
            title: "Device2",
            lastActiveDate:tokensData[1].payload.iat.toString(),
            deviceId: tokensData[1].dID,
            userId: userId.toString(),
            expDate: tokensData[1].payload.exp.toString()
            },
            {
            _id: new ObjectId(),
            ip: "1:1:1",
            title: "Device3",
            lastActiveDate:tokensData[2].payload.iat.toString(),
            deviceId: tokensData[2].dID,
            userId: userId.toString(),
            expDate: tokensData[2].payload.exp.toString()
            },
            {
            _id: new ObjectId(),
            ip: "1:1:1",
            title: "Device4",
            lastActiveDate:tokensData[3].payload.iat.toString(),
            deviceId: tokensData[3].dID,
            userId: userId.toString(),
            expDate: tokensData[3].payload.exp.toString()
            }
        ]);




        const res = await req
            .get(SETTINGS.PATH.SECURITY)
            .set({
                'Authorization': 'Bearer ' + token,
                'Cookie': `refreshToken=${tokensData[3].rToken}`
            })
            .expect(200)

        const sessions = res.body;

        expect(sessions).toHaveLength(4);

    })

    it ("it should get 401 when trying to return all devices with active sessions with wrong token", async () => {

        await req
            .get(SETTINGS.PATH.SECURITY)
            .set({
                'Authorization': 'Bearer ' + '213213215464',
                'Cookie': `refreshToken=123`
            })
            .expect(401)

    })

    it ("it should get 401 when trying to delete all devices with wrong token", async () => {

        await req
            .delete(SETTINGS.PATH.SECURITY)
            .set({
                'Authorization': 'Bearer ' + '213213215464',
                'Cookie': `refreshToken=123`
            })
            .expect(401)
    })

    it ("it should get 401 when trying to delete session by device id with wrong token", async () => {

        await req
            .delete(`${SETTINGS.PATH.SECURITY}/${tokensData[2].dID}`)
            .set({
                'Authorization': 'Bearer ' + '213213215464',
                'Cookie': `refreshToken=123`
            })
            .expect(401)


    })


})