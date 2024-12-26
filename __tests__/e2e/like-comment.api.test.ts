import {agent} from "supertest";
import {app} from "../../src/app";
import {runDB} from "../../src/repositories/db";
import mongoose from "mongoose";
import {UserDto, usersTestManager} from "../helpers/users manager";
import {blogsTestManager, postsTestManager} from "../helpers/blogs posts creator";
import {UserDBType} from "../../src/domain/user entity";
import {BlogDBType} from "../../src/domain/blog entity";
import {PostDBType, PostInputModel} from "../../src/domain/post entity";

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
    let newBlog: BlogDBType;
    let postData: PostInputModel;
    let newPost: PostDBType | PostDBType[];

    it("it should leave reaction comment and it should display like on the comment with myStatus as None as non-logged in user", async () => {
        userData = usersTestManager.createData({});
        newUser = await usersTestManager.create(userData);
        newBlog = await blogsTestManager.createBlog(blogsTestManager.createData({}));
        const postData = postsTestManager.createData({blogId: newBlog._id.toString()});
        newPost = await postsTestManager.createPost(newBlog._id.toString(), newBlog?.name, postData);


        //liking logic





    })

    it("", async () => {



    })

    it("", async () => {



    })

})