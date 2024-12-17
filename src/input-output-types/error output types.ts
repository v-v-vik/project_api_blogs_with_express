import {BlogInputModel} from "../domain/blog entity";
import {PostInputModel} from "../domain/post entity";


export type FieldNamesType = keyof BlogInputModel | keyof PostInputModel


export type OutputErrorsType = {
    errorsMessages: {message: string, field: FieldNamesType}[]
}