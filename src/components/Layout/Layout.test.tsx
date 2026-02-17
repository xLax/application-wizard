import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '../../test/test-utils';
import { Layout } from './Layout';
import userEvent from '@testing-library/user-event';

// Mock useLocation and useNavigate
const mockNavigate = vi.fn();
let mockLocation = { pathname: '/' };

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation,
    Outlet: () => <div data-testid="outlet">Outlet Content</div>,
  };
});

describe('Layout', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockLocation = { pathname: '/' };
  });

  it('should render the application title', () => {
    render(<Layout />);
    expect(screen.getByText('Application Wizard')).toBeInTheDocument();
  });

  it('should render all step labels', () => {
    render(<Layout />);
    
    expect(screen.getByText('Personal Info')).toBeInTheDocument();
    expect(screen.getByText('Experience')).toBeInTheDocument();
    expect(screen.getByText('Questionnaire')).toBeInTheDocument();
    expect(screen.getByText('Summary')).toBeInTheDocument();
  });

  it('should render step numbers', () => {
    render(<Layout />);
    
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('should render the outlet for child components', () => {
    render(<Layout />);
    expect(screen.getByTestId('outlet')).toBeInTheDocument();
  });

  it('should render New Application button on initial page', () => {
    render(<Layout />);
    expect(screen.getByRole('button', { name: /New Application/i })).toBeInTheDocument();
  });

  it('should not render New Application button on thank you page', () => {
    mockLocation = { pathname: '/thank-you' };
    render(<Layout />);
    
    expect(screen.queryByRole('button', { name: /New Application/i })).not.toBeInTheDocument();
  });

  it('should show confirm dialog when New Application button is clicked', async () => {
    const user = userEvent.setup();
    render(<Layout />);
    
    const newAppButton = screen.getByRole('button', { name: /New Application/i });
    await user.click(newAppButton);
    
    expect(screen.getByText('Start New Application?')).toBeInTheDocument();
    expect(screen.getByText(/All entered information will be deleted/i)).toBeInTheDocument();
  });

  it('should close confirm dialog when No is clicked', async () => {
    const user = userEvent.setup();
    render(<Layout />);
    
    const newAppButton = screen.getByRole('button', { name: /New Application/i });
    await user.click(newAppButton);
    
    const noButton = screen.getByRole('button', { name: 'No' });
    await user.click(noButton);
    
    await waitFor(() => {
      expect(screen.queryByText('Start New Application?')).not.toBeInTheDocument();
    });
  });

  it('should navigate to home and reset when Yes is clicked in confirm dialog', async () => {
    const user = userEvent.setup();
    render(<Layout />);
    
    const newAppButton = screen.getByRole('button', { name: /New Application/i });
    await user.click(newAppButton);
    
    const yesButton = screen.getByRole('button', { name: 'Yes' });
    await user.click(yesButton);
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('should highlight current step based on pathname', () => {
    mockLocation = { pathname: '/work-experience' };
    const { container } = render(<Layout />);
    
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const stepCircles = container.querySelectorAll('.step-circle');
    // Second step should be current (index 1)
    expect(stepCircles[1]).toHaveClass('current');
  });

  it('should mark completed steps with check icon', () => {
    mockLocation = { pathname: '/questionnaire' };
    const { container } = render(<Layout />);
    
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const stepCircles = container.querySelectorAll('.step-circle');
    // First two steps should be completed
    expect(stepCircles[0]).toHaveClass('completed');
    expect(stepCircles[1]).toHaveClass('completed');
  });

  it('should show all steps as completed on thank you page', () => {
    mockLocation = { pathname: '/thank-you' };
    const { container } = render(<Layout />);
    
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const stepCircles = container.querySelectorAll('.step-circle');
    // All 4 steps should be completed
    stepCircles.forEach((circle: Element, index: number) => {
      if (index < 4) {
        expect(circle).toHaveClass('completed');
      }
    });
  });

  it('should have sticky header', () => {
    const { container } = render(<Layout />);
    
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const header = container.querySelector('.app-header');
    expect(header).toBeInTheDocument();
  });

  it('should render stepper with correct structure', () => {
    const { container } = render(<Layout />);
    
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const stepper = container.querySelector('.stepper');
    expect(stepper).toBeInTheDocument();
    
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const stepItems = container.querySelectorAll('.step-item');
    expect(stepItems.length).toBe(4);
  });
});
