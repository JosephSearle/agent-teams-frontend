import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { langGraphClient, DEFAULT_ASSISTANT_ID } from '@/lib/langgraph/client'
import { useAppStore } from '@/stores/useAppStore'
import type { Graph } from '@/types'

interface RawAssistant {
  assistant_id: string
  graph_id: string
  name: string
  metadata?: { version?: string; desc?: string }
  created_at: string
  updated_at: string
}

function toGraph(a: RawAssistant): Graph {
  return {
    id: a.assistant_id,
    name: a.name,
    version: a.metadata?.version ?? 'v1.0.0',
    desc: a.metadata?.desc ?? '',
    nodes: 0,
    runs: 0,
  }
}

export function useGraphList() {
  const { setGraphs, setActiveGraph } = useAppStore()

  const query = useQuery({
    queryKey: ['graphs'],
    queryFn: async () => {
      const assistants = (await langGraphClient.assistants.search()) as RawAssistant[]
      return assistants.map(toGraph)
    },
    staleTime: 30_000,
  })

  useEffect(() => {
    if (!query.data || query.data.length === 0) return
    setGraphs(query.data)
    const defaultGraph = query.data.find((g) => g.id === DEFAULT_ASSISTANT_ID) ?? query.data[0]
    setActiveGraph(defaultGraph)
  }, [query.data, setGraphs, setActiveGraph])

  return query
}
