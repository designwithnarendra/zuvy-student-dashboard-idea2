import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { mockCourses } from "@/lib/mockData";
import CodingSubmissionModal from "@/components/CodingSubmissionModal";

const CodingProblemPage = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [code, setCode] = useState('// Write your solution here\nfunction maxSubarraySum(nums) {\n    // Your code here\n    return 0;\n}\n');
  const [output, setOutput] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
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

  const handleRunCode = () => {
    // Simulate code execution
    setOutput('Test Case 1: ✓ Passed\nTest Case 2: ✓ Passed\nTest Case 3: ✓ Passed\n\nAll tests passed!');
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    setShowSubmissionModal(true);
    
    // Note: In real implementation, this would update the parent component state
    // For session persistence, we'll use sessionStorage instead of localStorage
    sessionStorage.setItem(`coding-problem-${itemId}`, JSON.stringify({
      submissionState: 'submitted',
      submittedCode: code,
      submissionTime: new Date().toISOString(),
      testCasesPassed: 5,
      totalTestCases: 5
    }));
  };

  const handleViewSolution = () => {
    setShowSubmissionModal(false);
    navigate(`/solution-viewer/${itemId}`);
  };

  const handleReturnToCourse = () => {
    setShowSubmissionModal(false);
    if (problemData) {
      navigate(`/course/${problemData.courseId}/module/${problemData.moduleId}`);
    } else {
      navigate('/');
    }
  };

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
          <h2 className="text-xl font-semibold mb-2">Loading Problem...</h2>
          <p className="text-muted-foreground">Please wait while we load the coding problem.</p>
        </div>
      </div>
    );
  };

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
    return 0;
}
  `;

  return (
    <div className="min-h-screen bg-background">
      <header className="w-full flex items-center justify-between p-4 border-b">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <X className="w-5 h-5" />
        </Button>
        <div className="font-mono text-lg font-semibold">
          Coding Challenge
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
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
            />
            
            <div className="flex justify-between mt-4">
              <Button onClick={handleRunCode} disabled={isSubmitted}>
                Run Code
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={isSubmitted}
              >
                {isSubmitted ? 'Submitted ✓' : 'Submit'}
              </Button>
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

      <CodingSubmissionModal
        isOpen={showSubmissionModal}
        onViewSolution={handleViewSolution}
        onReturnToCourse={handleReturnToCourse}
        problemTitle={problemData.title}
        score="5/5 test cases passed"
      />
    </div>
  );
};

export default CodingProblemPage; 