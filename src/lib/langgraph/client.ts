import { Client } from '@langchain/langgraph-sdk'

const apiUrl = import.meta.env.VITE_LANGGRAPH_API_URL ?? 'http://localhost:2024'
const apiKey = import.meta.env.VITE_LANGGRAPH_API_KEY as string | undefined

export const langGraphClient = new Client({ apiUrl, apiKey })

export const DEFAULT_ASSISTANT_ID =
  (import.meta.env.VITE_DEFAULT_ASSISTANT_ID as string | undefined) ?? 'agent'
