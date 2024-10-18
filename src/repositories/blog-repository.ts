import {BlogDBType, BlogInputModel} from "../input-output-types/blog types";
import {db} from "./db";


export const blogRepository = {
    createBlog(blog:BlogInputModel) {
        const newBlog: BlogDBType = {
            id: (db.blogs.length + 1).toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl
        }

        db.blogs.push(newBlog);



        return newBlog;
    },

    getAllBlogs() {
        return db.blogs;
    },

    findBlog(id:string) {
        return  db.blogs.find(b=>b.id === id);

    },

    updateBlog(id: string, blog: BlogInputModel) {
        let searchBlog = db.blogs.find(b=>b.id === id);
        if (searchBlog) {
            const newData = {
                name: blog.name,
                description: blog.description,
                websiteUrl: blog.websiteUrl
            }
            db.blogs = db.blogs.map(b=>b.id === id ? {...b, ...newData} : b);
            return true;
        } else {
            return false;
        }
    },

    deleteBlog(id:string) {
        for (let i=0; i<db.blogs.length; i++) {
            if (db.blogs[i].id === id) {
                db.blogs.splice(i, 1)
                return true;
            }
        }
        return false;
    },

    find(id:string) {
        return db.blogs.find(b=> b.id === id)
    }

}