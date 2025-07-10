import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, MemoryStick } from "lucide-react";

interface TestCaseResultProps {
  testCase: {
    id: string;
    status: 'passed' | 'failed';
    input: string;
    expectedOutput: string;
    actualOutput?: string;
    executionTime?: number;
    memoryUsed?: number;
  };
  index: number;
}

const TestCaseResultCard = ({ testCase, index }: TestCaseResultProps) => {
  const isPassed = testCase.status === 'passed';
  
  const formatTime = (ms?: number) => {
    if (!ms) return 'N/A';
    return ms < 1000 ? `${ms} ms` : `${(ms / 1000).toFixed(3)} s`;
  };

  const formatMemory = (bytes?: number) => {
    if (!bytes) return 'N/A';
    if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    } else if (bytes >= 1024) {
      return `${(bytes / 1024).toFixed(2)} KB`;
    }
    return `${bytes} B`;
  };

  return (
    <Card className={`border-l-4 ${
      isPassed 
        ? 'border-l-success bg-success-light/10' 
        : 'border-l-destructive bg-destructive-light/10'
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            {isPassed ? (
              <CheckCircle className="w-5 h-5 text-success" />
            ) : (
              <XCircle className="w-5 h-5 text-destructive" />
            )}
            Test Case {index + 1}
          </CardTitle>
          <Badge 
            variant={isPassed ? "default" : "destructive"}
            className="text-xs font-medium"
          >
            {isPassed ? 'PASSED' : 'FAILED'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Test Data */}
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-sm font-medium text-muted-foreground">Input</label>
            <div className="bg-muted p-3 rounded-md font-mono text-sm">
              {testCase.input}
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-muted-foreground">Expected Output</label>
            <div className="bg-muted p-3 rounded-md font-mono text-sm">
              {testCase.expectedOutput}
            </div>
          </div>
          
          {testCase.actualOutput && (
            <div className="space-y-1">
              <label className={`text-sm font-medium ${
                isPassed ? 'text-success' : 'text-destructive'
              }`}>
                Your Output
              </label>
              <div className={`p-3 rounded-md font-mono text-sm ${
                isPassed 
                  ? 'bg-success-light/20 text-success' 
                  : 'bg-destructive-light/20 text-destructive'
              }`}>
                {testCase.actualOutput || 'None'}
              </div>
            </div>
          )}
        </div>

        {/* Performance Metrics */}
        {(testCase.executionTime || testCase.memoryUsed) && (
          <div className="flex gap-4 pt-2 border-t">
            {testCase.executionTime && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{formatTime(testCase.executionTime)}</span>
              </div>
            )}
            {testCase.memoryUsed && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MemoryStick className="w-4 h-4" />
                <span>{formatMemory(testCase.memoryUsed)}</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TestCaseResultCard; 