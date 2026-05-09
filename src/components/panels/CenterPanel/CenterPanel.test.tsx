import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CenterPanel } from './CenterPanel'
import { FIXTURE_MESSAGES } from '@/test/fixtures'

const baseProps = {
  title: 'Development Team',
  messages: FIXTURE_MESSAGES,
  onToggleTool: vi.fn(),
  onApprove: vi.fn(),
  onReject: vi.fn(),
  onSend: vi.fn(),
  onInterruptGraph: vi.fn(),
  adminMode: false,
  onToggleAdmin: vi.fn(),
}

describe('CenterPanel', () => {
  it('renders all messages', () => {
    render(<CenterPanel {...baseProps} />)
    expect(screen.getByText('You')).toBeInTheDocument()
    expect(screen.getByText('Planner')).toBeInTheDocument()
  })

  it('send button is disabled when textarea is empty', () => {
    render(<CenterPanel {...baseProps} />)
    expect(screen.getByRole('button', { name: /send/i })).toBeDisabled()
  })

  it('calls onSend with trimmed text on Enter', async () => {
    const user = userEvent.setup()
    const onSend = vi.fn()
    render(<CenterPanel {...baseProps} onSend={onSend} />)
    const textarea = screen.getByPlaceholderText(/send a message/i)
    await user.type(textarea, 'Hello agent')
    await user.keyboard('{Enter}')
    expect(onSend).toHaveBeenCalledWith('Hello agent')
  })

  it('does not send on Shift+Enter (inserts newline)', async () => {
    const user = userEvent.setup()
    const onSend = vi.fn()
    render(<CenterPanel {...baseProps} onSend={onSend} />)
    const textarea = screen.getByPlaceholderText(/send a message/i)
    await user.type(textarea, 'Hello')
    await user.keyboard('{Shift>}{Enter}{/Shift}')
    expect(onSend).not.toHaveBeenCalled()
  })

  it('clears textarea after send', async () => {
    const user = userEvent.setup()
    render(<CenterPanel {...baseProps} onSend={vi.fn()} />)
    const textarea = screen.getByPlaceholderText(/send a message/i)
    await user.type(textarea, 'Hello')
    await user.keyboard('{Enter}')
    expect(textarea).toHaveValue('')
  })

  it('calls onInterruptGraph when stop button is clicked', async () => {
    const user = userEvent.setup()
    const onInterruptGraph = vi.fn()
    render(<CenterPanel {...baseProps} onInterruptGraph={onInterruptGraph} />)
    await user.click(screen.getByRole('button', { name: /stop run/i }))
    expect(onInterruptGraph).toHaveBeenCalledTimes(1)
  })

  it('shows disabled placeholder when disabled prop is set', () => {
    render(<CenterPanel {...baseProps} disabled />)
    expect(screen.getByPlaceholderText(/select a team/i)).toBeInTheDocument()
  })
})
