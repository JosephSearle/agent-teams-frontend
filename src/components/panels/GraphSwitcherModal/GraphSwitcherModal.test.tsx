import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { GraphSwitcherModal } from './GraphSwitcherModal'
import { FIXTURE_GRAPHS } from '@/test/fixtures'

describe('GraphSwitcherModal', () => {
  it('renders all graph names', () => {
    render(<GraphSwitcherModal graphs={FIXTURE_GRAPHS} onClose={vi.fn()} onSelect={vi.fn()} />)
    FIXTURE_GRAPHS.forEach((g) => {
      expect(screen.getByText(g.name)).toBeInTheDocument()
    })
  })

  it('calls onSelect with the graph when a row is clicked', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(<GraphSwitcherModal graphs={FIXTURE_GRAPHS} onClose={vi.fn()} onSelect={onSelect} />)
    await user.click(screen.getByText(FIXTURE_GRAPHS[1].name))
    expect(onSelect).toHaveBeenCalledWith(FIXTURE_GRAPHS[1])
  })

  it('calls onClose when the backdrop is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<GraphSwitcherModal graphs={FIXTURE_GRAPHS} onClose={onClose} onSelect={vi.fn()} />)
    await user.click(screen.getByRole('dialog').previousElementSibling!)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when the close button is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<GraphSwitcherModal graphs={FIXTURE_GRAPHS} onClose={onClose} onSelect={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: /close/i }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
