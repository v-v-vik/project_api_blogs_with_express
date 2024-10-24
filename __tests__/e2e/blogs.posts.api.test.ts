import {SETTINGS} from "../../src/settings";
import {app} from "../../src/app";
import {agent} from "supertest";
import {blogCollection, postCollection} from "../../src/repositories/db";
import {ObjectId} from "mongodb";

const req = agent(app);

function encodeAuth(){
    const buff = Buffer.from(SETTINGS.ADMIN, 'utf8');
    return buff.toString('base64');

}


describe(SETTINGS.PATH.BLOGS, () => {



    beforeAll(async () => {
        await blogCollection.deleteMany({})
    })

    it("should get empty array", async () => {
        const res = await req.get(SETTINGS.PATH.BLOGS)
            .expect(200, [])

        console.log(res.status);
        console.log(res.body);

        expect(res.body.length).toBe(0)
    })


    // create request



    let newBlog: any = null;
    let newBlog2: any = null;
    let newBlog3: any = null;
    it("should not get an empty array", async () => {
        const newId = new ObjectId();
        const newId2 = new ObjectId();
        newBlog2 = {
            _id: newId,
            id: "1",
            name: "Travel Blog",
            description: "Blog about traveling",
            websiteUrl: "https://www.travel-blog.com/",
            createdAt: new Date().toISOString(),
            isMembership: false
        }
        newBlog3 = {
            _id: newId2,
            id: "2",
            name: "Cooking Blog",
            description: "Blog about food",
            websiteUrl: "https://www.cook-blog.com/",
            createdAt: new Date().toISOString(),
            isMembership: false
        }

        await blogCollection.insertMany([newBlog2, newBlog3]);

        const res = await req
            .get(SETTINGS.PATH.BLOGS)
            .expect(200)

        expect(res.body.length).toBeGreaterThan(0)
    })

    it("should create a new element", async () => {
        const newId = new ObjectId();
        const newData = {
            _id: newId,
            id: "1",
            name: "Beauty Blog",
            description: "Blog about make-up",
            websiteUrl: "https://www.beauty-blog.com/",
            createdAt: new Date().toISOString(),
            isMembership: false
        }

        const res = await req
            .post(SETTINGS.PATH.BLOGS)
            .set({'Authorization': 'Basic ' + encodeAuth()})
            .send(newData)


        newBlog = res.body;
        expect(newBlog).toEqual({
            id: expect.any(String),
            name: newData.name,
            description: newData.description,
            websiteUrl: newData.websiteUrl,
            createdAt: expect.any(String),
            isMembership: false

        })
    })

    it("should not create a new element in the array with incorrect data", async () => {
        const newId = new ObjectId();
        const newData = {
            _id: newId,
            id: "1",
            name: 123,
            description: "Blog about something",
            websiteUrl: "https://www.some-blog.com/",
            createdAt: new Date().toISOString(),
            isMembership: false
        }


        await req
            .post(SETTINGS.PATH.BLOGS)
            .set({'Authorization': 'Basic ' + encodeAuth()})
            .send(newData)
            .expect(400)


    })

    // get by id request

    it("should get an existing element via id parameter", async () => {

        await req
            .get(`${SETTINGS.PATH.BLOGS}/${newBlog.id}`)
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
            name: "Updated Blog",
            description: "Blog about something",
            websiteUrl: "https://www.updated-blog.com/"
        }

        await req
            .put(`${SETTINGS.PATH.BLOGS}/${newBlog.id}`)
            .set({'Authorization': 'Basic ' + encodeAuth()})
            .send(UpdateData)
            .expect(204)

        await req
            .get(`${SETTINGS.PATH.BLOGS}/${newBlog.id}`)
            .expect(200, {
                ...newBlog,
                name: UpdateData.name,
                description: UpdateData.description,
                websiteUrl: UpdateData.websiteUrl
            })


    })


    it("should not update existing element in the array with incorrect id provided", async () => {

        const updateData2 = {
            name: "Beauty Blog",
            description: "Blog about make-up",
            websiteUrl: "https://www.beauty-blog.com/"
        }

        await req
            .put(`${SETTINGS.PATH.BLOGS}/-1`)
            .set({'Authorization': 'Basic ' + encodeAuth()})
            .send(updateData2)
            .expect(404)

    })

    it("should delete element with given id", async () => {

        await req
            .delete(`${SETTINGS.PATH.BLOGS}/${newBlog.id}`)
            .set({'Authorization': 'Basic ' + encodeAuth()})
            .expect(204)


        await req
            .get(`${SETTINGS.PATH.BLOGS}/${newBlog.id}`)
            .expect(404)
    })



})

