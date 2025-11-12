import {RAGQueryBody, RAGResponseDTO} from "./interfaces/RAGQueryBody.ts";
import axios from "../components/auth/AxiosInstance";


const axiosConfig = {
    headers: {'Content-Type': 'application/json'},
    timeout: 60000,
    timeoutErrorMessage: 'Server did not respond.',
};

class AIService {

    static async queryAIStream(
        body: RAGQueryBody,
    ): Promise<RAGResponseDTO> {
        const response = await axios.post<RAGResponseDTO>('/api/generation/query', body, axiosConfig);
        return response.data;
    }
}

export default AIService;
