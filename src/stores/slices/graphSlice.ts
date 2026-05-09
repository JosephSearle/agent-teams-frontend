import type { StateCreator } from 'zustand'
import type { Graph, AgentNode } from '@/types'

export interface GraphSlice {
  graphs: Graph[]
  activeGraph: Graph | null
  nodes: AgentNode[]
  setGraphs: (graphs: Graph[]) => void
  setActiveGraph: (graph: Graph | null) => void
  setNodes: (nodes: AgentNode[]) => void
}

export const createGraphSlice: StateCreator<
  GraphSlice,
  [['zustand/devtools', never]],
  [],
  GraphSlice
> = (set) => ({
  graphs: [],
  activeGraph: null,
  nodes: [],

  setGraphs: (graphs) => set({ graphs }, undefined, 'graph/setGraphs'),
  setActiveGraph: (graph) => set({ activeGraph: graph }, undefined, 'graph/setActiveGraph'),
  setNodes: (nodes) => set({ nodes }, undefined, 'graph/setNodes'),
})