describe(SETTINGS.PATH.BLOGS, () => {


    beforeAll(async () => {
        await postCollection.deleteMany({})
    })

    it("should get empty array", async () => {
        const res = await req.get(SETTINGS.PATH.POSTS)
            .expect(200, [])

        expect(res.body.length).toBe(0)
    })

    //create new post

    let newBlog:any = null;
    let newPost: any = null;
    it("should create an element with correct input data", async () => {

        // create blog

        const BlogData = {
            name: "Travel Blog",
            description: "Blog about traveling",
            websiteUrl: "https://www.travel-blog.com/"
        }

        const createRes = await req
            .post(SETTINGS.PATH.BLOGS)
            .set({'Authorization': 'Basic ' + encodeAuth()})
            .send(BlogData)
            .expect(201)


        newBlog = createRes.body;


        const postData = {
            title: "New Post",
            shortDescription: "Some description",
            content: "Some content",
            blogId: newBlog.id
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
            createdAt: expect.any(String),
            blogId: postData.blogId,
            blogName: newBlog.name

        })
    })



    it("should not create an element with incorrect input data", async () => {

        const postData = {
            title: "New Post",
            shortDescription: "Some description",
            content: "Some content",
            blogId: "-1"
        }

        await req
            .post(SETTINGS.PATH.POSTS)
            .set({'Authorization': 'Basic ' + encodeAuth()})
            .send(postData)
            .expect(400)


    })

    // get by id request

    it("should get an existing element via id parameter", async () => {

        await req
            .get(`${SETTINGS.PATH.POSTS}/${newPost.id}`)
            .expect(200)

    })

    it("should not get an element of array with wrong id parameter", async () => {

        await req
            .get(SETTINGS.PATH.POSTS + "/-1")
            .expect(404)

    })

    it("should not get an element of array with wrong id parameter", async () => {

        await req
            .get(SETTINGS.PATH.POSTS + "/-1")
            .expect(404)

    })

    // update


    it("should update existing element in the array", async () => {

        const UpdateData = {
            title: "Updated Post",
            shortDescription: "Updated description",
            content: "Some content",
            blogId: newBlog.id
        }

        await req
            .put(`${SETTINGS.PATH.POSTS}/${newPost.id}`)
            .set({'Authorization': 'Basic ' + encodeAuth()})
            .send(UpdateData)
            .expect(204)

        console.log(newPost)


        await req
            .get(`${SETTINGS.PATH.POSTS}/${newPost.id}`)
            .expect(200, {
                ...newPost,
                title: UpdateData.title,
                shortDescription: UpdateData.shortDescription,
                content: UpdateData.content,
                blogId: UpdateData.blogId,
                blogName: newBlog.name
            })


    })

    it("should not update existing element in the array with incorrect input data", async () => {

        const UpdateData = {
            title: "Updated Post",
            shortDescription: "  ",
            content: "Some content",
            blogId: newBlog.id
        }

        await req
            .put(`${SETTINGS.PATH.POSTS}/${newPost.id}`)
            .set({'Authorization': 'Basic ' + encodeAuth()})
            .send(UpdateData)
            .expect(400)

    })

    //delete

    it("should delete element with given id", async () => {

        await req
            .delete(`${SETTINGS.PATH.POSTS}/${newPost.id}`)
            .set({'Authorization': 'Basic ' + encodeAuth()})
            .expect(204)


        await req
            .get(SETTINGS.PATH.POSTS)
            .expect(200, [])
    })











})


