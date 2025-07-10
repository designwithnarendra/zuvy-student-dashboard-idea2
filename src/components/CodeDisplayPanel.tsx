import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, FileText, Check } from "lucide-react";
import { useState } from "react";

interface CodeDisplayPanelProps {
  code: string;
  language: string;
  title?: string;
  showLineNumbers?: boolean;
}

const CodeDisplayPanel = ({ 
  code, 
  language, 
  title = "Your Source Code",
  showLineNumbers = true 
}: CodeDisplayPanelProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const getLanguageColor = (lang: string) => {
    switch (lang.toLowerCase()) {
      case 'javascript': return 'bg-yellow-500';
      case 'python': return 'bg-blue-500';
      case 'java': return 'bg-red-500';
      case 'cpp': return 'bg-purple-500';
      case 'c': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getLanguageDisplay = (lang: string) => {
    switch (lang.toLowerCase()) {
      case 'javascript': return 'JavaScript';
      case 'python': return 'Python';
      case 'java': return 'Java';
      case 'cpp': return 'C++';
      case 'c': return 'C';
      default: return lang;
    }
  };

  // Simple syntax highlighting for JavaScript (can be expanded for other languages)
  const highlightSyntax = (code: string, language: string) => {
    if (language.toLowerCase() !== 'javascript') {
      return code; // Return plain code for non-JS languages for now
    }

    // Basic JavaScript syntax highlighting
    return code
      .replace(/\b(function|const|let|var|if|else|for|while|return|import|export|class|extends|async|await|try|catch|throw|new)\b/g, 
        '<span style="color: #569CD6;">$1</span>')
      .replace(/\b(true|false|null|undefined)\b/g, 
        '<span style="color: #569CD6;">$1</span>')
      .replace(/\b(\d+\.?\d*)\b/g, 
        '<span style="color: #B5CEA8;">$1</span>')
      .replace(/(["'].*?["'])/g, 
        '<span style="color: #CE9178;">$1</span>')
      .replace(/\/\/(.*?)$/gm, 
        '<span style="color: #6A9955;">// $1</span>')
      .replace(/\/\*(.*?)\*\//gs, 
        '<span style="color: #6A9955;">/*$1*/</span>');
  };

  const codeLines = code.split('\n');

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-purple-500" />
            <CardTitle className="text-lg">{title}</CardTitle>
            <Badge className={`${getLanguageColor(language)} text-white text-xs`}>
              {getLanguageDisplay(language)}
            </Badge>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="text-xs"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 mr-1" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 mr-1" />
                Copy
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {/* Dark IDE-like code container */}
        <div className="bg-gray-900 text-gray-100 rounded-b-lg overflow-hidden">
          {/* Code editor header */}
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 border-b border-gray-700">
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <span className="text-sm text-gray-400 ml-2">solution.{language === 'javascript' ? 'js' : language}</span>
          </div>
          
          {/* Code content */}
          <div className="p-4 overflow-x-auto">
            <pre className="text-sm leading-relaxed">
              {showLineNumbers ? (
                <table className="w-full">
                  <tbody>
                    {codeLines.map((line, index) => (
                      <tr key={index}>
                        <td className="text-gray-500 text-right pr-4 select-none w-12 align-top">
                          {index + 1}
                        </td>
                        <td className="align-top">
                          <span 
                            dangerouslySetInnerHTML={{ 
                              __html: highlightSyntax(line, language) || '&nbsp;' 
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <span 
                  dangerouslySetInnerHTML={{ 
                    __html: highlightSyntax(code, language) 
                  }}
                />
              )}
            </pre>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CodeDisplayPanel; 