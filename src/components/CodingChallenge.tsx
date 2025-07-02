import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { X, CheckCircle, AlertTriangle } from "lucide-react";
import CodingChallengeSolutionModal from "./CodingChallengeSolutionModal";

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
}

const CodingChallenge = ({ 
  challenge, 
  challengeIndex, 
  onBack, 
  onComplete, 
  timeLeft, 
  initialCode = '// Write your solution here\n\n' 
}: CodingChallengeProps) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSolutionModal, setShowSolutionModal] = useState(false);

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
    setIsSubmitted(true);
    
    // Store submission in sessionStorage for persistence
    sessionStorage.setItem(`coding-challenge-${challengeIndex}`, JSON.stringify({
      code,
      output,
      submissionTime: new Date().toISOString(),
      testResults: { passed: 3, total: 3 } // Mock test results
    }));
    
    setTimeout(() => {
      onComplete();
    }, 1000);
  };

  const handleViewSolution = () => {
    setShowSolutionModal(true);
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

  return (
    <div className="min-h-screen bg-background">
      <header className="w-full flex items-center justify-between p-4 border-b">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <X className="w-5 h-5" />
        </Button>
        <div className="font-mono text-lg font-semibold">
          {isSubmitted ? 'Submitted' : timeLeft}
        </div>
      </header>

      {isSubmitted && (
        <div className="bg-success-light border-b border-success p-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success" />
              <p className="font-semibold text-success">Challenge Submitted Successfully!</p>
            </div>
            <Button onClick={handleViewSolution} variant="outline" size="sm" className="text-success border-success">
              View Solution
            </Button>
          </div>
        </div>
      )}

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
              <h2 className="text-lg font-semibold">Code Editor</h2>
            </div>
            
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="h-64 font-mono text-sm"
              placeholder="Write your code here..."
              disabled={isSubmitted}
            />
            
            <div className="flex justify-between mt-4">
              <Button onClick={handleRunCode} disabled={isSubmitted}>
                Run Code
              </Button>
              {!isSubmitted && (
                <Button onClick={handleSubmit}>
                  Submit
                </Button>
              )}
            </div>
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
          </div>
          
          <DialogFooter className="flex gap-3">
            <Button variant="outline" onClick={() => setShowConfirmModal(false)} className="flex-1">
              Review Code
            </Button>
            <Button onClick={handleConfirmSubmit} className="flex-1">
              Submit Solution
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Solution Modal */}
      {isSubmitted && (
        <CodingChallengeSolutionModal
          isOpen={showSolutionModal}
          onClose={() => setShowSolutionModal(false)}
          challenge={challenge}
          challengeIndex={getNumericIndex(challengeIndex)}
          submittedCode={code}
          testResults={{ passed: 3, total: 3 }}
        />
      )}
    </div>
  );
};

export default CodingChallenge;
