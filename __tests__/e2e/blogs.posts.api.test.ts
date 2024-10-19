import {SETTINGS} from "../../src/settings";
import {app} from "../../src/app";
import {agent} from "supertest";

const req = agent(app);

function encodeAuth(){
    const buff = Buffer.from(SETTINGS.ADMIN, 'utf8');
    return buff.toString('base64');

}

describe(SETTINGS.PATH.BLOGS, () => {

    beforeAll(async()=> {
        await req.delete("/testing/all-data")
    })

    it("should get empty array", async() =>{
        await req.get(SETTINGS.PATH.BLOGS)
            .expect(200, [])
    })

    // create request

    let newBlog1:any = null;
    it("should create a new element in the array", async() => {

        const newData = {
            name: "Travel Blog",
            description: "Blog about traveling",
            websiteUrl: "https://www.travel-blog.com/"
        }

        const res = await req
            .post(SETTINGS.PATH.BLOGS)
            .set({'Authorization': 'Basic ' + encodeAuth()})
            .send(newData)
            .expect(201)


        newBlog1 = res.body;
        expect(newBlog1).toEqual({
            id: expect.any(String),
            name: newData.name,
            description: newData.description,
            websiteUrl: newData.websiteUrl

        })

    })

    it("should not create a new element in the array with incorrect data", async() => {

        const newData = {
            name: 123,
            description: "Blog about traveling",
            websiteUrl: "https://www.travel-blog.com/"
        }

        await req
            .post(SETTINGS.PATH.BLOGS)
            .set({'Authorization': 'Basic ' + encodeAuth()})
            .send(newData)
            .expect(400)


        })

    // get by id request

    it("should get an existing element via id parameter", async() => {

        await req
            .get(`${SETTINGS.PATH.BLOGS}/${newBlog1.id}`)
            .expect(200)

    })

    it("should not get an element of array with wrong id parameter", async() => {

        await req
            .get(SETTINGS.PATH.BLOGS + "/-1")
            .expect(404)

    })







})