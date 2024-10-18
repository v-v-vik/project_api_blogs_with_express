import {BlogDBType} from "../input-output-types/blog types";
import {PostDBType} from "../input-output-types/post types";


export type DBType = {
    blogs: BlogDBType[],
    posts: PostDBType[]
}


export const db: DBType = {
    blogs: [],
    posts: []
}

