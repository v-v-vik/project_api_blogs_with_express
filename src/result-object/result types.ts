import {ResultStatus} from "./result code";


export type Result<T = null> = {
    status: ResultStatus;
    data: T;
};