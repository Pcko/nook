import { RAGQueryBody } from "./interfaces/RAGQueryBody.ts";

class AIService {

    static async queryAIStream(
        body: RAGQueryBody,
        onChunk: (chunk: string) => void
    ): Promise<void> {
        let accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');

        const makeRequest = async (): Promise<Response> => {
            return fetch(`${import.meta.env.VITE_API_URL}api/generation/query`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {})
                },
                body: JSON.stringify(body),
            });
        };

        let response = await makeRequest();

        // Wenn 401, dann versuchen, Token zu erneuern
        if (response.status === 401 && refreshToken) {
            try {
                const tokenResponse = await fetch(`${import.meta.env.VITE_API_URL}auth/token`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token: refreshToken })
                });

                if (!tokenResponse.ok) throw new Error('Refresh token failed');

                const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await tokenResponse.json();
                localStorage.setItem('accessToken', newAccessToken);
                localStorage.setItem('refreshToken', newRefreshToken);

                accessToken = newAccessToken;

                // Erneut versuchen
                response = await makeRequest();
            } catch (err) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                throw new Error('Session expired, please log in again.');
            }
        }

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Server error: ${text}`);
        }

        if (!response.body) {
            throw new Error('ReadableStream not supported by the server response!');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            onChunk(chunk);
        }
    }
}

export default AIService;
