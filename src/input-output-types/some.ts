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
    searchNameTerm?: string | null;
    pageNumber?: number;
    pageSize?: number;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
}


export type UsersQueryFieldsType = {
    searchLoginTerm?: string | null;
    searchEmailTerm?: string | null;
    pageNumber?: number;
    pageSize?: number;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
}

export type OutputType = void | OutputErrorsType | BlogDBType

// export const someController = (
//     req: Request<ParamType, OutputType, BodyType, QueryType>,
//     res: Response<OutputType>
// ) => {
//
// }

export type Paginator<T> = {
    pagesCount: number;
    page: number
    pageSize: number;
    totalCount: number;
    items: T[];

}

export type RegistrationConfirmationCodeModel = {
    code: string
}
