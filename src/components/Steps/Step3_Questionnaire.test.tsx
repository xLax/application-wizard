import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '../../test/test-utils';
import { Step3_Questionnaire } from './Step3_Questionnaire';
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

describe('Step3_Questionnaire', () => {
    beforeEach(() => {
        mockNavigate.mockClear();
    });

    it('should render questionnaire form with title', () => {
        render(<Step3_Questionnaire />);
        expect(screen.getByText('Additional Information')).toBeInTheDocument();
    });

    it('should render all three questions', () => {
        render(<Step3_Questionnaire />);

        expect(screen.getByText(/legal work authorization constraints/i)).toBeInTheDocument();
        expect(screen.getByText(/available to start within 30 days/i)).toBeInTheDocument();
        expect(screen.getByText(/require relocation support/i)).toBeInTheDocument();
    });

    it('should render file upload section', () => {
        render(<Step3_Questionnaire />);
        expect(screen.getByText(/Upload CV/i)).toBeInTheDocument();
    });

    it('should render Back and Next Step buttons', () => {
        render(<Step3_Questionnaire />);
        expect(screen.getByRole('button', { name: /Back/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Next Step/i })).toBeInTheDocument();
    });

    it('should select radio button when clicked', async () => {
        const user = userEvent.setup();
        render(<Step3_Questionnaire />);

        const yesRadios = screen.getAllByLabelText('Yes');
        await user.click(yesRadios[0]);

        expect(yesRadios[0]).toBeChecked();
    });

    it('should show validation errors when Next is clicked without answering questions', async () => {
        const user = userEvent.setup();
        render(<Step3_Questionnaire />);

        const nextButton = screen.getByRole('button', { name: /Next Step/i });
        await user.click(nextButton);

        await waitFor(() => {
            expect(screen.getByText(/Please answer all questions and upload your CV/i)).toBeInTheDocument();
        });
    });

    it('should show error for each unanswered question', async () => {
        const user = userEvent.setup();
        render(<Step3_Questionnaire />);

        const nextButton = screen.getByRole('button', { name: /Next Step/i });
        await user.click(nextButton);

        await waitFor(() => {
            const errorMessages = screen.getAllByText(/Please answer this question/i);
            expect(errorMessages).toHaveLength(3);
        });
    });

    it('should display selected file name after file upload', async () => {
        const user = userEvent.setup();
        render(<Step3_Questionnaire />);

        const file = new File(['test content'], 'test-cv.pdf', { type: 'application/pdf' });
        const fileInput = screen.getByLabelText(/Upload a file/i);

        await user.upload(fileInput, file);

        await waitFor(() => {
            expect(screen.getByText(/Selected: test-cv.pdf/i)).toBeInTheDocument();
        });
    });

    it('should navigate back to work experience when Back button is clicked', async () => {
        const user = userEvent.setup();
        render(<Step3_Questionnaire />);

        const backButton = screen.getByRole('button', { name: /Back/i });
        await user.click(backButton);

        expect(mockNavigate).toHaveBeenCalledWith('/work-experience');
    });

    it('should navigate to summary when form is valid', async () => {
        const user = userEvent.setup();
        render(<Step3_Questionnaire />);

        // Answer all questions
        const yesRadios = screen.getAllByLabelText('Yes');
        await user.click(yesRadios[0]);
        await user.click(yesRadios[1]);
        await user.click(yesRadios[2]);

        // Upload file
        const file = new File(['test content'], 'test-cv.pdf', { type: 'application/pdf' });
        const fileInput = screen.getByLabelText(/Upload a file/i);
        await user.upload(fileInput, file);

        // Click Next
        const nextButton = screen.getByRole('button', { name: /Next Step/i });
        await user.click(nextButton);

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/summary');
        });
    });

    it('should clear error when user selects an answer', async () => {
        const user = userEvent.setup();
        render(<Step3_Questionnaire />);

        // Trigger validation errors
        const nextButton = screen.getByRole('button', { name: /Next Step/i });
        await user.click(nextButton);

        await waitFor(() => {
            expect(screen.getByText(/Please answer all questions and upload your CV/i)).toBeInTheDocument();
        });

        // Answer first question
        const noRadios = screen.getAllByLabelText('No');
        await user.click(noRadios[0]);

        // // Global error should be cleared
        expect(screen.queryByText(/Please answer all questions and upload your CV/i)).not.toBeInTheDocument();
    });

    it('should accept PDF files', async () => {
        const user = userEvent.setup();
        render(<Step3_Questionnaire />);

        const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
        const fileInput = screen.getByLabelText(/Upload a file/i);

        await user.upload(fileInput, file);

        await waitFor(() => {
            expect(screen.getByText(/Selected: test.pdf/i)).toBeInTheDocument();
        });
    });

    it('should accept DOCX files', async () => {
        const user = userEvent.setup();
        render(<Step3_Questionnaire />);

        const file = new File(['test content'], 'test.docx', {
            type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        });
        const fileInput = screen.getByLabelText(/Upload a file/i);

        await user.upload(fileInput, file);

        await waitFor(() => {
            expect(screen.getByText(/Selected: test.docx/i)).toBeInTheDocument();
        });
    });
});
