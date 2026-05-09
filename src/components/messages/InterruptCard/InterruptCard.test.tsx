import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { InterruptCard } from './InterruptCard'
import type { Interrupt } from '@/types'

const mockInterrupt: Interrupt = {
  title: 'Approve schema migration?',
  from: 'architect_agent',
  prompt: 'The architect proposes adding a password_hash column.',
  payload: 'ALTER TABLE users ADD COLUMN password_hash text NOT NULL;',
}

describe('InterruptCard', () => {
  it('renders the interrupt title', () => {
    render(<InterruptCard data={mockInterrupt} onApprove={vi.fn()} onReject={vi.fn()} />)
    expect(screen.getByText('Approve schema migration?')).toBeInTheDocument()
  })

  it('renders the payload', () => {
    render(<InterruptCard data={mockInterrupt} onApprove={vi.fn()} onReject={vi.fn()} />)
    expect(screen.getByText(/ALTER TABLE users ADD COLUMN password_hash/)).toBeInTheDocument()
  })

  it('calls onApprove when approve button is clicked', async () => {
    const user = userEvent.setup()
    const onApprove = vi.fn()
    render(<InterruptCard data={mockInterrupt} onApprove={onApprove} onReject={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: /approve & continue/i }))
    expect(onApprove).toHaveBeenCalledTimes(1)
  })

  it('calls onReject when reject button is clicked', async () => {
    const user = userEvent.setup()
    const onReject = vi.fn()
    render(<InterruptCard data={mockInterrupt} onApprove={vi.fn()} onReject={onReject} />)
    await user.click(screen.getByRole('button', { name: /reject/i }))
    expect(onReject).toHaveBeenCalledTimes(1)
  })

  it('shows resolved state when resolved is true', () => {
    render(<InterruptCard data={mockInterrupt} onApprove={vi.fn()} onReject={vi.fn()} resolved />)
    expect(screen.getByText(/approved/i)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /approve/i })).not.toBeInTheDocument()
  })

  it('shows rejected state when resolved and rejected', () => {
    render(
      <InterruptCard
        data={{ ...mockInterrupt, rejected: true }}
        onApprove={vi.fn()}
        onReject={vi.fn()}
        resolved
      />,
    )
    expect(screen.getByText(/rejected/i)).toBeInTheDocument()
  })
})
