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

describe(SETTINGS.PATH.POSTS, () => {


    beforeAll(async () => {
        await blogCollection.deleteMany({});
        await postCollection.deleteMany({});
    })

    it("should get empty array", async () => {
         await req.get(SETTINGS.PATH.POSTS)
            .expect(200, {
                pagesCount: 0,
                page: 1,
                pageSize: 10,
                totalCount: 0,
                items: []
            })

    })

    let newBlog:any = null;
    let Post1:any = null;
    let Post2:any = null;
    it("should not get an empty array", async () => {
        // create blog
        const newId = new ObjectId();
        newBlog = {
            _id: newId,
            name: "Travel Blog",
            description: "Blog about traveling",
            websiteUrl: "https://www.travel-blog.com/",
            createdAt: new Date().toISOString(),
            isMembership: false
        }

        await blogCollection.insertOne(newBlog);

        //create posts
         Post1 = {
            _id: new ObjectId(),
            title: "Some title1",
            shortDescription: "Some description1",
            content: "Some content1",
            createdAt: new Date().toISOString(),
            blogId: newBlog._id.toString(),
            blogName: newBlog.name
        }

         Post2 = {
            _id: new ObjectId(),
            title: "Some title2",
            shortDescription: "Some description2",
            content: "Some content2",
            createdAt: new Date().toISOString(),
            blogId: newBlog._id.toString(),
            blogName: newBlog.name
        }

        await postCollection.insertMany([Post1, Post2])

        await req
            .get(SETTINGS.PATH.POSTS)
            .expect(200, {
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: await postCollection.countDocuments(),
                items: [
                    {
                        id: Post1._id.toString(),
                        title: Post1.title,
                        shortDescription: Post1.shortDescription,
                        content: Post1.content,
                        blogId: Post1.blogId,
                        blogName: Post1.blogName,
                        createdAt: Post1.createdAt
                    },
                    {
                        id: Post2._id.toString(),
                        title: Post2.title,
                        shortDescription: Post2.shortDescription,
                        content: Post2.content,
                        blogId: Post2.blogId,
                        blogName: Post2.blogName,
                        createdAt: Post2.createdAt
                    }
                ]
            })


    })

    //create new post


    let newPost: any = null;
    it("should create an element with correct input data", async () => {





        const postData = {
            title: "New Post",
            shortDescription: "Some description",
            content: "Some content",
            blogId: newBlog._id.toString()
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
            .expect(200, {
                ...newPost
            })

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
            blogId: newBlog._id.toString()
        }

        await req
            .put(`${SETTINGS.PATH.POSTS}/${newPost.id}`)
            .set({'Authorization': 'Basic ' + encodeAuth()})
            .send(UpdateData)
            .expect(204)



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
            .delete(`${SETTINGS.PATH.POSTS}/${Post1._id.toString()}`)
            .set({'Authorization': 'Basic ' + encodeAuth()})
            .expect(204)

        await req
            .delete(`${SETTINGS.PATH.POSTS}/${Post2._id.toString()}`)
            .set({'Authorization': 'Basic ' + encodeAuth()})
            .expect(204)


        await req
            .get(SETTINGS.PATH.POSTS)
            .expect(200, {
                pagesCount: 0,
                page: 1,
                pageSize: 10,
                totalCount: 0,
                items: []
            })
    })

})

