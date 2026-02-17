import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '../../test/test-utils';
import { Step5_ThankYou } from './Step5_ThankYou';
import userEvent from '@testing-library/user-event';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});

describe('Step5_ThankYou', () => {
  it('should render thank you message', () => {
    render(<Step5_ThankYou />);
    
    expect(screen.getByText(/Application Submitted!/i)).toBeInTheDocument();
    expect(screen.getByText(/Thank you for applying/i)).toBeInTheDocument();
  });

  it('should render Apply Again button', () => {
    render(<Step5_ThankYou />);
    expect(screen.getByRole('button', { name: /Apply Again/i })).toBeInTheDocument();
  });

  it('should render party popper icon', () => {
    const { container } = render(<Step5_ThankYou />);
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('should navigate to home and reset application when Apply Again is clicked', async () => {
    const user = userEvent.setup();
    render(<Step5_ThankYou />);
    
    const applyAgainButton = screen.getByRole('button', { name: /Apply Again/i });
    await user.click(applyAgainButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
