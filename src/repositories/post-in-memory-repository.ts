// import {db_mockup} from "./db";
// import {PostDBType, PostInputModel} from "../input-output-types/post types";
// import {BlogDBType} from "../input-output-types/blog types";
//
//
// export const postRepository = {
//     createPost(post:PostInputModel) {
//         let newPost:any;
//         const blog:BlogDBType | undefined = db_mockup.blogs.find(b=>b.id === post.blogId);
//         if (blog) {
//             newPost = {
//                 id: (db_mockup.posts.length + 1).toString(),
//                 title: post.title,
//                 shortDescription: post.shortDescription,
//                 content: post.content,
//                 blogId: post.blogId,
//                 blogName: blog.name
//             }
//
//             db_mockup.posts.push(newPost);
//
//         }
//         return newPost;
//     },
//
//     getAllPosts(): PostDBType[] {
//         return db_mockup.posts;
//     },
//
//     findPost(id:string) {
//         return  db_mockup.posts.find(p=>p.id === id);
//
//     },
//
//     updatePost(id: string, post: PostInputModel) {
//         let searchPost = db_mockup.posts.find(p=>p.id === id);
//         const blog:BlogDBType | undefined = db_mockup.blogs.find(b=>b.id === post.blogId);
//         if (searchPost) {
//             if (blog) {
//                 const newData = {
//                     title: post.title,
//                     shortDescription: post.shortDescription,
//                     content: post.content,
//                     blogId: post.blogId,
//                     blogName: blog.name
//                 }
//                 db_mockup.posts = db_mockup.posts.map(p=>p.id === id ? {...p, ...newData} : p);
//             }
//             return true;
//         } else {
//             return false;
//         }
//     },
//
//     deletePost(id:string) {
//         for (let i=0; i<db_mockup.blogs.length; i++) {
//             if (db_mockup.posts[i].id === id) {
//                 db_mockup.posts.splice(i, 1)
//                 return true;
//             }
//         }
//         return false;
//     },
//
//     find(id:string) {
//         return db_mockup.posts.find(p => p.id === id)
//     }
//
// }