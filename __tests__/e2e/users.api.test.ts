import {SETTINGS} from "../../src/settings";
import {blogCollection, postCollection, userCollection} from "../../src/repositories/db";
import {agent} from "supertest";
import {app} from "../../src/app";

const req = agent(app);

function encodeAuth() {
    const buff = Buffer.from(SETTINGS.ADMIN, 'utf8');
    return buff.toString('base64');

}

describe(SETTINGS.PATH.USERS, () => {

    beforeAll(async () => {
        await blogCollection.deleteMany({});
        await postCollection.deleteMany({});
        await userCollection.deleteMany({});
    })


    it ("it should return an empty array items", async () => {
        await req
            .get(SETTINGS.PATH.USERS)
            .set({'Authorization': 'Basic ' + encodeAuth()})
            .expect(200, {
                pagesCount: 0,
                page: 1,
                pageSize: 10,
                totalCount: 0,
                items: []
            })

    })


    let newUser:any = null;
    it ("should create a user", async () => {
        const newData = {
            login: "login1",
            password: "1234567",
            email: "email@gmail.com"
        }

        const res = await req
            .post(SETTINGS.PATH.USERS)
            .set({'Authorization': 'Basic ' + encodeAuth()})
            .send(newData)

        newUser = res.body;

        expect(newUser).toEqual({
            id: expect.any(String),
            login: newData.login,
            email: newData.email,
            createdAt: expect.any(String)
        })

    })

    it("should not create a new user with wrong data format", async () => {
        const newData = {
            login: " ",
            password: 123,
            email: "email@gmail.com"
        }

        await req
            .post(SETTINGS.PATH.USERS)
            .set({'Authorization': 'Basic ' + encodeAuth()})
            .send(newData)
            .expect(400)
    })

    it("should not create a new user with existing email or login", async () => {
        const newData = {
            login: "login1",
            password: "123456",
            email: "email123@gmail.com"
        }

         await req
            .post(SETTINGS.PATH.USERS)
            .set({'Authorization': 'Basic ' + encodeAuth()})
            .send(newData)
            .expect(409)
    })

    it("should return all users", async () => {
        await req
            .get(SETTINGS.PATH.USERS)
            .set({'Authorization': 'Basic ' + encodeAuth()})
            .expect(200, {
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: await userCollection.countDocuments({}),
                items: [
                    {  ...newUser }
                ]
            })
    })

    it("should delete user with existing id", async () => {
        await req
            .delete(`${SETTINGS.PATH.USERS}/${newUser.id}`)
            .set({'Authorization': 'Basic ' + encodeAuth()})
            .expect(204)

    })

    it("should not delete user with non existing id", async () => {
        await req
            .delete(`${SETTINGS.PATH.USERS}/1`)
            .set({'Authorization': 'Basic ' + encodeAuth()})
            .expect(404)
    })



})