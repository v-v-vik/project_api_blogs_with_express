import {QueryType} from "../input-output-types/some";
import {Sort} from "mongodb";


export const sortQueryFields = (query: QueryType) => {
    const pageNumber = !isNaN(Number(query.pageNumber))
        ? Number(query.pageNumber)
        : 1;

    const pageSize = !isNaN(Number(query.pageSize))
        ? Number(query.pageSize)
        : 10;

    const sort:Sort = {
        [query.sortBy || 'createdAt']: query.sortDirection === 'asc' ? 1 : -1
    }

    const skip = (pageNumber - 1) * pageSize;

    return {
        pageNumber,
        pageSize,
        skip,
        sort

    }

}