import {BlogDBType, BlogInputModel} from "../input-output-types/blog types";
import {blogCollection, db_mockup} from "./db";
import {ObjectId, WithId} from "mongodb";


export const blogRepository = {
    async createBlog(blog:BlogInputModel) : Promise<ObjectId> {
        const newId = new ObjectId();
        const itemsCount = await blogCollection.countDocuments();
        const newBlog: BlogDBType = {
            _id: newId,
            id: (itemsCount + 1).toString(), //(db_mockup.blogs.length + 1).toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }

        await blogCollection.insertOne(newBlog);
        return newId


    },

    async getAllBlogs(): Promise<BlogDBType[]> {
         return blogCollection.find({}, {projection:{_id:0}}).toArray()
    },

    async findBlog(id:string) {
        return blogCollection.findOne({id:id}, {projection:{_id:0}});

    },

    async findBlogByUUID(_id: ObjectId) {
        return blogCollection.findOne({_id:_id}, {projection:{_id:0}});
    },

    async updateBlog(id: string, blog: BlogInputModel): Promise<boolean> {
        let searchBlog: BlogDBType | undefined = db_mockup.blogs.find(b=>b.id === id);
        if (searchBlog) {
            const newData = {
                name: blog.name,
                description: blog.description,
                websiteUrl: blog.websiteUrl
            }
            db_mockup.blogs = db_mockup.blogs.map(b=>b.id === id ? {...b, ...newData} : b);
            return true;
        } else {
            return false;
        }
    },

    async deleteBlog(id:string): Promise<boolean> {
        for (let i=0; i<db_mockup.blogs.length; i++) {
            if (db_mockup.blogs[i].id === id) {
                db_mockup.blogs.splice(i, 1)
                return true;
            }
        }
        return false;
    },

    async find(id:string): Promise<WithId<BlogDBType> | null> {
        return blogCollection.findOne({id:id}, {projection:{_id:0}});
    }

}