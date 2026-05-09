import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { IconButton } from './IconButton'

describe('IconButton', () => {
  it('has an accessible title', () => {
    render(<IconButton title="Attach file">📎</IconButton>)
    expect(screen.getByTitle('Attach file')).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <IconButton title="Stop" onClick={onClick}>
        ■
      </IconButton>,
    )
    await user.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
