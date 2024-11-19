// src/components/JsonEditor/JsonEditor.test.tsx
import { render, screen } from '@testing-library/react';
import JsonEditor from './JsonEditor';
import { defaultSchema } from '@/constants/defaultSchema';

describe('JsonEditor', () => {
    const mockOnChange = jest.fn();

    it('renders with initial value', () => {
        render(
            <JsonEditor
                initialValue={defaultSchema}
                onChange={mockOnChange}
                isValid={true}
            />
        );

        expect(screen.getByTestId('monaco-editor-mock')).toBeInTheDocument();
    });
});

