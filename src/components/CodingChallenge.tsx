import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { X, CheckCircle, AlertTriangle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CodingChallengeSolutionModal from "./CodingChallengeSolutionModal";
import CodeDisplayPanel from "./CodeDisplayPanel";
import TestCaseResultCard from "./TestCaseResultCard";
import SubmissionStatsCard from "./SubmissionStatsCard";

interface CodingChallengeProps {
  challenge: {
    title: string;
    difficulty: string;
    marks: number;
  };
  challengeIndex: string | number; // Support both string and number for flexibility
  onBack: () => void;
  onComplete: () => void;
  timeLeft: string;
  initialCode?: string; // Different starting code for each challenge
  isViewMode?: boolean; // Added to handle view mode for completed challenges
}

const CodingChallenge = ({ 
  challenge, 
  challengeIndex, 
  onBack, 
  onComplete, 
  timeLeft, 
  initialCode = '// Write your solution here\n\n',
  isViewMode = false
}: CodingChallengeProps) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [isSubmitted, setIsSubmitted] = useState(isViewMode);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSolutionModal, setShowSolutionModal] = useState(false);
  const [showResultsView, setShowResultsView] = useState(isViewMode);

  // Check for existing submission on component mount
  useEffect(() => {
    const submissionData = sessionStorage.getItem(`coding-challenge-${challengeIndex}`);
    if (submissionData) {
      const parsed = JSON.parse(submissionData);
      setCode(parsed.code);
      setIsSubmitted(true);
      setOutput(parsed.output || 'Test Case 1: ✓ Passed\nTest Case 2: ✓ Passed\nTest Case 3: ✓ Passed\n\nAll tests passed!');
    }
  }, [challengeIndex]);

  const handleRunCode = () => {
    // Simulate code execution
    setOutput('Test Case 1: ✓ Passed\nTest Case 2: ✓ Passed\nTest Case 3: ✓ Passed\n\nAll tests passed!');
  };

  const handleSubmit = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = () => {
    setShowConfirmModal(false);
    
    // Store submission in sessionStorage for persistence
    sessionStorage.setItem(`coding-challenge-${challengeIndex}`, JSON.stringify({
      code,
      output,
      submissionTime: new Date().toISOString(),
      testResults: { passed: 3, total: 3 } // Mock test results
    }));
    
    // Immediately return to assessment instructions
    onComplete();
  };

  const handleViewSolution = () => {
    if (isViewMode) {
      setShowResultsView(true);
    } else {
      setShowSolutionModal(true);
    }
  };

  // Different problem descriptions for each challenge
  const problemDescriptions = [
    `Given an array of integers, find the maximum sum of any contiguous subarray.

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
}`,
    `Given a string, determine if it's a valid palindrome, considering only alphanumeric characters.

Example:
Input: "A man, a plan, a canal: Panama"
Output: true
Explanation: "amanaplanacanalpanama" is a palindrome.

Constraints:
- 1 ≤ string length ≤ 2 * 10^5
- String contains only printable ASCII characters

Function signature:
function isPalindrome(s) {
    // Your code here
}`,
    `Given an array of integers, return the two numbers such that they add up to a specific target.

Example:
Input: nums = [2, 7, 11, 15], target = 9
Output: [0, 1]
Explanation: nums[0] + nums[1] = 2 + 7 = 9

Constraints:
- 2 ≤ array length ≤ 10^4
- -10^9 ≤ nums[i] ≤ 10^9
- Each input has exactly one solution

Function signature:
function twoSum(nums, target) {
    // Your code here
}`
  ];

  // Extract numeric index for problem description selection
  const getNumericIndex = (index: string | number): number => {
    if (typeof index === 'number') return index;
    // Extract the last number from assessment-specific string like "dom-concepts-assessment-coding-1"
    const match = index.toString().match(/-(\d+)$/);
    return match ? parseInt(match[1]) : 0;
  };

  const problemDescription = problemDescriptions[getNumericIndex(challengeIndex)] || problemDescriptions[0];

  // Mock test cases for display
  const testCases = [
    { 
      id: '1', 
      status: 'passed' as 'passed' | 'failed', 
      input: '[-2, 1, -3, 4, -1, 2, 1, -5, 4]', 
      expectedOutput: '6', 
      actualOutput: '6',
      executionTime: 98,
      memoryUsed: 7892
    },
    { 
      id: '2', 
      status: 'passed' as 'passed' | 'failed', 
      input: '[1]', 
      expectedOutput: '1', 
      actualOutput: '1',
      executionTime: 45,
      memoryUsed: 6124
    },
    { 
      id: '3', 
      status: 'passed' as 'passed' | 'failed', 
      input: '[5, 4, -1, 7, 8]', 
      expectedOutput: '23', 
      actualOutput: '23',
      executionTime: 127,
      memoryUsed: 8456
    }
  ];

  const solutionCode = 
    getNumericIndex(challengeIndex) === 0 ? 
    `function maxSubarraySum(nums) {
  let maxSum = nums[0];
  let currentSum = nums[0];
  
  for (let i = 1; i < nums.length; i++) {
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    maxSum = Math.max(maxSum, currentSum);
  }
  
  return maxSum;
}` : 
    getNumericIndex(challengeIndex) === 1 ?
    `function isPalindrome(s) {
  // Remove non-alphanumeric characters and convert to lowercase
  s = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  // Compare the string with its reverse
  return s === s.split('').reverse().join('');
}` :
    `function twoSum(nums, target) {
  const map = new Map();
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    
    map.set(nums[i], i);
  }
  
  return [];
}`;

  // If in view mode and showing results, render the results page
  if (isViewMode && showResultsView) {
    return (
      <div className="min-h-screen bg-background">
        <header className="flex items-center justify-between p-4 border-b">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <X className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold">Coding Challenge Results</h1>
          <div className="w-10"></div> {/* Spacer for balance */}
        </header>

        <div className="container mx-auto p-6 max-w-7xl">
          {/* Challenge Info */}
          <div className="mb-6">
            <h2 className="text-2xl font-heading font-bold mb-2">{challenge.title}</h2>
            <div className="flex gap-2 mb-4">
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                challenge.difficulty === 'Easy' ? 'bg-success-light text-success' :
                challenge.difficulty === 'Medium' ? 'bg-warning-light text-black' :
                'bg-destructive-light text-destructive'
              }`}>
                {challenge.difficulty}
              </span>
              <span className="px-2 py-1 rounded text-xs font-medium bg-muted text-muted-foreground">
                {challenge.marks} marks
              </span>
            </div>
          </div>

          {/* Metrics Cards */}
          <SubmissionStatsCard 
            testResults={{ passed: 3, total: 3 }}
            memoryUsage="48.8 KB"
            executionTime="0.45ms"
          />

          {/* Two-Column Layout: Student Code (Left) + Test Results (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-300px)]">
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
              <div className="h-[calc(100vh-380px)] overflow-y-auto space-y-4">
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
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center justify-between p-4 border-b">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <X className="w-5 h-5" />
        </Button>
        <div className="font-mono text-lg font-semibold">
          {isSubmitted ? 'Submitted' : timeLeft}
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        <div className="w-1/2 p-6 border-r overflow-y-auto">
          <div className="mb-4">
            <h1 className="text-2xl font-heading font-bold mb-2">{challenge.title}</h1>
            <div className="flex gap-2 mb-4">
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                challenge.difficulty === 'Easy' ? 'bg-success-light text-success' :
                challenge.difficulty === 'Medium' ? 'bg-warning-light text-black' :
                'bg-destructive-light text-destructive'
              }`}>
                {challenge.difficulty}
              </span>
              <span className="px-2 py-1 rounded text-xs font-medium bg-muted text-muted-foreground">
                {challenge.marks} marks
              </span>
            </div>
          </div>
          
          <Card>
            <CardContent className="p-4">
              <pre className="whitespace-pre-wrap text-sm">{problemDescription}</pre>
            </CardContent>
          </Card>
        </div>

        <div className="w-1/2 flex flex-col">
          <div className="flex-1 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold">Code Editor</h2>
                <Select value={language} onValueChange={setLanguage} disabled={isSubmitted}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="java">Java</SelectItem>
                    <SelectItem value="cpp">C++</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="secondary" onClick={handleRunCode} disabled={isSubmitted}>
                  Run Code
                </Button>
                {!isSubmitted && (
                  <Button onClick={handleSubmit}>
                    Submit
                  </Button>
                )}
              </div>
            </div>
            
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="h-64 font-mono text-sm"
              placeholder="Write your code here..."
              disabled={isSubmitted}
            />
          </div>

          <div className="h-32 p-6 border-t bg-muted/20">
            <h3 className="text-sm font-semibold mb-2">Output</h3>
            <pre className="text-sm text-muted-foreground whitespace-pre-wrap">
              {output || 'Click "Run Code" to see output...'}
            </pre>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-warning-light rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-warning" />
              </div>
            </div>
            <DialogTitle className="text-center text-xl">
              Submit Solution?
            </DialogTitle>
          </DialogHeader>
          
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              Are you sure you want to submit your solution for <span className="font-semibold">{challenge.title}</span>?
            </p>
            
            <div className="bg-warning-light border border-warning rounded-lg p-3">
              <div className="text-sm text-warning space-y-1">
                <p className="font-medium">⚠️ Important:</p>
                <ul className="text-left space-y-1">
                  <li>• You cannot modify your code after submission</li>
                  <li>• Your solution will be evaluated immediately</li>
                  <li>• Make sure you've tested your code thoroughly</li>
                </ul>
              </div>
            </div>
            
            <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-2">
              <Button variant="outline" className="sm:w-1/2" onClick={() => setShowConfirmModal(false)}>
                Cancel
              </Button>
              <Button className="sm:w-1/2" onClick={handleConfirmSubmit}>
                Confirm Submission
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Solution Modal - only used for non-view mode */}
      <CodingChallengeSolutionModal
        isOpen={showSolutionModal}
        onClose={() => setShowSolutionModal(false)}
        challenge={challenge}
        solutionCode={solutionCode}
      />
    </div>
  );
};

export default CodingChallenge;
