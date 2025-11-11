// components/AIChat.tsx
import React, {useState} from 'react';
import AIService from '../../services/AIService.ts';
import useErrorHandler from "../general/ErrorHandler";

export default function AIChat() {
    const [query, setQuery] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const handleError = useErrorHandler();

    const handleSend = async () => {
        setResponse('');
        setLoading(true);

        try {
            await AIService.queryAIStream(
                {query, stream: true},
                (chunk: string) => {
                    setResponse((prev) => prev + chunk);
                }
            );
        } catch (error) {
            handleError(`AI query failed: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 max-w-xl mx-auto">
      <textarea
          rows={4}
          className="w-full border border-gray-300 rounded p-2"
          placeholder="Ask AI..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={loading}
      />
            <button
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                onClick={handleSend}
                disabled={loading || !query.trim()}
            >
                {loading ? 'Loading...' : 'Send'}
            </button>

            <pre
                className="mt-4 p-4 bg-gray-100 rounded whitespace-pre-wrap min-h-[100px]"
                style={{whiteSpace: 'pre-wrap'}}
            >
        {response}
      </pre>
        </div>
    );
}
