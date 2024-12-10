import {NextFunction, Request, Response} from "express";
import {requestRepository} from "../../repositories/guard/requestRepository";
import {HttpStatuses} from "../../result-object/result code";

export const requestLogger = async (request: Request,
                                    response: Response,
                                    next: NextFunction) => {

    const date: Date = new Date();
    const url = request.baseUrl;
    const ip = request.ip || request.socket.remoteAddress;

    if (ip) {
        const result = await requestRepository.logRequest(date, url, ip);
        if (result) {
            next();
            return;
        }
    }

    response.status(HttpStatuses.ServerError).send({errorMessage: "IP address cannot be found"});
    return;

}

export const rateLimitManager = async (request: Request,
                                       response: Response,
                                       next: NextFunction) => {

    const timeWindow = new Date(Date.now() - 10 * 1000);

    try {
        const requestCount = await requestRepository.countRequests(request.ip, request.baseUrl, timeWindow);
        if (requestCount > 5) {
            response.status(HttpStatuses.TooManyRequests).send({errorMessage: "Too many requests"});
            return;
        }
        next();
    } catch (error) {
        console.error('Error enforcing rate limit:', error);
        response.status(HttpStatuses.ServerError).send({errorMessage: "Server Error"})
    }
}

export const rateLimitMiddleware = [
    requestLogger,
    rateLimitManager
]