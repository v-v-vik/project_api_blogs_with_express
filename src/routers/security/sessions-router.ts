import {Router} from "express";
import {refreshTokenMiddleware} from "../../middlewares/refreshTokenMiddleware";
import {showAllSessionsController} from "./showAllSessionsController";
import {terminateAllSessionsController} from "./terminateAllSessionsController";
import {terminateSessionByIdController} from "./terminateSessionByIdController";
import {objectIdValidator} from "../../middlewares/objectIdValidator";


export const sessionRouter = Router();

sessionRouter.get("/", refreshTokenMiddleware, showAllSessionsController);
sessionRouter.delete("/", refreshTokenMiddleware, terminateAllSessionsController)
sessionRouter.delete("/:id", refreshTokenMiddleware, objectIdValidator, terminateSessionByIdController)