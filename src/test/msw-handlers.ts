import { http, HttpResponse } from 'msw'
import { FIXTURE_ASSISTANTS, FIXTURE_GRAPH_SCHEMA } from '@/test/fixtures'

const BASE = 'http://localhost:2024'

export const handlers = [
  http.get(`${BASE}/assistants/search`, () => {
    return HttpResponse.json(FIXTURE_ASSISTANTS)
  }),

  http.get(`${BASE}/assistants/:assistantId/graph`, () => {
    return HttpResponse.json(FIXTURE_GRAPH_SCHEMA)
  }),

  http.post(`${BASE}/threads`, () => {
    return HttpResponse.json({
      thread_id: 'thread_test_001',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      metadata: {},
    })
  }),

  http.post(`${BASE}/threads/:threadId/runs/stream`, () => {
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      start(controller) {
        const events = [
          'event: metadata\ndata: {"run_id":"run_test_001"}\n\n',
          'event: values\ndata: {"messages":[{"id":"msg_001","type":"ai","content":"Hello from the mock agent."}]}\n\n',
          'event: end\ndata: {}\n\n',
        ]
        events.forEach((e) => controller.enqueue(encoder.encode(e)))
        controller.close()
      },
    })
    return new HttpResponse(stream, {
      headers: { 'Content-Type': 'text/event-stream' },
    })
  }),
]
