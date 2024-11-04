import {NextFunction, Request, Response} from "express";
import {ObjectId} from "mongodb";


export const objectIdValidator = (req: Request <{id:string}>,
                                  res: Response,
                                  next: NextFunction) => {

    const isValid: boolean = ObjectId.isValid(req.params.id);

    console.log("Passed params id:", req.params.id, "Validation outcome:", isValid);

    if (isValid) {
        return next();
    } else {
        res.sendStatus(404)
        return;
    }

}