import '@testing-library/jest-dom';
import React from 'react';

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}));

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

// Mock Monaco Editor
jest.mock('@monaco-editor/react', () => {
    return {
        __esModule: true,
        default: jest.fn().mockImplementation((props: any) => {
            const { value, onChange } = props;

            return React.createElement('div', {
                'data-testid': 'monaco-editor-mock',
                children: React.createElement('textarea', {
                    value: value,
                    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        onChange?.(e.target.value),
                    className: 'w-full h-full',
                })
            });
        }),
    };
});

// Make sure React is available in the global scope
global.React = React;