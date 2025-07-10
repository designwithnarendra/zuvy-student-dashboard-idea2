import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "@/lib/ThemeProvider";
import { mockCourses } from "@/lib/mockData";
import CodeDisplayPanel from "@/components/CodeDisplayPanel";
import TestCaseResultCard from "@/components/TestCaseResultCard";
import SubmissionStatsCard from "@/components/SubmissionStatsCard";

const SolutionViewerPage = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const { lockTheme, unlockTheme } = useTheme();
  const [problemData, setProblemData] = useState<any>(null);

  // Load problem data and lock theme
  useEffect(() => {
    // Lock theme during solution viewing for consistency
    lockTheme();
    
    // Find the problem in mock data
    for (const course of mockCourses) {
      for (const module of course.modules) {
        for (const topic of module.topics) {
          const item = topic.items.find(item => item.id === itemId);
          if (item && item.type === 'coding-problem') {
            setProblemData({
              ...item,
              courseId: course.id,
              moduleId: module.id
            });
            break;
          }
        }
      }
    }

    // Cleanup function to unlock theme when leaving solution viewer
    return () => {
      unlockTheme();
    };
  }, [itemId, lockTheme, unlockTheme]);

  const handleBack = () => {
    unlockTheme(); // Unlock theme before navigating away
    if (problemData) {
      navigate(`/course/${problemData.courseId}/module/${problemData.moduleId}`);
    } else {
      window.close(); // Close the tab if opened in new tab
    }
  };

  if (!problemData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading Solution...</h2>
          <p className="text-muted-foreground">Please wait while we load the solution.</p>
        </div>
      </div>
    );
  }

  const problemDescription = `
Given an array of integers, find the maximum sum of any contiguous subarray.

Example:
Input: [-2, 1, -3, 4, -1, 2, 1, -5, 4]
Output: 6
Explanation: The subarray [4, -1, 2, 1] has the largest sum = 6.

Constraints:
- 1 ≤ array length ≤ 10^5
- -10^4 ≤ array[i] ≤ 10^4

Function signature:
function maxSubarraySum(nums) {
    // Your code here
}
  `;

  const submittedCode = `function maxSubarraySum(nums) {
    let maxSum = nums[0];
    let currentSum = nums[0];
    
    for (let i = 1; i < nums.length; i++) {
        currentSum = Math.max(nums[i], currentSum + nums[i]);
        maxSum = Math.max(maxSum, currentSum);
    }
    
    return maxSum;
}`;

  // Mock submission data with realistic metrics
  const submissionData: {
    status: 'passed' | 'failed' | 'partial';
    memoryUsage: { peak: number; unit: string };
    executionTime: { total: number; unit: string };
    testResults: { passed: number; total: number };
    submittedCode: string;
    language: string;
    submissionTime: string;
  } = {
    status: 'failed',
    memoryUsage: { peak: 48008, unit: 'bytes' },
    executionTime: { total: 697, unit: 'ms' },
    testResults: { passed: 0, total: 6 },
    submittedCode,
    language: 'javascript',
    submissionTime: new Date().toISOString()
  };

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
    },
    { 
      id: '4', 
      status: 'failed', 
      input: '[-1]', 
      expectedOutput: '-1', 
      actualOutput: 'None',
      executionTime: 42,
      memoryUsed: 5998
    },
    { 
      id: '5', 
      status: 'failed', 
      input: '[-2, -1]', 
      expectedOutput: '-1', 
      actualOutput: 'None',
      executionTime: 58,
      memoryUsed: 6234
    },
    { 
      id: '6', 
      status: 'failed', 
      input: '[10, -5, 3, -8, 12]', 
      expectedOutput: '17', 
      actualOutput: 'None',
      executionTime: 115,
      memoryUsed: 8024
    }
  ];



  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={handleBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Coding Submission Result</h1>
              <p className="text-sm text-muted-foreground">Detailed analysis of your solution</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Metrics Cards */}
        <SubmissionStatsCard 
          testResults={{ passed: problemData.testCasesPassed || 3, total: problemData.totalTestCases || 6 }}
          memoryUsage={problemData.memoryUsage || "142.5 KB"}
          executionTime={problemData.executionTime || "0.45ms"}
        />

        {/* Two-Column Layout: Student Code (Left) + Test Results (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-200px)]">
          {/* Student Code - Left Column */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Your Solution</h3>
            <div className="h-full">
              <CodeDisplayPanel 
                code={submissionData.submittedCode}
                language={submissionData.language}
                title="Solution Implementation"
              />
            </div>
          </div>

          {/* Test Results - Right Column */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Test Results</h3>
            <div className="h-[calc(100vh-280px)] overflow-y-auto space-y-4">
              {testCases.slice(0, 6).map((testCase, index) => (
                <TestCaseResultCard 
                  key={testCase.id}
                  testCase={testCase}
                  index={index}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolutionViewerPage; 