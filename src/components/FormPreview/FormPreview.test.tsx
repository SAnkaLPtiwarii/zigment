// src/components/FormPreview/FormPreview.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormPreview from './FormPreview';
import { defaultSchema } from '@/constants/defaultSchema';

describe('FormPreview Component', () => {
    const mockOnSubmit = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders form with title and description', () => {
        render(<FormPreview schema={defaultSchema} onSubmit={mockOnSubmit} />);

        expect(screen.getByText(defaultSchema.formTitle)).toBeInTheDocument();
        expect(screen.getByText(defaultSchema.formDescription)).toBeInTheDocument();
    });

    it('renders all form fields', () => {
        render(<FormPreview schema={defaultSchema} onSubmit={mockOnSubmit} />);

        defaultSchema.fields.forEach(field => {
            expect(screen.getByText(field.label)).toBeInTheDocument();
            if (field.placeholder) {
                expect(screen.getByPlaceholderText(field.placeholder)).toBeInTheDocument();
            }
        });
    });

    it('shows validation errors for required fields', async () => {
        render(<FormPreview schema={defaultSchema} onSubmit={mockOnSubmit} />);

        const submitButton = screen.getByRole('button', { name: /submit/i });
        await userEvent.click(submitButton);

        defaultSchema.fields
            .filter(field => field.required)
            .forEach(() => {
                expect(screen.getByText(/this field is required/i)).toBeInTheDocument();
            });
    });

    it('submits form with valid data', async () => {
        render(<FormPreview schema={defaultSchema} onSubmit={mockOnSubmit} />);

        await userEvent.type(
            screen.getByPlaceholderText(/enter your full name/i),
            'John Doe'
        );

        await userEvent.type(
            screen.getByPlaceholderText(/you@example.com/i),
            'john@example.com'
        );

        const submitButton = screen.getByRole('button', { name: /submit/i });
        await userEvent.click(submitButton);

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalled();
        });
    });
});
