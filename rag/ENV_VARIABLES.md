## Required parameters

### the "password" to the rag api, any request that does not contain this header (same name) set will be rejected.
RAG_API_KEY=

### the LLM model name used in ollama
Local_LLM_Model=

## Optional parameters (with defaults)

### the port the server will run on
SERVER_PORT=3010

### the local port on the server that serves the LLM api
LLM_PORT=11434

### the local port on the server that servers the chromadb api
CHROMADB_API_PORT=8000
