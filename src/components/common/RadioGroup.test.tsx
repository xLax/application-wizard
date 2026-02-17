import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '../../test/test-utils';
import { RadioGroup } from './RadioGroup';
import userEvent from '@testing-library/user-event';


beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});

describe('RadioGroup', () => {
  const defaultProps = {
    label: 'Test Question',
    name: 'test-question',
    selectedValue: '',
    onChange: vi.fn(),
  };

  it('should render radio group with label', () => {
    render(<RadioGroup {...defaultProps} />);
    expect(screen.getByText('Test Question')).toBeInTheDocument();
  });

  it('should render default options (Yes/No) when no options provided', () => {
    render(<RadioGroup {...defaultProps} />);
    expect(screen.getByLabelText('Yes')).toBeInTheDocument();
    expect(screen.getByLabelText('No')).toBeInTheDocument();
  });

  it('should render custom options when provided', () => {
    const customOptions = [
      { label: 'Option A', value: 'a' },
      { label: 'Option B', value: 'b' },
      { label: 'Option C', value: 'c' },
    ];
    render(<RadioGroup {...defaultProps} options={customOptions} />);
    
    expect(screen.getByLabelText('Option A')).toBeInTheDocument();
    expect(screen.getByLabelText('Option B')).toBeInTheDocument();
    expect(screen.getByLabelText('Option C')).toBeInTheDocument();
  });

  it('should check the selected radio button', () => {
    render(<RadioGroup {...defaultProps} selectedValue="yes" />);
    const yesRadio = screen.getByLabelText('Yes') as HTMLInputElement;
    const noRadio = screen.getByLabelText('No') as HTMLInputElement;
    
    expect(yesRadio.checked).toBe(true);
    expect(noRadio.checked).toBe(false);
  });

  it('should call onChange when a radio button is clicked', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<RadioGroup {...defaultProps} onChange={handleChange} />);
    
    const yesRadio = screen.getByLabelText('Yes');
    await user.click(yesRadio);
    
    expect(handleChange).toHaveBeenCalledWith('yes');
  });

  it('should display error message when error prop is provided', () => {
    render(<RadioGroup {...defaultProps} error="Please select an option" />);
    expect(screen.getByText('Please select an option')).toBeInTheDocument();
  });

  it('should not display error message when error prop is not provided', () => {
    render(<RadioGroup {...defaultProps} />);
    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
  });

  it('should have correct name attribute for all radio inputs', () => {
    render(<RadioGroup {...defaultProps} name="test-group" />);
    const radios = screen.getAllByRole('radio');
    
    radios.forEach((radio: HTMLElement) => {
      expect((radio as HTMLInputElement).name).toBe('test-group');
    });
  });

  it('should allow changing selection between options', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<RadioGroup {...defaultProps} onChange={handleChange} selectedValue="" />);
    
    const yesRadio = screen.getByLabelText('Yes');
    const noRadio = screen.getByLabelText('No');
    
    await user.click(yesRadio);
    expect(handleChange).toHaveBeenCalledWith('yes');
    
    await user.click(noRadio);
    expect(handleChange).toHaveBeenCalledWith('no');
  });
});
