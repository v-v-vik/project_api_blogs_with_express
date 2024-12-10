import {Request, Response} from "express";
import {sessionRepository} from "../../repositories/guard/sessionRepository";



export const terminateAllSessionsController = async (req: Request,
                                                   res: Response)=> {
    const result = await sessionRepository.terminateAllSessions()
}