import {SETTINGS} from "../../src/settings";
import {app} from "../../src/app";
import {agent} from "supertest";
import {db} from "../../src/repositories/db";

const req = agent(app);

function encodeAuth(){
    const buff = Buffer.from(SETTINGS.ADMIN, 'utf8');
    return buff.toString('base64');

}

describe(SETTINGS.PATH.BLOGS, () => {

    beforeAll(async () => {
        await req.delete("/testing/all-data")
    })

    it("should get empty array", async () => {
        await req.get(SETTINGS.PATH.BLOGS)
            .expect(200, [])
    })

    // create request

    let CreateData: any = null;
    let CreateData2: any = null;
    let newBlog1: any = null;
    let newBlog2: any = null;
    it("should create a new element in the array", async () => {

        CreateData = {
            name: "Travel Blog",
            description: "Blog about traveling",
            websiteUrl: "https://www.travel-blog.com/"
        }

        CreateData2 = {
            name: "Photo Blog",
            description: "Blog about photography",
            websiteUrl: "https://www.photo-blog.com/"
        }

        const createRes = await req
            .post(SETTINGS.PATH.BLOGS)
            .set({'Authorization': 'Basic ' + encodeAuth()})
            .send(CreateData)
            .expect(201)


        newBlog1 = createRes.body;
        expect(newBlog1).toEqual({
            id: expect.any(String),
            name: CreateData.name,
            description: CreateData.description,
            websiteUrl: CreateData.websiteUrl

        })

        const createRes2 = await req
            .post(SETTINGS.PATH.BLOGS)
            .set({'Authorization': 'Basic ' + encodeAuth()})
            .send(CreateData2)
            .expect(201);

        newBlog2 = createRes2.body;

        expect(newBlog2).toEqual({
            id: expect.any(String),
            name: CreateData2.name,
            description: CreateData2.description,
            websiteUrl: CreateData2.websiteUrl


        })
    })







    it("should not create a new element in the array with incorrect data", async () => {

        const newCreateData = {
            name: 123,
            description: "Blog about traveling",
            websiteUrl: "https://www.travel-blog.com/"
        }

        await req
            .post(SETTINGS.PATH.BLOGS)
            .set({'Authorization': 'Basic ' + encodeAuth()})
            .send(newCreateData)
            .expect(400)


    })

    // get by id request

    it("should get an existing element via id parameter", async () => {

        await req
            .get(`${SETTINGS.PATH.BLOGS}/${newBlog1.id}`)
            .expect(200)

    })

    it("should not get an element of array with wrong id parameter", async () => {

        await req
            .get(SETTINGS.PATH.BLOGS + "/-1")
            .expect(404)

    })

    // update


    it("should update existing element in the array", async () => {

        const UpdateData = {
            name: "Cooking Blog",
            description: "Blog about food",
            websiteUrl: "https://www.cook-blog.com/"
        }

        await req
            .put(`${SETTINGS.PATH.BLOGS}/${newBlog1.id}`)
            .set({'Authorization': 'Basic ' + encodeAuth()})
            .send(UpdateData)
            .expect(204)

        await req
            .get(`${SETTINGS.PATH.BLOGS}/${newBlog1.id}`)
            .expect(200, {
                ...newBlog1,
                name: UpdateData.name,
                description: UpdateData.description,
                websiteUrl: UpdateData.websiteUrl
            })


    })

    let UpdateData2: any = null;

    it("should not update existing element in the array with incorrect id provided", async () => {

        UpdateData2 = {
            name: "Beauty Blog",
            description: "Blog about make-up",
            websiteUrl: "https://www.beauty-blog.com/"
        }

        await req
            .put(`${SETTINGS.PATH.BLOGS}/-1`)
            .set({'Authorization': 'Basic ' + encodeAuth()})
            .send(UpdateData2)
            .expect(404)

        await req
            .get(`${SETTINGS.PATH.BLOGS}/${newBlog1.id}`)
            .expect(200, {
                ...newBlog1,
                name: "Cooking Blog",
                description: "Blog about food",
                websiteUrl: "https://www.cook-blog.com/"
            })


        })

    it("should delete element with given id", async () => {

        await req
            .delete(`${SETTINGS.PATH.BLOGS}/${newBlog1.id}`)
            .set({'Authorization': 'Basic ' + encodeAuth()})
            .expect(204)

        console.log(db.blogs)

        await req
            .get(SETTINGS.PATH.BLOGS)
            .expect(200, [newBlog2])
    })



})

describe(SETTINGS.PATH.POSTS, () => {

    it("should get empty array", async () => {
        await req.get(SETTINGS.PATH.POSTS)
            .expect(200, [])
    })

    let newPost: any = null;
    it("should create an element with correct input data", async () => {
        const postData = {
            title: "New Post",
            shortDescription: "Some description",
            content: "Some content",
            blogId: "2"
        }

        const res = await req
            .post(SETTINGS.PATH.POSTS)
            .set({'Authorization': 'Basic ' + encodeAuth()})
            .send(postData)
            .expect(201)

        newPost = res.body;
        expect(newPost).toEqual({
            id: expect.any(String),
            title: postData.title,
            shortDescription: postData.shortDescription,
            content: postData.content,
            blogId: postData.blogId,
            blogName: "Photo Blog"

        })

    })


})