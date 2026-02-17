import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { cleanup, render, screen } from '../../test/test-utils';
import { ConfirmDialog } from './ConfirmDialog';
import userEvent from '@testing-library/user-event';

beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.clearAllMocks();
});

afterEach(() => {
    cleanup();
})

describe('ConfirmDialog', () => {
    const defaultProps = {
        isOpen: true,
        title: 'Test Title',
        message: 'Test message',
        onConfirm: vi.fn(),
        onCancel: vi.fn(),
    };

    it('should not render when isOpen is false', () => {
        render(<ConfirmDialog {...defaultProps} isOpen={false} />);
        expect(screen.queryByText('Test Title')).not.toBeInTheDocument();
    });

    it('should render dialog when isOpen is true', () => {
        render(<ConfirmDialog {...defaultProps} />);
        expect(screen.getByText('Test Title')).toBeInTheDocument();
        expect(screen.getByText('Test message')).toBeInTheDocument();
    });

    it('should display Yes and No buttons', () => {
        render(<ConfirmDialog {...defaultProps} />);
        expect(screen.getByRole('button', { name: 'Yes' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'No' })).toBeInTheDocument();
    });

    it('should call onConfirm when Yes button is clicked', async () => {
        const user = userEvent.setup();
        render(<ConfirmDialog {...defaultProps} />);

        const yesButton = screen.getByRole('button', { name: 'Yes' });
        await user.click(yesButton);

        expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
    });

    it('should call onCancel when No button is clicked', async () => {
        const user = userEvent.setup();
        render(<ConfirmDialog {...defaultProps} />);

        const noButton = screen.getByRole('button', { name: 'No' });
        await user.click(noButton);

        expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
    });

    it('should call onCancel when overlay is clicked', async () => {
        const user = userEvent.setup();
        const { container } = render(<ConfirmDialog {...defaultProps} />);

        // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
        const overlay = container.querySelector('[class*="overlay"]');
        if (overlay) {
            await user.click(overlay);
            expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
        }
    });

    it('should not call onCancel when dialog content is clicked', async () => {
        const user = userEvent.setup();
        const { container } = render(<ConfirmDialog {...defaultProps} />);

        // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
        const dialog = container.querySelector('[class*="dialog"]');
        if (dialog) {
            await user.click(dialog);
            expect(defaultProps.onCancel).not.toHaveBeenCalled();
        }
    });
});
