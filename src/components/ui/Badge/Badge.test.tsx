import { render, screen } from '@testing-library/react'
import { Badge } from './Badge'

describe('Badge', () => {
  it('renders its label', () => {
    render(<Badge label="active" />)
    expect(screen.getByText('active')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<Badge label="running" className="custom-class" />)
    expect(screen.getByText('running').closest('span')).toHaveClass('custom-class')
  })
})
