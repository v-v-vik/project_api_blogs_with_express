import {Router} from "express";
import {refreshTokenMiddleware} from "../middlewares/refreshTokenMiddleware";
import {sessionController} from "../controllers/sessions-controller";


export const sessionRouter = Router();

sessionRouter.get(
    "/",
    refreshTokenMiddleware,
    sessionController.displayAll
);

sessionRouter.delete(
    "/",
    refreshTokenMiddleware,
    sessionController.deleteAll
)
sessionRouter.delete(
    "/:id",
    refreshTokenMiddleware,
    sessionController.deleteById
)