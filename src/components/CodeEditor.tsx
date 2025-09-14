import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface CodeEditorProps {
  code: string;
  language?: string;
  title?: string;
  readOnly?: boolean;
}

const CodeEditor = ({ code, language = "cpp", title, readOnly = true }: CodeEditorProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success("Code copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy code");
    }
  };

  const handleRun = () => {
    toast.success("Code execution started!", {
      description: "Simulating C++ compilation and execution..."
    });
    
    // Add running animation to code editor
    const codeElement = document.querySelector('.code-editor');
    if (codeElement) {
      codeElement.classList.add('code-editor-running');
      setTimeout(() => {
        codeElement.classList.remove('code-editor-running');
        toast.success("Execution completed successfully!");
      }, 2000);
    }
  };

  return (
    <Card className="overflow-hidden">
      {title && (
        <div className="bg-muted px-4 py-2 border-b">
          <h4 className="text-sm font-medium">{title}</h4>
        </div>
      )}
      
      <div className="relative">
        {/* Code Display */}
        <pre className="code-editor overflow-x-auto max-h-96">
          <code className="text-sm">{code}</code>
        </pre>
        
        {/* Action Buttons */}
        <div className="absolute top-2 right-2 flex space-x-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={handleCopy}
            className="h-8 w-8 p-0 bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/50 transition-all duration-200"
          >
            {copied ? (
              <Check className="w-3 h-3 text-cp-easy" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </Button>
          
          <Button
            size="sm"
            onClick={handleRun}
            className="h-8 w-8 p-0 bg-gradient-to-r from-cp-easy to-secondary text-primary-foreground hover:shadow-[var(--shadow-glow-secondary)] transition-all duration-200"
          >
            <Play className="w-3 h-3" />
          </Button>
        </div>
      </div>
      
      {/* Output Section */}
      <div className="bg-muted/30 border-t border-border p-3 text-xs">
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-accent font-medium">Output:</span>
        </div>
        <div className="font-mono text-muted-foreground">
          {/* Sample output */}
          <div className="text-cp-easy">Compilation successful ✓</div>
          <div>Runtime: <span className="text-primary">0.02s</span></div>
          <div>Memory: <span className="text-secondary">1024KB</span></div>
        </div>
      </div>
    </Card>
  );
};

export default CodeEditor;