import {SETTINGS} from "../../src/settings";
import {blogCollection, commentCollection, postCollection, userCollection} from "../../src/repositories/db";
import {agent} from "supertest";
import {app} from "../../src/app";
import {ObjectId} from "mongodb";
import {bcryptService} from "../../src/adapters/bcrypt.service";
import {CommentViewModel} from "../../src/input-output-types/comment types";

const req = agent(app);


describe(SETTINGS.PATH.COMMENTS, () => {

    let blogId = null;
    let postId: ObjectId;
    let userId: ObjectId;
    let userLogin: string;

    beforeAll(async () => {
        await blogCollection.deleteMany({});
        await postCollection.deleteMany({});
        await userCollection.deleteMany({});
        await commentCollection.deleteMany({});


        blogId = new ObjectId();
        await blogCollection.insertOne({
            _id: blogId,
            name: "Travel Blog",
            description: "Blog about traveling",
            websiteUrl: "https://www.travel-blog.com/",
            createdAt: new Date().toISOString(),
            isMembership: false
        });

        postId = new ObjectId();
        await postCollection.insertOne({
            _id: postId,
            title: "Some title1",
            shortDescription: "Some description1",
            content: "Some content1",
            createdAt: new Date().toISOString(),
            blogId: blogId.toString(),
            blogName: "Travel Blog"
        });

        userId = new ObjectId();
        userLogin = "myLogin123";
        const hashedPass = await bcryptService.passwordHash("password12345");
        await userCollection.insertOne({
            _id: userId,
            login: userLogin,
            email: "email123@gmail.com",
            password: hashedPass,
            createdAt: new Date().toISOString()
        });

    });

    let token: string;
    let newComment: CommentViewModel;
    it('should create a new comment', async () => {
        //get token

        let res = await req
            .post(`${SETTINGS.PATH.AUTH}/login`)
            .send({
                loginOrEmail: "myLogin123",
                password: "password12345"
            })

        token = res.body.accessToken;


        const postIdParams = postId.toString()

        const newCommentData = {
            content: "Chuck Norris does not get frostbite. Chuck Norris bites frost" +
                "The flu gets a Chuck Norris shot every year. Freddy Krueger has nightmares about Chuck Norris."
        }

         res = await req
            .post(`${SETTINGS.PATH.POSTS}/${postIdParams}/comments`)
            .set({'Authorization': 'Bearer ' + token})
            .send(newCommentData)
            .expect(201)

        newComment = res.body;

        expect(newComment).toEqual({
           id: expect.any(String),
           content: newCommentData.content,
           commentatorInfo: {
               userId: userId.toString(),
               userLogin: userLogin,
           },
           createdAt: expect.any(String),
        })
    })

    it('should return comments for specified post', async () => {
        await req
            .get(`${SETTINGS.PATH.POSTS}/${postId}/comments`)
            .expect(200, {
                pagesCount: 0,
                page: 1,
                pageSize: 10,
                totalCount: 0,
                items: [{ ...newComment }]
            })
    })


})