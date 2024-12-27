import {ObjectId} from "mongodb";
import {CommentDBType, CommentModel} from "../../src/domain/comment entity";


export const commentsTestManager = {
    async createComment(userId: string, userLogin: string, postId: string, count?: number, content?: string ): Promise<CommentDBType[]> {
        if (count) {
            const comments = [];
            for (let i = 0; i <= count; i++) {
                comments.push({
                    _id: new ObjectId(),
                    content: content ?? 'some long and very interesting content' + i,
                    commentatorInfo: {
                        userId: userId,
                        userLogin: userLogin,
                    },
                    createdAt: new Date().toISOString(),
                    postId,
                    likesInfo: {
                        likesCount: 0,
                        dislikesCount: 0,
                        myStatus: 'None'
                    }
                })
            }
            await CommentModel.insertMany(comments);
            return comments
        }

        const commentData = {
            _id: new ObjectId(),
            content: content ?? 'some long and very interesting content',
            commentatorInfo: {
                userId: userId,
                userLogin: userLogin,
            },
            createdAt: new Date().toISOString(),
            postId,
            likesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: 'None'
            }
        }
        await CommentModel.create(commentData);
        return [commentData]
    }

}