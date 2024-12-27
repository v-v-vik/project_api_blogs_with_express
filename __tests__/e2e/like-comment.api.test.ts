import {agent} from "supertest";
import {app} from "../../src/app";
import {runDB} from "../../src/repositories/db";
import mongoose from "mongoose";
import {UserDto, usersTestManager, UserTokens} from "../helpers/users manager";
import {blogsTestManager, postsTestManager} from "../helpers/blogs posts creator";
import {UserDBType} from "../../src/domain/user entity";
import {BlogDBType} from "../../src/domain/blog entity";
import {PostDBType, PostInputModel} from "../../src/domain/post entity";
import {commentsTestManager} from "../helpers/comments creator";
import {CommentDBType} from "../../src/domain/comment entity";
import {SETTINGS} from "../../src/settings";
import {LikeStatus} from "../../src/domain/like entity";

const req = agent(app);

describe('Liking comments', ()=> {

    beforeAll(async () => {
        await runDB();
        await req.delete("/testing/all-data")
            .expect(204)
    })

    afterAll(async () => {
        await mongoose.connection.close()
    })

    let userData: UserDto;
    let newUser: UserDBType;
    let newBlog: BlogDBType[];
    let postData: PostInputModel;
    let newPost: PostDBType[];
    let newComment: CommentDBType[];
    let tokens: UserTokens;

    it("should leave reaction to comment and it should display like on the comment with myStatus as None as non-logged in user", async () => {
        userData = usersTestManager.createData({});
        newUser = await usersTestManager.create(userData);
        newBlog = await blogsTestManager.createBlog(blogsTestManager.createData({}));
        postData = postsTestManager.createData({blogId: newBlog[0]._id.toString()});
        newPost = await postsTestManager.createPost(newBlog[0]._id.toString(), newBlog[0].name, postData);
        newComment = await commentsTestManager.createComment(newUser._id.toString(), newUser.accountData.login, newPost[0]._id.toString());

        tokens = await usersTestManager.login(userData.login, userData.password, 'Device1');

        //liking logic

        await req
            .put(`${SETTINGS.PATH.COMMENTS}/${newComment[0]._id.toString()}/like-status`)
            .set({
                'Authorization': 'Bearer ' + tokens.accessToken,
                'Cookie': `refreshToken=${tokens.refreshToken}`
                 })
            .send({
                likeStatus: LikeStatus.Like
            })
            .expect(204)

        const res = await req
            .get(`${SETTINGS.PATH.COMMENTS}/${newComment[0]._id.toString()}`)
            .expect(200)

        const comment = res.body;

        expect(comment.likesInfo.likesCount).toEqual(1)
        expect(comment.likesInfo.myStatus).toEqual(LikeStatus.None)

    })

    it("should change myStatus of the comment to Like when display comment as authorized user who liked it", async () => {

        const res = await req
            .get(`${SETTINGS.PATH.COMMENTS}/${newComment[0]._id.toString()}`)
            .set({
                'Authorization': 'Bearer ' + tokens.accessToken,
                'Cookie': `refreshToken=${tokens.refreshToken}`
            })

        const comment = res.body;

        expect(comment.likesInfo.myStatus).toEqual(LikeStatus.Like)

    })

    it("should remove like and add dislike from the same user who liked it before", async () => {

        await req
            .put(`${SETTINGS.PATH.COMMENTS}/${newComment[0]._id.toString()}/like-status`)
            .set({
                'Authorization': 'Bearer ' + tokens.accessToken,
                'Cookie': `refreshToken=${tokens.refreshToken}`
            })
            .send({
                likeStatus: LikeStatus.Dislike
            })
            .expect(204)

        const res = await req
            .get(`${SETTINGS.PATH.COMMENTS}/${newComment[0]._id.toString()}`)
            .expect(200)

        const comment = res.body;

        expect(comment.likesInfo.likesCount).toEqual(0)
        expect(comment.likesInfo.dislikesCount).toEqual(1)

    })

    it("should remove reaction when sending None to the comment which was disliked before", async () => {

        await req
            .put(`${SETTINGS.PATH.COMMENTS}/${newComment[0]._id.toString()}/like-status`)
            .set({
                'Authorization': 'Bearer ' + tokens.accessToken,
                'Cookie': `refreshToken=${tokens.refreshToken}`
            })
            .send({
                likeStatus: LikeStatus.None
            })
            .expect(204)

        const res = await req
            .get(`${SETTINGS.PATH.COMMENTS}/${newComment[0]._id.toString()}`)
            .expect(200)

        const comment = res.body;

        expect(comment.likesInfo.likesCount).toEqual(0)
        expect(comment.likesInfo.dislikesCount).toEqual(0)

    })

    it("should return 400 when sending wrong data as reaction", async () => {

        await req
            .put(`${SETTINGS.PATH.COMMENTS}/${newComment[0]._id.toString()}/like-status`)
            .set({
                'Authorization': 'Bearer ' + tokens.accessToken,
                'Cookie': `refreshToken=${tokens.refreshToken}`
            })
            .send({
                likeStatus: 'I like it'
            })
            .expect(400)

    })

    it("should return 401 when trying to send reaction when unauthorized", async () => {

        await req
            .put(`${SETTINGS.PATH.COMMENTS}/${newComment[0]._id.toString()}/like-status`)
            .set({
                'Authorization': 'Bearer ' + '85875743687456',
                'Cookie': `refreshToken=85875743687456`
            })
            .send({
                likeStatus: LikeStatus.Like
            })
            .expect(401)

    })

    it("should return 404 when trying to send reaction to the non existing comment id", async () => {

        await req
            .put(`${SETTINGS.PATH.COMMENTS}/987593874587/like-status`)
            .set({
                'Authorization': 'Bearer ' + tokens.accessToken,
                'Cookie': `refreshToken=${tokens.refreshToken}`
            })
            .send({
                likeStatus: LikeStatus.Like
            })
            .expect(404)

    })

})