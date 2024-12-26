import {SETTINGS} from "../../src/settings";
import {agent} from "supertest";
import {app} from "../../src/app";
import {ObjectId} from "mongodb";
import {jwtService} from "../../src/adapters/jwtService";
import {PayloadRT} from "../../src/input-output-types/auth types";
import {runDB} from "../../src/repositories/db";
import {usersTestManager, UserTokens} from "../helpers/users manager";
import mongoose from "mongoose";

const req = agent(app);


describe(SETTINGS.PATH.SECURITY, () => {

    let userId: ObjectId;
    let userLogin: string;


    let tokenData: UserTokens;
    let tokenData2: UserTokens;
    let tokenData3: UserTokens;


    beforeAll(async () => {
        await runDB();
        await req.delete("/testing/all-data")
            .expect(204)
    })

    afterAll(async () => {
        await mongoose.connection.close()
    })

    it ("it should return active sessions", async () => {
        //create new user
        const userData = usersTestManager.createData({});
        const newUser = await usersTestManager.create(userData);

        userId = newUser._id;
        userLogin = newUser.accountData.login;

        //login user 4 times

        tokenData = await usersTestManager.login(userData.login, userData.password, 'Device1');
        tokenData2 = await usersTestManager.login(userData.login, userData.password, 'Device2');
        setTimeout(()=> new Promise(resolve => resolve), 5000);
        tokenData3 = await usersTestManager.login(userData.login, userData.password, 'Device3');
        const {accessToken: accessToken2, refreshToken: refreshToken2} = await usersTestManager.login(userData.login, userData.password, 'Device4');


        const res = await req
            .get(SETTINGS.PATH.SECURITY)
            .set({
                'Authorization': 'Bearer ' + accessToken2,
                'Cookie': `refreshToken=${refreshToken2}`
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


        const payload = jwtService.verifyRefreshToken(tokenData.refreshToken) as PayloadRT;

        await req
            .delete(`${SETTINGS.PATH.SECURITY}/${payload.deviceId}`)
            .set({
                'Authorization': 'Bearer ' + '213213215464',
                'Cookie': `refreshToken=123`
            })
            .expect(401)
    })

    it ("it should return 404 when trying to terminate non-existing session", async () => {

        await req
            .delete(`${SETTINGS.PATH.SECURITY}/5464654654`)
            .set({
                'Authorization': 'Bearer ' + tokenData2.accessToken,
                'Cookie': `refreshToken=${tokenData2.refreshToken}`
            })
            .expect(404)
    })

    it ("it should return 403 when trying to terminate session of other user", async () => {

        const userData2 = usersTestManager.createData({email:'diff@gmail.com', login:'diffLogin', password:'diffPassword'});
        await usersTestManager.create(userData2);
        const otherUserTokens: UserTokens = await usersTestManager.login(userData2.login, userData2.password, 'OtherDevice');
        const payload = jwtService.verifyRefreshToken(otherUserTokens.refreshToken) as PayloadRT;

        await req
            .delete(`${SETTINGS.PATH.SECURITY}/${payload.deviceId}`)
            .set({
                'Authorization': 'Bearer ' + tokenData2.accessToken,
                'Cookie': `refreshToken=${tokenData2.refreshToken}`
            })
            .expect(403)
    })

    it("when refresh token for existed deviceId only LastActiveDate should change, amount of sessions stays the same", async () => {

        const payload = jwtService.verifyRefreshToken(tokenData.refreshToken) as PayloadRT;

        await req
            .post(`${SETTINGS.PATH.AUTH}/refresh-token`)
            .set({
                'Authorization': 'Bearer ' + tokenData.accessToken,
                'Cookie': `refreshToken=${tokenData.refreshToken}`
            })
            .expect(200)

        const res = await req
            .get(SETTINGS.PATH.SECURITY)
            .set({
                'Authorization': 'Bearer ' + tokenData.accessToken,
                'Cookie': `refreshToken=${tokenData.refreshToken}`
            })
            .expect(200)

        const sessions = res.body;
        console.log("sessions:", sessions)
        expect(sessions).toHaveLength(4);
        expect(sessions[1].lastActiveDate).not.toEqual(payload.iat)


    })

    it("it should terminate session on Device2", async () => {

        const payload = jwtService.verifyRefreshToken(tokenData2.refreshToken) as PayloadRT;

        await req
            .delete(`${SETTINGS.PATH.SECURITY}/${payload.deviceId}`)
            .set({
                'Authorization': 'Bearer ' + tokenData.accessToken,
                'Cookie': `refreshToken=${tokenData.refreshToken}`
            })
            .expect(204)

        const res = await req
            .get(SETTINGS.PATH.SECURITY)
            .set({
                'Authorization': 'Bearer ' + tokenData.accessToken,
                'Cookie': `refreshToken=${tokenData.refreshToken}`
            })
            .expect(200)

        const sessions = res.body;
        expect(sessions).toHaveLength(3);
    })

    it("it should logout Device3", async () => {

        await req
            .post(`${SETTINGS.PATH.AUTH}/logout`)
            .set({
                'Authorization': 'Bearer ' + tokenData3.accessToken,
                'Cookie': `refreshToken=${tokenData3.refreshToken}`
            })
            .expect(204)

        const res = await req
            .get(SETTINGS.PATH.SECURITY)
            .set({
                'Authorization': 'Bearer ' + tokenData.accessToken,
                'Cookie': `refreshToken=${tokenData.refreshToken}`
            })
            .expect(200)

        const sessions = res.body;
        expect(sessions).toHaveLength(2);

    })

    it("it should terminate all sessions except for the active one", async () => {
        await req
            .delete(SETTINGS.PATH.SECURITY)
            .set({
                'Authorization': 'Bearer ' + tokenData.accessToken,
                'Cookie': `refreshToken=${tokenData.refreshToken}`
            })
            .expect(204)

        const res = await req
            .get(SETTINGS.PATH.SECURITY)
            .set({
                'Authorization': 'Bearer ' + tokenData.accessToken,
                'Cookie': `refreshToken=${tokenData.refreshToken}`
            })
            .expect(200)

        const sessions = res.body;
        expect(sessions).toHaveLength(1);

    })

})