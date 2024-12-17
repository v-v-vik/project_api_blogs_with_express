import {RequestModel} from "../../domain/request entity";
import {ObjectId} from "mongodb";


export const requestRepository = {
    async logRequest(date: Date, url: string, ip: string) {
        const result = await RequestModel.create({
            _id: new ObjectId(),
            date,
            url,
            ip
        });
        console.log(result)
        return !!result.id;
    },

    async countRequests(ip: string | undefined, url: string, date: Date) {
        return RequestModel.countDocuments({
            ip,
            url,
            date: { $gte: date }
        })
    },

    async deleteAllRequests() {
       return RequestModel.deleteMany({});
    }

}
