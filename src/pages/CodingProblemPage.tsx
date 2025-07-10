import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { X } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "@/lib/ThemeProvider";
import { mockCourses } from "@/lib/mockData";
import CodingSubmissionModal from "@/components/CodingSubmissionModal";

const CodingProblemPage = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const { lockTheme, unlockTheme } = useTheme();
  const [code, setCode] = useState('// Write your solution here\nfunction maxSubarraySum(nums) {\n    // Your code here\n    return 0;\n}\n');
  const [output, setOutput] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [problemData, setProblemData] = useState<any>(null);

  // Load problem data and lock theme
  useEffect(() => {
    // Lock theme during coding challenge to prevent accidental changes
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

    // Cleanup function to unlock theme when leaving coding challenge
    return () => {
      unlockTheme();
    };
  }, [itemId, lockTheme, unlockTheme]);

  const handleRunCode = () => {
    // Simulate code execution
    setOutput('Test Case 1: ✓ Passed\nTest Case 2: ✓ Passed\nTest Case 3: ✓ Passed\n\nAll tests passed!');
  };

  const handleSubmit = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmSubmit = () => {
    setShowConfirmDialog(false);
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
    unlockTheme(); // Unlock theme before navigating away
    setShowSubmissionModal(false);
    if (problemData) {
      navigate(`/course/${problemData.courseId}/module/${problemData.moduleId}`);
    } else {
      navigate('/');
    }
  };

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
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleRunCode} disabled={isSubmitted}>
            Run Code
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitted}
          >
            {isSubmitted ? 'Submitted ✓' : 'Submit'}
          </Button>
        </div>
      </header>

      {/* Mobile Layout with Tabs */}
      <div className="block lg:hidden h-[calc(100vh-80px)]">
        <Tabs defaultValue="description" className="flex flex-col h-full">
          <TabsList className="grid w-full grid-cols-2 mx-4 mt-4">
            <TabsTrigger value="description">Problem</TabsTrigger>
            <TabsTrigger value="code">Code & Output</TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="flex-1 p-4 overflow-y-auto">
            <div className="mb-4">
              <h1 className="text-xl font-heading font-bold mb-2">{problemData.title}</h1>
              <div className="flex gap-2 mb-4">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  problemData.difficulty === 'Easy' ? 'bg-success-light text-success' :
                  problemData.difficulty === 'Medium' ? 'bg-warning-light text-black' :
                  'bg-destructive-light text-destructive'
                }`}>
                  {problemData.difficulty || 'Medium'}
                </span>
              </div>
            </div>
            
            <Card>
              <CardContent className="p-4">
                <pre className="whitespace-pre-wrap text-sm leading-relaxed">{problemDescription}</pre>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="code" className="flex-1 flex flex-col">
            <div className="flex-1 p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Code Editor</h2>
              </div>
              
              <Textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="h-48 font-mono text-sm"
                placeholder="Write your code here..."
              />
            </div>

            <div className="h-32 p-4 border-t bg-muted/20">
              <h3 className="text-sm font-semibold mb-2">Output</h3>
              <pre className="text-sm text-muted-foreground whitespace-pre-wrap">
                {output || 'Click "Run Code" to see output...'}
              </pre>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex h-[calc(100vh-80px)]">
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

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Solution</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to submit your solution? Once submitted, you cannot make changes to your code.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSubmit}>
              Submit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CodingProblemPage; 