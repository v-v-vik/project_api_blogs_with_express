import {db} from "./db";
import {PostDBType, PostInputModel} from "../input-output-types/post types";
import {BlogDBType} from "../input-output-types/blog types";


export const postRepository = {
    createPost(post:PostInputModel) {
        let newPost:any;
        const blog:BlogDBType | undefined = db.blogs.find(b=>b.id === post.blogId);
        if (blog) {
            newPost = {
                id: (db.posts.length + 1).toString(),
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: post.blogId,
                blogName: blog.name
            }

            db.posts.push(newPost);

        }
        return newPost;
    },

    getAllPosts(): PostDBType[] {
        return db.posts;
    },

    findPost(id:string) {
        return  db.posts.find(p=>p.id === id);

    },

    updatePost(id: string, post: PostInputModel) {
        let searchPost = db.posts.find(p=>p.id === id);
        const blog:BlogDBType | undefined = db.blogs.find(b=>b.id === post.blogId);
        if (searchPost) {
            if (blog) {
                const newData = {
                    title: post.title,
                    shortDescription: post.shortDescription,
                    content: post.content,
                    blogId: post.blogId,
                    blogName: blog.name
                }
                db.posts = db.posts.map(p=>p.id === id ? {...p, ...newData} : p);
            }
            return true;
        } else {
            return false;
        }
    },

    deletePost(id:string) {
        for (let i=0; i<db.blogs.length; i++) {
            if (db.posts[i].id === id) {
                db.posts.splice(i, 1)
                return true;
            }
        }
        return false;
    },

    find(id:string) {
        return db.posts.find(p => p.id === id)
    }

}