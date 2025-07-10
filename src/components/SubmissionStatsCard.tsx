import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MemoryStick, CheckCircle, XCircle } from "lucide-react";

interface SubmissionStatsCardProps {
  testResults: { passed: number; total: number };
  memoryUsage: string;
  executionTime: string;
}

const SubmissionStatsCard = ({ testResults, memoryUsage, executionTime }: SubmissionStatsCardProps) => {
  const getStatusVariant = () => {
    if (testResults.passed === testResults.total) return "default";
    if (testResults.passed === 0) return "destructive";
    return "secondary";
  };

  const getStatusIcon = () => {
    if (testResults.passed === testResults.total) return <CheckCircle className="w-4 h-4" />;
    return <XCircle className="w-4 h-4" />;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {/* Test Results */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Test Cases</p>
              <div className="flex items-center gap-2 mt-1">
                {getStatusIcon()}
                <span className="text-2xl font-bold">
                  {testResults.passed}/{testResults.total}
                </span>
              </div>
            </div>
            <Badge variant={getStatusVariant()} className="text-xs">
              {testResults.passed === testResults.total 
                ? "All Passed" 
                : testResults.passed === 0 
                ? "All Failed" 
                : "Partial"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Memory Usage */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Memory Usage</p>
              <div className="flex items-center gap-2 mt-1">
                <MemoryStick className="w-4 h-4 text-blue-500" />
                <span className="text-2xl font-bold">{memoryUsage}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Execution Time */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Execution Time</p>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="w-4 h-4 text-green-500" />
                <span className="text-2xl font-bold">{executionTime}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubmissionStatsCard; 