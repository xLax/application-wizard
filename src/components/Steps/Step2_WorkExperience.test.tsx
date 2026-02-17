import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '../../test/test-utils';
import { Step2_WorkExperience } from './Step2_WorkExperience';
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

describe('Step2_WorkExperience', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('should render work experience form with title', () => {
    render(<Step2_WorkExperience />);
    expect(screen.getByText('Work Experience')).toBeInTheDocument();
  });

  it('should render Add Experience button when no experiences exist', () => {
    render(<Step2_WorkExperience />);
    expect(screen.getByRole('button', { name: /Add Experience/i })).toBeInTheDocument();
  });

  it('should render Back and Next Step buttons', () => {
    render(<Step2_WorkExperience />);
    expect(screen.getByRole('button', { name: /Back/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Next Step/i })).toBeInTheDocument();
  });

  it('should add a new experience block when Add Experience is clicked', async () => {
    const user = userEvent.setup();
    render(<Step2_WorkExperience />);
    
    const addButton = screen.getByRole('button', { name: /Add Experience/i });
    await user.click(addButton);
    
    expect(screen.getByText('Experience #1')).toBeInTheDocument();
  });

  it('should show multiple experience blocks when adding multiple experiences', async () => {
    const user = userEvent.setup();
    render(<Step2_WorkExperience />);
    
    const addButton = screen.getByRole('button', { name: /Add Experience/i });
    await user.click(addButton);
    await user.click(addButton);
    
    expect(screen.getByText('Experience #1')).toBeInTheDocument();
    expect(screen.getByText('Experience #2')).toBeInTheDocument();
  });

  it('should not allow more than 10 experiences', async () => {
    const user = userEvent.setup();
    render(<Step2_WorkExperience />);
    
    const addButton = screen.getByRole('button', { name: /Add Experience/i });
    
    // Add 10 experiences
    for (let i = 0; i < 10; i++) {
      await user.click(addButton);
    }
    
    // Button should not be visible anymore
    expect(screen.queryByRole('button', { name: /Add Experience/i })).not.toBeInTheDocument();
  });

  it('should remove an experience block when delete button is clicked', async () => {
    const user = userEvent.setup();
    render(<Step2_WorkExperience />);
    
    // Add an experience
    const addButton = screen.getByRole('button', { name: /Add Experience/i });
    await user.click(addButton);
    
    expect(screen.getByText('Experience #1')).toBeInTheDocument();
    
    // Remove it
    const deleteButton = screen.getByTitle('Remove');
    await user.click(deleteButton);
    
    expect(screen.queryByText('Experience #1')).not.toBeInTheDocument();
  });

  it('should display "Current Position" when "I still work here" checkbox is checked', async () => {
    const user = userEvent.setup();
    render(<Step2_WorkExperience />);
    
    const addButton = screen.getByRole('button', { name: /Add Experience/i });
    await user.click(addButton);
    
    const checkbox = screen.getByLabelText(/I still work here/i);
    await user.click(checkbox);
    
    expect(screen.getByText('Current Position')).toBeInTheDocument();
  });

  it('should navigate back to personal info when Back button is clicked', async () => {
    const user = userEvent.setup();
    render(<Step2_WorkExperience />);
    
    const backButton = screen.getByRole('button', { name: /Back/i });
    await user.click(backButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('should navigate to questionnaire when Next Step is clicked with no experiences added', async () => {
    const user = userEvent.setup();
    render(<Step2_WorkExperience />);
    
    const nextButton = screen.getByRole('button', { name: /Next Step/i });
    await user.click(nextButton);
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/questionnaire');
    });
  });

  it('should show validation errors when required fields are empty', async () => {
    const user = userEvent.setup();
    render(<Step2_WorkExperience />);
    
    // Add an experience but leave fields empty
    const addButton = screen.getByRole('button', { name: /Add Experience/i });
    await user.click(addButton);
    
    const nextButton = screen.getByRole('button', { name: /Next Step/i });
    await user.click(nextButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Please fill in all required fields correctly/i)).toBeInTheDocument();
    });
  });

  it('should allow filling out experience fields', async () => {
    const user = userEvent.setup();
    render(<Step2_WorkExperience />);
    
    // Add an experience
    const addButton = screen.getByRole('button', { name: /Add Experience/i });
    await user.click(addButton);
    
    // Fill out the fields
    const companyInput = screen.getByLabelText(/Company/i);
    await user.type(companyInput, 'Test Company');
    expect(companyInput).toHaveValue('Test Company');
    
    const roleInput = screen.getByLabelText(/Role/i);
    await user.type(roleInput, 'Developer');
    expect(roleInput).toHaveValue('Developer');
  });

  it('should validate description has minimum 10 characters', async () => {
    const user = userEvent.setup();
    render(<Step2_WorkExperience />);
    
    const addButton = screen.getByRole('button', { name: /Add Experience/i });
    await user.click(addButton);
    
    // Fill required fields
    await user.type(screen.getByLabelText(/Company/i), 'Test Company');
    await user.type(screen.getByLabelText(/Role/i), 'Developer');
    await user.type(screen.getByLabelText(/Start Date/i), '2020-01-01');
    await user.type(screen.getByLabelText(/Description/i), 'Short'); // Less than 10 chars
    
    const nextButton = screen.getByRole('button', { name: /Next Step/i });
    await user.click(nextButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Description is required \(min 10 chars\)/i)).toBeInTheDocument();
    });
  });
});
