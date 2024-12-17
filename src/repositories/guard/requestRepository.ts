import {RequestModel} from "../../domain/request entity";


export const requestRepository = {
    async logRequest(date: Date, url: string, ip: string) {
        const result = await RequestModel.create({date, url, ip});
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