// describe(SETTINGS.PATH.POSTS, () => {
//
//     beforeAll(async () => {
//         await req.delete("/testing/all-data")
//     })
//
//     it("should get empty array", async () => {
//         await req.get(SETTINGS.PATH.POSTS)
//             .expect(200, [])
//     })
//
//     //create new post
//
//     let newBlog:any = null;
//     let newPost: any = null;
//     it("should create an element with correct input data", async () => {
//
//         // create blog
//
//         const BlogData = {
//             name: "Travel Blog",
//             description: "Blog about traveling",
//             websiteUrl: "https://www.travel-blog.com/"
//         }
//
//         const createRes = await req
//             .post(SETTINGS.PATH.BLOGS)
//             .set({'Authorization': 'Basic ' + encodeAuth()})
//             .send(BlogData)
//             .expect(201)
//
//
//         newBlog = createRes.body;
//
//
//         const postData = {
//             title: "New Post",
//             shortDescription: "Some description",
//             content: "Some content",
//             blogId: newBlog.id
//         }
//
//         const res = await req
//             .post(SETTINGS.PATH.POSTS)
//             .set({'Authorization': 'Basic ' + encodeAuth()})
//             .send(postData)
//             .expect(201)
//
//         newPost = res.body;
//         expect(newPost).toEqual({
//             id: expect.any(String),
//             title: postData.title,
//             shortDescription: postData.shortDescription,
//             content: postData.content,
//             blogId: postData.blogId,
//             blogName: newBlog.name
//
//         })
//
//     })
//
//     it("should not create an element with incorrect input data", async () => {
//
//         const postData = {
//             title: "New Post",
//             shortDescription: "Some description",
//             content: "Some content",
//             blogId: "-1"
//         }
//
//         await req
//             .post(SETTINGS.PATH.POSTS)
//             .set({'Authorization': 'Basic ' + encodeAuth()})
//             .send(postData)
//             .expect(400)
//
//
//     })
//
//     // get by id request
//
//     it("should get an existing element via id parameter", async () => {
//
//         await req
//             .get(`${SETTINGS.PATH.POSTS}/${newPost.id}`)
//             .expect(200)
//
//     })
//
//     it("should not get an element of array with wrong id parameter", async () => {
//
//         await req
//             .get(SETTINGS.PATH.POSTS + "/-1")
//             .expect(404)
//
//     })
//
//     // update
//
//
//     it("should update existing element in the array", async () => {
//
//         const UpdateData = {
//             title: "Updated Post",
//             shortDescription: "Updated description",
//             content: "Some content",
//             blogId: newBlog.id
//         }
//
//         await req
//             .put(`${SETTINGS.PATH.POSTS}/${newPost.id}`)
//             .set({'Authorization': 'Basic ' + encodeAuth()})
//             .send(UpdateData)
//             .expect(204)
//
//         console.log(newPost)
//
//
//         await req
//             .get(`${SETTINGS.PATH.POSTS}/${newPost.id}`)
//             .expect(200, {
//                 ...newPost,
//                 title: UpdateData.title,
//                 shortDescription: UpdateData.shortDescription,
//                 content: UpdateData.content,
//                 blogId: UpdateData.blogId,
//                 blogName: newBlog.name
//             })
//
//
//     })
//
//     it("should not update existing element in the array with incorrect input data", async () => {
//
//         const UpdateData = {
//             title: "Updated Post",
//             shortDescription: "  ",
//             content: "Some content",
//             blogId: newBlog.id
//         }
//
//         await req
//             .put(`${SETTINGS.PATH.POSTS}/${newPost.id}`)
//             .set({'Authorization': 'Basic ' + encodeAuth()})
//             .send(UpdateData)
//             .expect(400)
//
//     })
//
//     //delete
//
//     it("should delete element with given id", async () => {
//
//         await req
//             .delete(`${SETTINGS.PATH.POSTS}/${newPost.id}`)
//             .set({'Authorization': 'Basic ' + encodeAuth()})
//             .expect(204)
//
//         console.log(db_mockup.posts)
//
//         await req
//             .get(SETTINGS.PATH.POSTS)
//             .expect(200, [])
//     })
//
//
//
// })