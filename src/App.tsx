import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { LeftPanel } from '@/components/panels/LeftPanel/LeftPanel'
import { CenterPanel } from '@/components/panels/CenterPanel/CenterPanel'
import { RightPanel } from '@/components/panels/RightPanel/RightPanel'
import { GraphSwitcherModal } from '@/components/panels/GraphSwitcherModal/GraphSwitcherModal'
import { useAppStore } from '@/stores/useAppStore'
import { useGraphList } from '@/hooks/useGraphList'
import { useGraphNodes } from '@/hooks/useGraphNodes'
import { useLangGraphStream } from '@/hooks/useLangGraphStream'
import type { Message, Graph } from '@/types'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1 } },
})

const langfuseBase = import.meta.env.VITE_LANGFUSE_BASE_URL as string | undefined

function AgentTeams() {
  const {
    nodes,
    tasks,
    decisions,
    messages,
    graphs,
    activeGraph,
    streamStatus,
    modalOpen,
    adminMode,
    layout,
    setActiveGraph,
    setModalOpen,
    toggleAdminMode,
    toggleTool,
    toggleTask,
    resolveInterrupt,
  } = useAppStore()

  useGraphList()
  useGraphNodes(activeGraph?.id ?? null)

  const { submit, handleInterrupt, stop } = useLangGraphStream({
    assistantId: activeGraph?.id ?? null,
  })

  const handleApprove = (msg: Message) => {
    const idx = messages.indexOf(msg)
    if (idx === -1) return
    resolveInterrupt(idx, true)
    handleInterrupt(true)
  }

  const handleReject = (msg: Message) => {
    const idx = messages.indexOf(msg)
    if (idx === -1) return
    resolveInterrupt(idx, false)
    handleInterrupt(false)
  }

  const handleSelectGraph = (g: Graph) => {
    setActiveGraph(g)
    setModalOpen(false)
  }

  return (
    <div
      className="grid h-full"
      style={{
        gridTemplateColumns: layout === 'two-panel' ? '260px 1fr' : '260px 1fr 300px',
      }}
    >
      <LeftPanel
        nodes={nodes}
        graph={activeGraph}
        streamStatus={streamStatus}
        onSwitchGraph={() => setModalOpen(true)}
      />
      <CenterPanel
        title={activeGraph?.name ?? ''}
        messages={messages}
        onToggleTool={toggleTool}
        onApprove={handleApprove}
        onReject={handleReject}
        onSend={submit}
        onInterruptGraph={stop}
        adminMode={adminMode}
        onToggleAdmin={toggleAdminMode}
        langfuseBase={langfuseBase}
        disabled={!activeGraph}
      />
      {layout !== 'two-panel' && (
        <RightPanel tasks={tasks} decisions={decisions} onToggleTask={toggleTask} />
      )}

      {modalOpen && (
        <GraphSwitcherModal
          graphs={graphs}
          onClose={() => setModalOpen(false)}
          onSelect={handleSelectGraph}
        />
      )}
    </div>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AgentTeams />
    </QueryClientProvider>
  )
}
