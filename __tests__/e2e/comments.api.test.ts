import {SETTINGS} from "../../src/settings";
import {agent} from "supertest";
import {app} from "../../src/app";
import {ObjectId} from "mongodb";
import {bcryptService} from "../../src/adapters/bcrypt.service";
import {randomUUID} from "node:crypto";
import {runDB} from "../../src/repositories/db";
import {BlogModel} from "../../src/domain/blog entity";
import {PostModel} from "../../src/domain/post entity";
import {UserModel} from "../../src/domain/user entity";
import {CommentViewModel} from "../../src/domain/comment entity";

const req = agent(app);


describe(SETTINGS.PATH.COMMENTS, () => {

    let blogId = null;
    let postId: ObjectId;
    let userId: ObjectId;
    let userLogin: string;

    beforeAll(async () => {
        await runDB();
        await req.delete("/testing/all-data")
            .expect(204)

        blogId = new ObjectId();
        await BlogModel.create({
            _id: blogId,
            name: "Travel Blog",
            description: "Blog about traveling",
            websiteUrl: "https://www.travel-blog.com/",
            createdAt: new Date().toISOString(),
            isMembership: false
        });

        postId = new ObjectId();
        await PostModel.create({
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
        await UserModel.create({
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

        token = res.body;



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
           likesInfo: {
               likesCount: 0,
               dislikesCount: 0,
               myStatus: 'None'
           }
        })
    })

    it('should not create a comment with wrong data format', async () => {
        await req
            .post(`${SETTINGS.PATH.POSTS}/${postId}/comments`)
            .set({'Authorization': 'Bearer ' + token})
            .send({
                content: "C"
            })
            .expect(400)
    })

    it('should not create a comment for non-existing post', async () => {
        await req
            .post(`${SETTINGS.PATH.POSTS}/-123/comments`)
            .set({'Authorization': 'Bearer ' + token})
            .send({
                content: "Chuck Norris does not get frostbite. Chuck Norris bites frost"
            })
            .expect(404)
    })

    it('should not create a comment with wrong token', async () => {
        await req
            .post(`${SETTINGS.PATH.POSTS}/${postId}/comments`)
            .set({'Authorization': 'Bearer ' + '12321454'})
            .send({
                content: "Chuck Norris does not get frostbite. Chuck Norris bites frost"
            })
            .expect(401)
    })




    it('should return comments for specified post', async () => {
        await req
            .get(`${SETTINGS.PATH.POSTS}/${postId}/comments`)
            .expect(200, {
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 1,
                items: [{ ...newComment }]
            })
    })

    it('should not return error when searching non existing post comments', async () => {
        await req
            .get(`${SETTINGS.PATH.POSTS}/00000001232132/comments`)
            .expect(404)
    } )

    it('should update existing comment', async () => {
        const newContent = {
            content: "This is a new updated content.This is a new updated content."
        }

        await req
            .put(`${SETTINGS.PATH.COMMENTS}/${newComment.id}`)
            .set({'Authorization': 'Bearer ' + token})
            .send(newContent)
            .expect(204)


        const res = await req
            .get(`${SETTINGS.PATH.COMMENTS}/${newComment.id}`)
            .expect(200)

        const updatedComment = res.body;

        expect(updatedComment).toEqual({
            id: expect.any(String),
            content: newContent.content,
            commentatorInfo: {
                userId: userId.toString(),
                userLogin: userLogin,
            },
            createdAt: expect.any(String)
        })
    })

    it('should not update existing comment with the wrong data format', async () => {
          await req
            .put(`${SETTINGS.PATH.COMMENTS}/${newComment.id}`)
            .set({'Authorization': 'Bearer ' + token})
            .send({
                content: "."
            })
            expect(400)

    })

    it('should not update existing comment with the wrong token', async () => {
        await req
            .put(`${SETTINGS.PATH.COMMENTS}/${newComment.id}`)
            .set({'Authorization': 'Bearer ' + '1213213544'})
            .send({
                content: "This is a new updated content.This is a new updated content."
            })
            .expect(401)

    })

    it('should not delete comment with wrong Id', async () => {
        await req
            .delete(`${SETTINGS.PATH.COMMENTS}/-1231335465}`)
            .set({'Authorization': 'Bearer ' + token})
            .expect(404)
    })






})