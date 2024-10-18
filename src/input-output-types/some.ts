import {Request, Response} from 'express'
import {OutputErrorsType} from "./error output types";
import {BlogDBType} from "./blog types";

export type ParamType = {
    id: string
}

export type BodyType = {
    id?: number
    name?: string,
    description?: string,
    websiteUrl?: string
}

export type QueryType = {
    search?: string
}

export type OutputType = void | OutputErrorsType | BlogDBType

export const someController = (
    req: Request<ParamType, OutputType, BodyType, QueryType>,
    res: Response<OutputType>
) => {

}