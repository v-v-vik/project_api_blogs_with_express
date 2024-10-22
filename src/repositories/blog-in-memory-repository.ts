import {BlogDBType, BlogInputModel} from "../input-output-types/blog types";
import {db_mockup} from "./db";


export const blogRepository = {
    async createBlog(blog:BlogDBType) : Promise<BlogDBType> {
        const newBlog: BlogDBType = {
            _id:blog._id,
            id: (db_mockup.blogs.length + 1).toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }

        db_mockup.blogs.push(newBlog);



        return newBlog;
    },

    getAllBlogs() {
        return db_mockup.blogs;
    },

    findBlog(id:string) {
        return  db_mockup.blogs.find(b=>b.id === id);

    },

    updateBlog(id: string, blog: BlogInputModel) {
        let searchBlog = db_mockup.blogs.find(b=>b.id === id);
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

    deleteBlog(id:string) {
        for (let i=0; i<db_mockup.blogs.length; i++) {
            if (db_mockup.blogs[i].id === id) {
                db_mockup.blogs.splice(i, 1)
                return true;
            }
        }
        return false;
    },

    find(id:string) {
        return db_mockup.blogs.find(b=> b.id === id)
    }

}