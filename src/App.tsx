// src/App.tsx
import { useState, useEffect } from "react";
import JsonEditor from "./components/JsonEditor/JsonEditor";
import FormPreview from "./components/FormPreview/FormPreview";
import { defaultSchema } from "./constants/defaultSchema";
import { Schema } from "./types/schema";
import { Button } from "./components/ui/Button/Button";
import {
  Moon,
  Sun,
  Copy,
  Download,
  Code2,
  FileEdit,
  CheckCircle2,
  XCircle
} from "lucide-react";

const App = () => {
  const [schema, setSchema] = useState<Schema>(defaultSchema);
  const [isValid, setIsValid] = useState(true);
  const [submittedData, setSubmittedData] = useState<any[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');

  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const handleSchemaChange = (newSchema: Schema, isValidJson: boolean) => {
    setIsValid(isValidJson);
    if (isValidJson) {
      setSchema(newSchema);
    }
  };

  const handleFormSubmit = (data: any) => {
    const submissionData = {
      ...data,
      timestamp: new Date().toISOString(),
    };
    setSubmittedData(prev => [...prev, submissionData]);
  };

  const handleCopyJson = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(schema, null, 2));
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleDownloadSubmissions = () => {
    const dataStr = JSON.stringify(submittedData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `form-submissions-${new Date().toISOString()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Code2 className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Form Generator</span>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="rounded-full"
            >
              {isDarkMode ?
                <Sun className="h-5 w-5" /> :
                <Moon className="h-5 w-5" />
              }
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto p-6">
        {/* Mobile Tabs */}
        <div className="mb-6 flex rounded-lg border p-1 lg:hidden">
          <button
            onClick={() => setActiveTab('editor')}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${activeTab === 'editor'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-muted'
              }`}
          >
            JSON Editor
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${activeTab === 'preview'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-muted'
              }`}
          >
            Form Preview
          </button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* JSON Editor Section */}
          <div className={`rounded-lg border bg-card shadow-sm transition-all ${activeTab === 'preview' ? 'hidden lg:block' : ''
            }`}>
            <div className="border-b p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileEdit className="h-5 w-5 text-muted-foreground" />
                  <h2 className="font-semibold">JSON Schema Editor</h2>
                </div>
                <div className="flex items-center gap-2">
                  {isValid ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyJson}
                    className="flex items-center gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    {copySuccess ? "Copied!" : "Copy"}
                  </Button>
                </div>
              </div>
            </div>
            <div className="p-4">
              <JsonEditor
                initialValue={schema}
                onChange={handleSchemaChange}
                isValid={isValid}
                theme={isDarkMode ? 'vs-dark' : 'light'}
              />
            </div>
            {submittedData.length > 0 && (
              <div className="border-t p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Submissions</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadSubmissions}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
                <div className="max-h-60 space-y-2 overflow-y-auto rounded-lg border bg-muted/50 p-2">
                  {submittedData.map((data, index) => (
                    <div key={index} className="rounded-md border bg-card p-3 text-sm shadow-sm">
                      <div className="mb-1 text-xs text-muted-foreground">
                        {new Date(data.timestamp).toLocaleString()}
                      </div>
                      <pre className="overflow-auto text-xs">
                        {JSON.stringify(data, null, 2)}
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Form Preview Section */}
          <div className={`rounded-lg border bg-card shadow-sm transition-all ${activeTab === 'editor' ? 'hidden lg:block' : ''
            }`}>
            <div className="border-b p-4">
              <div className="flex items-center gap-2">
                <FileEdit className="h-5 w-5 text-muted-foreground" />
                <h2 className="font-semibold">Form Preview</h2>
              </div>
            </div>
            <div className="p-4">
              <FormPreview
                schema={schema}
                onSubmit={handleFormSubmit}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
