import React from 'react';

const MonacoEditorMock = jest.fn().mockImplementation((props: any) => {
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
});

export default MonacoEditorMock;