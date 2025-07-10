import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, CheckCircle, XCircle } from "lucide-react";
import CodeDisplayPanel from "./CodeDisplayPanel";
import TestCaseResultCard from "./TestCaseResultCard";

interface CodingChallengeSolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  challenge: {
    title: string;
    difficulty: string;
    marks: number;
  };
  solutionCode: string;
}

const CodingChallengeSolutionModal = ({ 
  isOpen, 
  onClose, 
  challenge,
  solutionCode
}: CodingChallengeSolutionModalProps) => {
  
  // Mock test cases for display
  const testCases: Array<{
    id: string;
    status: 'passed' | 'failed';
    input: string;
    expectedOutput: string;
    actualOutput?: string;
    executionTime?: number;
    memoryUsed?: number;
  }> = [
    { 
      id: '1', 
      status: 'passed', 
      input: '[-2, 1, -3, 4, -1, 2, 1, -5, 4]', 
      expectedOutput: '6', 
      actualOutput: '6',
      executionTime: 98,
      memoryUsed: 7892
    },
    { 
      id: '2', 
      status: 'passed', 
      input: '[1]', 
      expectedOutput: '1', 
      actualOutput: '1',
      executionTime: 45,
      memoryUsed: 6124
    },
    { 
      id: '3', 
      status: 'passed', 
      input: '[5, 4, -1, 7, 8]', 
      expectedOutput: '23', 
      actualOutput: '23',
      executionTime: 127,
      memoryUsed: 8456
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">Solution Viewer - {challenge.title}</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-150px)]">
          {/* Student Code - Left Column */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Your Solution</h3>
            <div className="h-full">
              <CodeDisplayPanel 
                code={solutionCode}
                language="javascript"
                title="Solution Implementation"
              />
            </div>
          </div>

          {/* Test Results - Right Column */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Test Results</h3>
            <div className="h-[calc(100vh-200px)] overflow-y-auto space-y-4">
              {testCases.map((testCase, index) => (
                <TestCaseResultCard 
                  key={testCase.id}
                  testCase={testCase}
                  index={index}
                />
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CodingChallengeSolutionModal; 