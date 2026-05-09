import { render, screen } from '@testing-library/react'
import { MessageRenderer } from './MessageRenderer'
import type { Message } from '@/types'

describe('MessageRenderer', () => {
  it('renders a user message with from name', () => {
    const msg: Message = { kind: 'user', from: 'You', time: '10:00', text: 'Hello world' }
    render(
      <MessageRenderer
        message={msg}
        idx={0}
        onToggleTool={vi.fn()}
        onApprove={vi.fn()}
        onReject={vi.fn()}
      />,
    )
    expect(screen.getByText('You')).toBeInTheDocument()
    expect(screen.getByText('Hello world')).toBeInTheDocument()
  })

  it('renders a system message with from → to routing', () => {
    const msg: Message = {
      kind: 'system',
      text: 'Transitioned to',
      from: 'planner_agent',
      to: 'architect_agent',
      time: '10:01',
    }
    render(
      <MessageRenderer
        message={msg}
        idx={1}
        onToggleTool={vi.fn()}
        onApprove={vi.fn()}
        onReject={vi.fn()}
      />,
    )
    expect(screen.getByText('Transitioned to')).toBeInTheDocument()
    expect(screen.getByText('planner_agent')).toBeInTheDocument()
    expect(screen.getByText('architect_agent')).toBeInTheDocument()
  })

  it('renders an agent message with the agent name', () => {
    const msg: Message = {
      kind: 'agent',
      agentId: 'planner',
      from: 'Planner',
      time: '10:02',
      text: 'I scoped the requirements.',
    }
    render(
      <MessageRenderer
        message={msg}
        idx={2}
        onToggleTool={vi.fn()}
        onApprove={vi.fn()}
        onReject={vi.fn()}
      />,
    )
    expect(screen.getByText('Planner')).toBeInTheDocument()
    expect(screen.getByText(/scoped the requirements/)).toBeInTheDocument()
  })

  it('renders a tool card inside an agent message when tool is present', () => {
    const msg: Message = {
      kind: 'agent',
      agentId: 'architect',
      from: 'Architect',
      time: '10:03',
      text: 'Inspected schema.',
      tool: {
        name: 'db.inspect',
        status: 'complete',
        args: '{}',
        result: '{}',
        open: false,
      },
    }
    render(
      <MessageRenderer
        message={msg}
        idx={3}
        onToggleTool={vi.fn()}
        onApprove={vi.fn()}
        onReject={vi.fn()}
      />,
    )
    expect(screen.getByText('db.inspect')).toBeInTheDocument()
  })

  it('renders an interrupt card inside an agent message when interrupt is present', () => {
    const msg: Message = {
      kind: 'agent',
      agentId: 'architect',
      from: 'Architect',
      time: '10:04',
      text: 'Needs approval.',
      interrupt: {
        title: 'Approve change?',
        from: 'architect_agent',
        prompt: 'Please review.',
        payload: 'ALTER TABLE ...',
      },
    }
    render(
      <MessageRenderer
        message={msg}
        idx={4}
        onToggleTool={vi.fn()}
        onApprove={vi.fn()}
        onReject={vi.fn()}
      />,
    )
    expect(screen.getByText('Approve change?')).toBeInTheDocument()
  })
})
