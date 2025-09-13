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
    toast.info("Code execution simulation started...", {
      description: "In a real implementation, this would compile and run the C++ code."
    });
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
            className="h-8 w-8 p-0"
          >
            {copied ? (
              <Check className="w-3 h-3 text-green-400" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </Button>
          
          <Button
            size="sm"
            onClick={handleRun}
            className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700"
          >
            <Play className="w-3 h-3" />
          </Button>
        </div>
      </div>
      
      {/* Output Section */}
      <div className="bg-slate-800 text-green-400 p-3 text-xs border-t">
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-yellow-400">Output:</span>
        </div>
        <div className="font-mono">
          {/* Sample output */}
          <div>Compilation successful ✓</div>
          <div>Runtime: 0.02s</div>
          <div>Memory: 1024KB</div>
        </div>
      </div>
    </Card>
  );
};

export default CodeEditor;