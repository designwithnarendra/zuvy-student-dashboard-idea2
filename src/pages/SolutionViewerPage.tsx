import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Check, AlertCircle } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { mockCourses } from "@/lib/mockData";

const SolutionViewerPage = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [problemData, setProblemData] = useState<any>(null);

  // Load problem data
  useEffect(() => {
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
  }, [itemId]);

  const handleBack = () => {
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

  const testCases = [
    { input: "[-2, 1, -3, 4, -1, 2, 1, -5, 4]", expected: "6", actual: "6", passed: true },
    { input: "[1]", expected: "1", actual: "1", passed: true },
    { input: "[5, 4, -1, 7, 8]", expected: "23", actual: "23", passed: true },
    { input: "[-1]", expected: "-1", actual: "-1", passed: true },
    { input: "[-2, -1]", expected: "-1", actual: "-1", passed: true }
  ];

  const passedTests = testCases.filter(test => test.passed).length;
  const totalTests = testCases.length;

  return (
    <div className="min-h-screen bg-background">
      <header className="w-full flex items-center justify-between p-4 border-b">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <X className="w-5 h-5" />
        </Button>
        <div className="font-mono text-lg font-semibold">
          Solution Viewer
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Side - Problem Brief */}
        <div className="w-1/2 p-6 border-r overflow-y-auto">
          <div className="mb-4">
            <h1 className="text-2xl font-heading font-bold mb-2">{problemData.title}</h1>
            <div className="flex gap-2 mb-4">
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                problemData.difficulty === 'Easy' ? 'bg-success-light text-success' :
                problemData.difficulty === 'Medium' ? 'bg-warning-light text-black' :
                'bg-destructive-light text-destructive'
              }`}>
                {problemData.difficulty || 'Medium'}
              </span>
              <span className="px-2 py-1 rounded text-xs font-medium bg-muted text-muted-foreground">
                {problemData.marks || 25} marks
              </span>
            </div>
          </div>
          
          <Card>
            <CardContent className="p-4">
              <pre className="whitespace-pre-wrap text-sm">{problemDescription}</pre>
            </CardContent>
          </Card>
        </div>

        {/* Right Side - Solution and Test Results */}
        <div className="w-1/2 flex flex-col">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Your Solution</h2>
              <Badge variant={passedTests === totalTests ? "default" : "destructive"}>
                {passedTests === totalTests ? 'All Tests Passed' : `${passedTests}/${totalTests} Tests Passed`}
              </Badge>
            </div>
            
            <Card>
              <CardContent className="p-4">
                <pre className="text-sm font-mono whitespace-pre-wrap">{submittedCode}</pre>
              </CardContent>
            </Card>
          </div>

          <div className="flex-1 p-6 overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Test Results</h3>
            <div className="space-y-3">
              {testCases.map((testCase, index) => (
                <Card key={index} className={`border ${
                  testCase.passed ? 'border-success bg-success-light/20' : 'border-destructive bg-destructive-light/20'
                }`}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      {testCase.passed ? (
                        <Check className="w-4 h-4 text-success" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-destructive" />
                      )}
                      Test Case {index + 1}
                      <Badge variant={testCase.passed ? "default" : "destructive"} className="ml-auto">
                        {testCase.passed ? 'Passed' : 'Failed'}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-sm space-y-1">
                      <div><strong>Input:</strong> {testCase.input}</div>
                      <div><strong>Expected:</strong> {testCase.expected}</div>
                      <div><strong>Your Output:</strong> {testCase.actual}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolutionViewerPage; 