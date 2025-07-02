import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X, CheckCircle, XCircle } from "lucide-react";

interface CodingChallengeSolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  challenge: {
    title: string;
    difficulty: string;
    marks: number;
  };
  challengeIndex: string | number;
  submittedCode: string;
  testResults: {
    passed: number;
    total: number;
  };
}

const CodingChallengeSolutionModal = ({ 
  isOpen, 
  onClose, 
  challenge,
  challengeIndex,
  submittedCode,
  testResults
}: CodingChallengeSolutionModalProps) => {
  
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

  const getNumericIndex = (index: string | number): number => {
    if (typeof index === 'number') return index;
    const match = index.toString().match(/-(\d+)$/);
    return match ? parseInt(match[1]) : 0;
  };

  const problemDescription = problemDescriptions[getNumericIndex(challengeIndex)] || problemDescriptions[0];
  const allTestsPassed = testResults.passed === testResults.total;

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-6xl h-[90vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">Solution Viewer - {challenge.title}</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="flex h-full gap-6">
          {/* Problem Description */}
          <div className="w-1/2 overflow-y-auto">
            <div className="mb-4">
              <div className="flex gap-2 mb-4">
                <Badge className={
                  challenge.difficulty === 'Easy' ? 'bg-success-light text-success' :
                  challenge.difficulty === 'Medium' ? 'bg-warning-light text-black' :
                  'bg-destructive-light text-destructive'
                }>
                  {challenge.difficulty}
                </Badge>
                <Badge variant="outline">{challenge.marks} marks</Badge>
              </div>
            </div>
            
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-3">Problem Description</h3>
                <pre className="whitespace-pre-wrap text-sm">{problemDescription}</pre>
              </CardContent>
            </Card>
          </div>

          {/* Solution and Results */}
          <div className="w-1/2 flex flex-col">
            {/* Test Results */}
            <Card className="mb-4">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  {allTestsPassed ? (
                    <CheckCircle className="w-5 h-5 text-success" />
                  ) : (
                    <XCircle className="w-5 h-5 text-destructive" />
                  )}
                  <h3 className="text-lg font-semibold">
                    Test Results: {testResults.passed}/{testResults.total}
                  </h3>
                </div>
                <p className={`text-sm ${allTestsPassed ? 'text-success' : 'text-destructive'}`}>
                  {allTestsPassed ? 'All test cases passed!' : 'Some test cases failed.'}
                </p>
              </CardContent>
            </Card>

            {/* Submitted Code */}
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-3">Your Submitted Solution</h3>
              <Textarea
                value={submittedCode}
                readOnly
                className="h-full font-mono text-sm resize-none"
                placeholder="No code submitted"
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CodingChallengeSolutionModal; 