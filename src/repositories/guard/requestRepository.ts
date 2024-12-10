import {requestCollection} from "../db";


export const requestRepository = {
    async logRequest(date: Date, url: string, ip: string) {
        const result = await requestCollection.insertOne({date, url, ip});
        return !!result.insertedId;
    },

    async countRequests(ip: string | undefined, url: string, date: Date) {
        return await requestCollection.countDocuments({
            ip,
            url,
            date: { $gte: date }
        })
    }

}
