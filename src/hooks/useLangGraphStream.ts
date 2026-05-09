import { useStream } from '@langchain/langgraph-sdk/react'
import { useAppStore } from '@/stores/useAppStore'
import { nowTime } from '@/lib/utils'
import type { Message } from '@/types'

interface UseLangGraphStreamOptions {
  assistantId: string | null
}

export function useLangGraphStream({ assistantId }: UseLangGraphStreamOptions) {
  const { appendMessage, setStreamStatus } = useAppStore()

  const stream = useStream({
    apiUrl: import.meta.env.VITE_LANGGRAPH_API_URL,
    assistantId: assistantId ?? '',
    onError: () => setStreamStatus('error'),
    onFinish: () => setStreamStatus('idle'),
  })

  const submit = (text: string) => {
    if (!assistantId) return
    setStreamStatus('streaming')
    const userMsg: Message = { kind: 'user', from: 'You', time: nowTime(), text }
    appendMessage(userMsg)

    stream.submit(
      { messages: [{ role: 'user', content: text }] },
      { streamMode: ['values', 'updates', 'messages-tuple'] },
    )
  }

  const handleInterrupt = (approved: boolean) => {
    stream.submit(null, {
      command: { resume: approved },
    })
  }

  return {
    submit,
    handleInterrupt,
    stop: stream.stop,
  }
}
