import {Router} from "express";
import {objectIdValidator} from "../../middlewares/objectIdValidator";
import {accessTokenMiddleware} from "../../middlewares/accessTokenMiddleware";
import {commentValidators} from "../../middlewares/commentValidators";
import {findCommentByIdController} from "./findCommentController";
import {deleteCommentController} from "./deleteCommentController";
import {updateCommentController} from "./updateCommentController";


export const commentRouter = Router();

commentRouter.get("/:id", objectIdValidator, findCommentByIdController);
commentRouter.put("/:id", accessTokenMiddleware, objectIdValidator, commentValidators, updateCommentController);
commentRouter.delete("/:id", accessTokenMiddleware, objectIdValidator, deleteCommentController);