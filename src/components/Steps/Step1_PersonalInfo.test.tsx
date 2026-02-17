import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '../../test/test-utils';
import { Step1_PersonalInfo } from './Step1_PersonalInfo';
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

describe('Step1_PersonalInfo', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('should render personal information form with all fields', () => {
    render(<Step1_PersonalInfo />);
    
    expect(screen.getByText('Personal Information')).toBeInTheDocument();
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/City/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Country/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/LinkedIn URL/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/GitHub URL/i)).toBeInTheDocument();
  });

  it('should have a Next Step button', () => {
    render(<Step1_PersonalInfo />);
    expect(screen.getByRole('button', { name: /Next Step/i })).toBeInTheDocument();
  });

  it('should update form values on input change', async () => {
    const user = userEvent.setup();
    render(<Step1_PersonalInfo />);
    
    const nameInput = screen.getByLabelText(/Full Name/i) as HTMLInputElement;
    await user.type(nameInput, 'John Doe');
    
    expect(nameInput.value).toBe('John Doe');
  });

  it('should show validation errors when Next is clicked with empty required fields', async () => {
    const user = userEvent.setup();
    render(<Step1_PersonalInfo />);
    
    const nextButton = screen.getByRole('button', { name: /Next Step/i });
    await user.click(nextButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Full Name is required/i)).toBeInTheDocument();
    });
  });

  it('should show error for invalid email', async () => {
    const user = userEvent.setup();
    render(<Step1_PersonalInfo />);
    
    const emailInput = screen.getByLabelText(/Email/i);
    await user.type(emailInput, 'invalid-email');
    
    const nextButton = screen.getByRole('button', { name: /Next Step/i });
    await user.click(nextButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Invalid email address/i)).toBeInTheDocument();
    });
  });

  it('should show error for invalid phone number', async () => {
    const user = userEvent.setup();
    render(<Step1_PersonalInfo />);
    
    const phoneInput = screen.getByLabelText(/Phone/i);
    await user.type(phoneInput, 'abc123'); // Contains letters
    
    const nextButton = screen.getByRole('button', { name: /Next Step/i });
    await user.click(nextButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Phone can only contain plus \(\+\) and numbers/i)).toBeInTheDocument();
    });
  });

  it('should clear error when user starts typing in a field', async () => {
    const user = userEvent.setup();
    render(<Step1_PersonalInfo />);
    
    // Trigger validation error
    const nextButton = screen.getByRole('button', { name: /Next Step/i });
    await user.click(nextButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Full Name is required/i)).toBeInTheDocument();
    });
    
    // Start typing in the field
    const nameInput = screen.getByLabelText(/Full Name/i);
    await user.type(nameInput, 'J');
    
    // Error should be cleared
    expect(screen.queryByText(/Full Name is required/i)).not.toBeInTheDocument();
  });

  it('should navigate to work experience page when form is valid', async () => {
    const user = userEvent.setup();
    render(<Step1_PersonalInfo />);
    
    // Fill in all required fields
    await user.type(screen.getByLabelText(/Full Name/i), 'John Doe');
    await user.type(screen.getByLabelText(/Email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/Phone/i), '+1234567890');
    await user.type(screen.getByLabelText(/City/i), 'New York');
    await user.type(screen.getByLabelText(/Country/i), 'USA');
    
    const nextButton = screen.getByRole('button', { name: /Next Step/i });
    await user.click(nextButton);
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/work-experience');
    });
  });

  it('should accept optional fields as empty', async () => {
    const user = userEvent.setup();
    render(<Step1_PersonalInfo />);
    
    // Fill only required fields
    await user.type(screen.getByLabelText(/Full Name/i), 'John Doe');
    await user.type(screen.getByLabelText(/Email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/Phone/i), '+1234567890');
    await user.type(screen.getByLabelText(/City/i), 'New York');
    await user.type(screen.getByLabelText(/Country/i), 'USA');
    // Leave LinkedIn and GitHub empty
    
    const nextButton = screen.getByRole('button', { name: /Next Step/i });
    await user.click(nextButton);
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/work-experience');
    });
  });
});
