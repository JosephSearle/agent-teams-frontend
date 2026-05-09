import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RightPanel } from './RightPanel'
import { FIXTURE_TASKS, FIXTURE_DECISIONS } from '@/test/fixtures'

describe('RightPanel', () => {
  it('renders all phase group headings', () => {
    render(
      <RightPanel tasks={FIXTURE_TASKS} decisions={FIXTURE_DECISIONS} onToggleTask={vi.fn()} />,
    )
    expect(screen.getByText('Planning')).toBeInTheDocument()
    expect(screen.getByText('Architecture')).toBeInTheDocument()
    expect(screen.getByText('Implementation')).toBeInTheDocument()
  })

  it('renders task titles', () => {
    render(
      <RightPanel tasks={FIXTURE_TASKS} decisions={FIXTURE_DECISIONS} onToggleTask={vi.fn()} />,
    )
    expect(screen.getByText('Gather requirements & success criteria')).toBeInTheDocument()
  })

  it('calls onToggleTask with the task id when a task checkbox is clicked', async () => {
    const user = userEvent.setup()
    const onToggleTask = vi.fn()
    render(
      <RightPanel
        tasks={FIXTURE_TASKS}
        decisions={FIXTURE_DECISIONS}
        onToggleTask={onToggleTask}
      />,
    )
    const checkboxes = screen.getAllByRole('checkbox')
    await user.click(checkboxes[0])
    expect(onToggleTask).toHaveBeenCalledWith(FIXTURE_TASKS[0].id)
  })

  it('renders decision log entries', () => {
    render(
      <RightPanel tasks={FIXTURE_TASKS} decisions={FIXTURE_DECISIONS} onToggleTask={vi.fn()} />,
    )
    expect(screen.getByText(/argon2id over bcrypt/)).toBeInTheDocument()
  })

  it('shows active task count badge', () => {
    render(
      <RightPanel tasks={FIXTURE_TASKS} decisions={FIXTURE_DECISIONS} onToggleTask={vi.fn()} />,
    )
    const activeTasks = FIXTURE_TASKS.filter(
      (t) => t.status === 'active' || t.status === 'blocked',
    ).length
    expect(screen.getByText(`${activeTasks} active`)).toBeInTheDocument()
  })
})
