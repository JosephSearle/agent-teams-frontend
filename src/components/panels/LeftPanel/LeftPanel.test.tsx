import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LeftPanel } from './LeftPanel'
import { FIXTURE_NODES, FIXTURE_GRAPHS } from '@/test/fixtures'

const graph = FIXTURE_GRAPHS[0]

describe('LeftPanel', () => {
  it('renders all agent nodes', () => {
    render(<LeftPanel nodes={FIXTURE_NODES} graph={graph} onSwitchGraph={vi.fn()} />)
    FIXTURE_NODES.forEach((n) => {
      expect(screen.getByText(n.name)).toBeInTheDocument()
    })
  })

  it('renders the active graph name', () => {
    render(<LeftPanel nodes={FIXTURE_NODES} graph={graph} onSwitchGraph={vi.fn()} />)
    expect(screen.getByText('Development Team')).toBeInTheDocument()
  })

  it('calls onSwitchGraph when the switch button is clicked', async () => {
    const user = userEvent.setup()
    const onSwitchGraph = vi.fn()
    render(<LeftPanel nodes={FIXTURE_NODES} graph={graph} onSwitchGraph={onSwitchGraph} />)
    await user.click(screen.getByRole('button', { name: /switch team/i }))
    expect(onSwitchGraph).toHaveBeenCalledTimes(1)
  })

  it('renders the node count', () => {
    render(<LeftPanel nodes={FIXTURE_NODES} graph={graph} onSwitchGraph={vi.fn()} />)
    expect(screen.getByText(String(FIXTURE_NODES.length))).toBeInTheDocument()
  })

  it('shows no team selected when graph is null', () => {
    render(<LeftPanel nodes={[]} graph={null} onSwitchGraph={vi.fn()} />)
    expect(screen.getByText('No team selected')).toBeInTheDocument()
  })
})
