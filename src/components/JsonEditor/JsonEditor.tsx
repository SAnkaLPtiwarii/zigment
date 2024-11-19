// src/components/JsonEditor/JsonEditor.tsx
import { useCallback } from "react";
import Editor from "@monaco-editor/react";
import { Schema } from "@/types/schema";

interface JsonEditorProps {
    initialValue: Schema;
    onChange: (schema: Schema, isValid: boolean) => void;
    isValid: boolean;
    theme?: 'vs-dark' | 'light';
}

const JsonEditor = ({ initialValue, onChange, isValid, theme = 'vs-dark' }: JsonEditorProps) => {
    const handleEditorChange = useCallback(
        (value: string | undefined) => {
            if (!value) return;

            try {
                const parsed = JSON.parse(value);
                onChange(parsed, true);
            } catch (error) {
                onChange(initialValue, false);
            }
        },
        [onChange, initialValue]
    );

    return (
        <div className="relative h-[600px] rounded-md border">
            <Editor
                height="100%"
                defaultLanguage="json"
                defaultValue={JSON.stringify(initialValue, null, 2)}
                onChange={handleEditorChange}
                theme={theme}
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    formatOnPaste: true,
                    formatOnType: true,
                    scrollBeyondLastLine: false,
                    wordWrap: "on",
                    wrappingIndent: "indent",
                }}
            />
            {!isValid && (
                <div className="absolute bottom-0 left-0 right-0 bg-destructive p-2 text-sm text-destructive-foreground">
                    Invalid JSON schema format
                </div>
            )}
        </div>
    );
};

export default JsonEditor;