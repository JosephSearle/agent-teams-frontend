import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ToolCallCard } from './ToolCallCard'
import type { ToolCall } from '@/types'

const mockTool: ToolCall = {
  name: 'postgres.inspect_schema',
  status: 'complete',
  args: '{"tables": ["users"]}',
  result: '{"users": {"columns": []}}',
  duration: '180ms',
  open: false,
}

describe('ToolCallCard', () => {
  it('renders the tool name', () => {
    render(<ToolCallCard tool={mockTool} onToggle={vi.fn()} />)
    expect(screen.getByText('postgres.inspect_schema')).toBeInTheDocument()
  })

  it('hides the body with aria-hidden when closed', () => {
    render(<ToolCallCard tool={mockTool} onToggle={vi.fn()} />)
    expect(screen.getByTestId('tool-body')).toHaveAttribute('aria-hidden', 'true')
  })

  it('shows input and output when open', () => {
    render(<ToolCallCard tool={{ ...mockTool, open: true }} onToggle={vi.fn()} />)
    expect(screen.getByText('{"tables": ["users"]}')).toBeVisible()
    expect(screen.getByText('{"users": {"columns": []}}')).toBeVisible()
  })

  it('calls onToggle when header is clicked', async () => {
    const user = userEvent.setup()
    const onToggle = vi.fn()
    render(<ToolCallCard tool={mockTool} onToggle={onToggle} />)
    await user.click(screen.getByRole('button', { name: /toggle tool/i }))
    expect(onToggle).toHaveBeenCalledTimes(1)
  })

  it('shows duration when status is complete', () => {
    render(<ToolCallCard tool={mockTool} onToggle={vi.fn()} />)
    expect(screen.getByText('180ms')).toBeInTheDocument()
  })

  it('shows "running" when status is streaming', () => {
    render(<ToolCallCard tool={{ ...mockTool, status: 'streaming' }} onToggle={vi.fn()} />)
    expect(screen.getByText('running')).toBeInTheDocument()
  })
})
