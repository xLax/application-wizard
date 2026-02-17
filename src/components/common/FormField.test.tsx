import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '../../test/test-utils';
import { FormField } from './FormField';
import userEvent from '@testing-library/user-event';

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});

describe('FormField', () => {
  it('should render input field with label', () => {
    render(<FormField label="Test Label" />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should render textarea when textarea prop is true', () => {
    render(<FormField label="Test Label" textarea />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    const textarea = screen.getByRole('textbox');
    expect(textarea.tagName).toBe('TEXTAREA');
  });

  it('should display error message when error prop is provided', () => {
    render(<FormField label="Test Label" error="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('should not display error message when error prop is not provided', () => {
    render(<FormField label="Test Label" />);
    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
  });

  it('should apply error class to input when error is present', () => {
    render(<FormField label="Test Label" error="Error message" />);
    const input = screen.getByRole('textbox');
    expect(input.className).toContain('error');
  });

  it('should call onChange handler when input value changes', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<FormField label="Test Label" onChange={handleChange} />);
    
    const input = screen.getByRole('textbox');
    await user.type(input, 'test value');
    
    expect(handleChange).toHaveBeenCalled();
  });

  it('should display placeholder text', () => {
    render(<FormField label="Test Label" placeholder="Enter text here" />);
    expect(screen.getByPlaceholderText('Enter text here')).toBeInTheDocument();
  });

  it('should pass through custom className', () => {
    render(<FormField label="Test Label" className="custom-class" />);
    const input = screen.getByRole('textbox');
    expect(input.className).toContain('custom-class');
  });

  it('should pass through input attributes', () => {
    render(<FormField label="Test Label" type="email" name="email" value="test@example.com" readOnly />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.type).toBe('email');
    expect(input.name).toBe('email');
    expect(input.value).toBe('test@example.com');
    expect(input.readOnly).toBe(true);
  });
});
