import { render, screen } from '@testing-library/react'
import { StatusDot } from './StatusDot'

describe('StatusDot', () => {
  it('has an accessible aria-label describing the status', () => {
    render(<StatusDot status="running" />)
    expect(screen.getByRole('img', { name: /running/i })).toBeInTheDocument()
  })

  it('renders for each valid status', () => {
    const statuses = ['idle', 'running', 'waiting', 'complete', 'error'] as const
    statuses.forEach((status) => {
      const { unmount } = render(<StatusDot status={status} />)
      expect(screen.getByRole('img')).toBeInTheDocument()
      unmount()
    })
  })
})
