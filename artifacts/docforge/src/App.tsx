import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Book,
  GitPullRequest,
  Rocket,
  Copy,
  Download,
  Loader2,
  Upload,
  Sparkles,
  Check,
} from "lucide-react";
import { useGenerateDocs } from "@workspace/api-client-react";
import type { DocFormat } from "@workspace/api-zod";
import { cn } from "./lib/utils";

const DOC_FORMATS: {
  value: DocFormat;
  label: string;
  description: string;
  icon: typeof FileText;
}[] = [
  {
    value: "readme",
    label: "README",
    description: "Project documentation",
    icon: FileText,
  },
  {
    value: "api-reference",
    label: "API Reference",
    description: "Endpoint documentation",
    icon: Book,
  },
  {
    value: "changelog",
    label: "Changelog",
    description: "Version history",
    icon: GitPullRequest,
  },
  {
    value: "onboarding",
    label: "Onboarding",
    description: "Developer guide",
    icon: Rocket,
  },
];

export default function App() {
  const [content, setContent] = useState("");
  const [selectedFormat, setSelectedFormat] = useState<DocFormat>("readme");
  const [generatedDocs, setGeneratedDocs] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const generateMutation = useGenerateDocs();

  const handleGenerate = async () => {
    if (!content.trim()) return;

    try {
      const result = await generateMutation.mutateAsync({
        content,
        format: selectedFormat,
      });
      setGeneratedDocs(result.documentation);
    } catch (error) {
      console.error("Generation failed:", error);
    }
  };

  const handleCopy = useCallback(async () => {
    if (!generatedDocs) return;
    await navigator.clipboard.writeText(generatedDocs);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [generatedDocs]);

  const handleDownload = useCallback(() => {
    if (!generatedDocs) return;
    const blob = new Blob([generatedDocs], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedFormat}-documentation.md`;
    a.click();
    URL.revokeObjectURL(url);
  }, [generatedDocs, selectedFormat]);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    const textContents: string[] = [];
    for (const file of files) {
      if (file.type.startsWith("text/") || file.name.match(/\.(ts|tsx|js|jsx|json|yaml|yml|md|py|go|rs|java|c|cpp|h|hpp)$/)) {
        const text = await file.text();
        textContents.push(`// File: ${file.name}\n${text}`);
      }
    }

    if (textContents.length > 0) {
      setContent((prev) => (prev ? `${prev}\n\n${textContents.join("\n\n")}` : textContents.join("\n\n")));
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">DocForge</h1>
                <p className="text-sm text-muted-foreground">AI Documentation Generator</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Input Panel */}
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="mb-4 text-lg font-medium text-foreground">Source Content</h2>
              <p className="mb-4 text-sm text-muted-foreground">
                Paste your code, OpenAPI specs, PR diffs, or deploy notes below
              </p>

              {/* Format Selection */}
              <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {DOC_FORMATS.map((format) => {
                  const Icon = format.icon;
                  const isSelected = selectedFormat === format.value;
                  return (
                    <button
                      key={format.value}
                      onClick={() => setSelectedFormat(format.value)}
                      className={cn(
                        "flex flex-col items-center gap-2 rounded-lg border p-3 transition-all",
                        isSelected
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:bg-secondary"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-xs font-medium">{format.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Text Area */}
              <div
                className={cn(
                  "relative rounded-lg border transition-all",
                  isDragOver ? "border-primary bg-primary/5" : "border-border"
                )}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Paste your content here or drag & drop files..."
                  className="h-80 w-full resize-none rounded-lg bg-card p-4 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                {isDragOver && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-primary/10">
                    <div className="flex flex-col items-center gap-2 text-primary">
                      <Upload className="h-8 w-8" />
                      <span className="text-sm font-medium">Drop files here</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Character count */}
              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>{content.length.toLocaleString()} characters</span>
                <span>Max: 100,000</span>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={!content.trim() || generateMutation.isPending}
              className={cn(
                "flex items-center justify-center gap-2 rounded-lg px-6 py-3 font-medium transition-all",
                content.trim() && !generateMutation.isPending
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "cursor-not-allowed bg-muted text-muted-foreground"
              )}
            >
              {generateMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Documentation
                </>
              )}
            </button>

            {generateMutation.isError && (
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
                {generateMutation.error?.message || "Failed to generate documentation. Please try again."}
              </div>
            )}
          </div>

          {/* Output Panel */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-foreground">Generated Documentation</h2>
              {generatedDocs && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 text-success" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 rounded-lg border border-border bg-card">
              <AnimatePresence mode="wait">
                {generateMutation.isPending ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex h-80 flex-col items-center justify-center gap-4 text-muted-foreground"
                  >
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm">Generating your documentation...</p>
                  </motion.div>
                ) : generatedDocs ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="h-[500px] overflow-auto p-4"
                  >
                    <pre className="whitespace-pre-wrap font-mono text-sm text-foreground">
                      {generatedDocs}
                    </pre>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex h-80 flex-col items-center justify-center gap-4 text-muted-foreground"
                  >
                    <FileText className="h-12 w-12 opacity-30" />
                    <div className="text-center">
                      <p className="font-medium">No documentation yet</p>
                      <p className="text-sm">Paste content and click Generate to create documentation</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
