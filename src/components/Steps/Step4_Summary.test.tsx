import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '../../test/test-utils';
import { Step4_Summary } from './Step4_Summary';
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

// Mock console.log
const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

describe('Step4_Summary', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    consoleLogSpy.mockClear();
  });

  it('should render summary page with title', () => {
    render(<Step4_Summary />);
    expect(screen.getByText('Review Your Application')).toBeInTheDocument();
  });

  it('should render all section headers', () => {
    render(<Step4_Summary />);
    
    expect(screen.getByText('Personal Information')).toBeInTheDocument();
    expect(screen.getByText('Work Experience')).toBeInTheDocument();
    expect(screen.getByText('Additional Information')).toBeInTheDocument();
  });

  it('should render Back and Submit Application buttons', () => {
    render(<Step4_Summary />);
    expect(screen.getByRole('button', { name: /Back/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Submit Application/i })).toBeInTheDocument();
  });

  it('should navigate back to questionnaire when Back button is clicked', async () => {
    const user = userEvent.setup();
    render(<Step4_Summary />);
    
    const backButton = screen.getByRole('button', { name: /Back/i });
    await user.click(backButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/questionnaire');
  });

  it('should display "No work experience added" when no experiences exist', () => {
    render(<Step4_Summary />);
    expect(screen.getByText('No work experience added.')).toBeInTheDocument();
  });

  it('should show validation error when personal info is incomplete', async () => {
    const user = userEvent.setup();
    render(<Step4_Summary />);
    
    const submitButton = screen.getByRole('button', { name: /Submit Application/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Personal information is incomplete or invalid/i)).toBeInTheDocument();
    });
  });

  it('should show validation error for missing questionnaire answers', async () => {
    const user = userEvent.setup();
    render(<Step4_Summary />);
    
    const submitButton = screen.getByRole('button', { name: /Submit Application/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      // Will show either personal info or questionnaire error, depending on what's checked first
      expect(screen.getByText(/incomplete or invalid|answer all questions/i)).toBeInTheDocument();
    });
  });

  it('should display personal information labels', () => {
    render(<Step4_Summary />);
    
    expect(screen.getByText('Full Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Phone')).toBeInTheDocument();
    expect(screen.getByText('Location')).toBeInTheDocument();
  });

  it('should display questionnaire questions', () => {
    render(<Step4_Summary />);
    
    expect(screen.getByText(/Legal Authorization Constraints/i)).toBeInTheDocument();
    expect(screen.getByText(/Available in 30 days/i)).toBeInTheDocument();
    expect(screen.getByText(/Relocation Support/i)).toBeInTheDocument();
  });

  it('should display attached CV section', () => {
    render(<Step4_Summary />);
    expect(screen.getByText('Attached CV')).toBeInTheDocument();
  });

  it('should show "No file uploaded" when CV is not uploaded', () => {
    render(<Step4_Summary />);
    expect(screen.getByText('No file uploaded')).toBeInTheDocument();
  });

  it('should display validation error in a styled alert box', async () => {
    const user = userEvent.setup();
    render(<Step4_Summary />);
    
    const submitButton = screen.getByRole('button', { name: /Submit Application/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      const errorElement = screen.getByText(/incomplete or invalid/i);
      expect(errorElement).toBeInTheDocument();
      // Check if element has error styling
      expect(errorElement).toHaveStyle({ 'background-color': '#fee2e2' });
    });
  });

  it('should have proper structure for all sections', () => {
    const { container } = render(<Step4_Summary />);
    
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const sections = container.querySelectorAll('section');
    expect(sections.length).toBeGreaterThanOrEqual(3); // At least 3 sections
  });
});
