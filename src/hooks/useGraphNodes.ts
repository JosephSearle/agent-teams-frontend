import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { langGraphClient } from '@/lib/langgraph/client'
import { useAppStore } from '@/stores/useAppStore'
import type { AgentNode } from '@/types'

interface RawGraphNode {
  id: string | number
  name?: string
}

interface RawGraphSchema {
  nodes: RawGraphNode[]
}

function toAgentNode(n: RawGraphNode): AgentNode {
  const id = String(n.id)
  const label =
    n.name ??
    id
      .replace(/_agent$/, '')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase())
  return {
    id,
    name: label,
    icon: label[0]?.toUpperCase() ?? '?',
    status: 'idle',
  }
}

export function useGraphNodes(assistantId: string | null) {
  const { setNodes } = useAppStore()

  const query = useQuery({
    queryKey: ['graph-nodes', assistantId],
    queryFn: async () => {
      const schema = (await langGraphClient.assistants.getGraph(
        assistantId!,
      )) as unknown as RawGraphSchema
      return schema.nodes.filter((n) => !String(n.id).startsWith('__')).map(toAgentNode)
    },
    enabled: assistantId !== null,
    staleTime: 60_000,
  })

  useEffect(() => {
    if (!assistantId) {
      setNodes([])
    } else if (query.data) {
      setNodes(query.data)
    }
  }, [assistantId, query.data, setNodes])

  return query
}
