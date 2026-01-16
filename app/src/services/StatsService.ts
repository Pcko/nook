import axios from "../components/auth/AxiosInstance";

type StatsParams = {
    pageId: string;
    dateFrom: string;
    dateTo: string;
    rangeDays: number;
    segment: string;
};

class StatsService {
    static async getPageStats(params: StatsParams) {
        const { pageId, ...query } = params;
        const response = await axios.get(`/api/stats/pages/${encodeURIComponent(pageId)}`, {
            params: query,
        });
        return response.data;
    }
}

export default StatsService;
