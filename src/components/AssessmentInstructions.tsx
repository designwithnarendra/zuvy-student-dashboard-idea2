import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, CheckCircle } from "lucide-react";
import CodingChallenge from "./CodingChallenge";
import MCQQuiz from "./MCQQuiz";
import OpenEndedQuestions from "./OpenEndedQuestions";
import ViolationModal from "./ViolationModal";

interface AssessmentInstructionsProps {
  assessmentTitle: string;
  duration: string;
  assessmentId: string;
  isViewMode?: boolean;
  viewModeData?: {
    score: number;
    passed: boolean;
    answers: any;
  };
  onClose: (result?: { score: number; passed: boolean }) => void;
  onExitRequest?: () => void;
}

interface ViolationType {
  type: 'fullscreen-exit' | 'copy-paste';
  count: number;
}

const AssessmentInstructions = ({ 
  assessmentTitle, 
  duration, 
  assessmentId, 
  isViewMode = false, 
  viewModeData, 
  onClose, 
  onExitRequest 
}: AssessmentInstructionsProps) => {
  const [timeLeft, setTimeLeft] = useState(7200); // 2 hours in seconds
  const [currentView, setCurrentView] = useState<'instructions' | 'coding' | 'mcq' | 'openended'>('instructions');
  const [selectedChallengeIndex, setSelectedChallengeIndex] = useState(0);
  const [selectedQuizIndex, setSelectedQuizIndex] = useState(0);
  const [violations, setViolations] = useState<ViolationType[]>([]);
  const [showViolationModal, setShowViolationModal] = useState(false);
  const [currentViolation, setCurrentViolation] = useState<ViolationType | null>(null);
  
  // Initialize completion state based on view mode and stored assessment state
  const [completedSections, setCompletedSections] = useState({
    coding: false,
    mcq: false,
    openended: false
  });

  // Load assessment-specific completion state on mount
  useEffect(() => {
    const loadCompletionState = () => {
      if (isViewMode) {
        // In view mode, mark all sections as completed
        setCompletedSections({
          coding: true,
          mcq: true,
          openended: true
        });
        return;
      }

      // Load specific completion state for this assessment
      const completionKey = `assessment-completion-${assessmentId}`;
      const savedCompletion = sessionStorage.getItem(completionKey);
      
      if (savedCompletion) {
        try {
          const parsed = JSON.parse(savedCompletion);
          setCompletedSections(parsed);
        } catch {
          // If parsing fails, reset to default
          setCompletedSections({
            coding: false,
            mcq: false,
            openended: false
          });
        }
      }
    };

    loadCompletionState();
  }, [assessmentId, isViewMode]);

  // Save completion state whenever it changes
  useEffect(() => {
    if (!isViewMode && assessmentId) {
      const completionKey = `assessment-completion-${assessmentId}`;
      sessionStorage.setItem(completionKey, JSON.stringify(completedSections));
    }
  }, [completedSections, assessmentId, isViewMode]);

  useEffect(() => {
    if (isViewMode) return; // Don't run timer in view mode

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isViewMode]);

  useEffect(() => {
    // Removed tab-switch detection as per requirements

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && currentView !== 'instructions' && !isViewMode) {
        handleViolation('fullscreen-exit');
      }
    };

    const handleCopyPaste = (e: ClipboardEvent) => {
      if ((e.type === 'copy' || e.type === 'paste') && currentView !== 'instructions' && !isViewMode) {
        e.preventDefault();
        handleViolation('copy-paste');
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Detect Ctrl+C, Ctrl+V, Cmd+C, Cmd+V
      if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'v') && currentView !== 'instructions' && !isViewMode) {
        e.preventDefault();
        handleViolation('copy-paste');
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('paste', handleCopyPaste);
    document.addEventListener('copy', handleCopyPaste);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('paste', handleCopyPaste);
      document.removeEventListener('copy', handleCopyPaste);
      document.removeEventListener('keydown', handleKeyDown);
    };
      }, [currentView, isViewMode]);

  const handleViolation = (type: ViolationType['type']) => {
    const existingViolation = violations.find(v => v.type === type);
    let updatedViolations;
    
    if (existingViolation) {
      updatedViolations = violations.map(v => 
        v.type === type ? { ...v, count: v.count + 1 } : v
      );
    } else {
      updatedViolations = [...violations, { type, count: 1 }];
    }
    
    setViolations(updatedViolations);
    
    const totalViolations = updatedViolations.reduce((sum, v) => sum + v.count, 0);
    const currentTypeViolation = updatedViolations.find(v => v.type === type);
    
    if (totalViolations >= 3) {
      handleAutoSubmit();
    } else {
      setCurrentViolation(currentTypeViolation!);
      setShowViolationModal(true);
    }
  };

  const calculateScore = () => {
    // Calculate score based on assessment ID and completion status
    if (assessmentId === 'high-score-assessment') {
      return 85; // Pass score for view results
    } else if (assessmentId === 'low-score-assessment') {
      return 45; // Fail score for view results
    } else if (assessmentId === 'scheduled-assessment') {
      return 35; // Fail score to show re-attempt
    }
    
    // For other assessments, calculate based on completion
    const completionCount = Object.values(completedSections).filter(Boolean).length;
    const baseScore = completionCount * 30; // 30 points per section
    return Math.min(baseScore + Math.floor(Math.random() * 20), 100);
  };

  const handleAutoSubmit = () => {
    const finalScore = calculateScore();
    const passed = finalScore >= 60;
    onClose({ score: finalScore, passed });
  };

  const handleManualClose = () => {
    // In view mode, close immediately
    if (isViewMode) {
      onClose();
      return;
    }
    
    // In assessment mode, trigger exit warning modal
    if (onExitRequest) {
      onExitRequest();
    } else {
      // Fallback to direct close with partial score
      const finalScore = calculateScore();
      const passed = finalScore >= 60;
      onClose({ score: finalScore, passed });
    }
  };

  const handleSubmitAssessment = () => {
    const finalScore = calculateScore();
    const passed = finalScore >= 60;
    onClose({ score: finalScore, passed });
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const codingChallenges = [
    { title: "Array Manipulation", difficulty: "Easy", marks: 10 },
    { title: "String Processing", difficulty: "Medium", marks: 15 },
    { title: "Algorithm Optimization", difficulty: "Hard", marks: 20 }
  ];

  const mcqQuizzes = [
    { title: "JavaScript Fundamentals", difficulty: "Easy", marks: 10 },
    { title: "DOM Manipulation", difficulty: "Medium", marks: 15 }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-success-light text-success';
      case 'Medium': return 'bg-warning-light text-black';
      case 'Hard': return 'bg-destructive-light text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const canSubmitAssessment = completedSections.coding && completedSections.mcq && completedSections.openended;

  if (currentView === 'coding') {
    return (
      <CodingChallenge
        challenge={codingChallenges[selectedChallengeIndex]}
        challengeIndex={`${assessmentId}-coding-${selectedChallengeIndex}`}
        onBack={() => setCurrentView('instructions')}
        onComplete={() => {
          setCompletedSections(prev => ({ ...prev, coding: true }));
          setCurrentView('instructions');
        }}
        timeLeft={formatTime(timeLeft)}
        initialCode={
          selectedChallengeIndex === 0 ? '// Write your solution here\nfunction maxSubarraySum(nums) {\n    // Your code here\n    return 0;\n}\n' :
          selectedChallengeIndex === 1 ? '// Write your solution here\nfunction isPalindrome(s) {\n    // Your code here\n    return false;\n}\n' :
          '// Write your solution here\nfunction twoSum(nums, target) {\n    // Your code here\n    return [];\n}\n'
        }
      />
    );
  }

  if (currentView === 'mcq') {
    return (
      <MCQQuiz
        quiz={mcqQuizzes[selectedQuizIndex]}
        quizId={`${assessmentId}-mcq-${selectedQuizIndex}`}
        onBack={() => {
          // Only update completion if the quiz was submitted
          setCurrentView('instructions');
        }}
        onComplete={() => {
          setCompletedSections(prev => ({ ...prev, mcq: true }));
          setCurrentView('instructions');
        }}
        timeLeft={formatTime(timeLeft)}
        isViewMode={isViewMode && completedSections.mcq}
      />
    );
  }

  if (currentView === 'openended') {
    return (
      <OpenEndedQuestions
        questionsId={`${assessmentId}-openended`}
        onBack={() => {
          setCurrentView('instructions');
        }}
        onComplete={() => {
          setCompletedSections(prev => ({ ...prev, openended: true }));
          setCurrentView('instructions');
        }}
        timeLeft={formatTime(timeLeft)}
        isViewMode={isViewMode && completedSections.openended}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ViolationModal
        isOpen={showViolationModal}
        onClose={() => setShowViolationModal(false)}
        violation={currentViolation}
      />
      
      <header className="sticky top-0 z-50 w-full bg-background border-b">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon" onClick={handleManualClose}>
            <X className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center gap-6">
            {!isViewMode && (
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Time Remaining</div>
                <div className="font-mono text-lg font-semibold">{formatTime(timeLeft)}</div>
              </div>
            )}
            
            <div className="text-center">
              <div className="text-sm text-muted-foreground">
                {isViewMode ? 'Viewing Results' : 'Assessment'}
              </div>
              <div className="font-semibold">{assessmentTitle}</div>
            </div>
          </div>
          
          <div className="w-10"> {/* Spacer for balance */}</div>
        </div>
        
        {/* Assessment Details Bar */}
        <div className="px-4 py-2 bg-muted/30 border-t">
          <div className="flex justify-center gap-8 text-sm">
            <div className="text-center">
              <span className="text-muted-foreground">Duration:</span>
              <span className="ml-1 font-medium">{duration}</span>
            </div>
            <div className="text-center">
              <span className="text-muted-foreground">Total Marks:</span>
              <span className="ml-1 font-medium">100</span>
            </div>
            <div className="text-center">
              <span className="text-muted-foreground">Pass Score:</span>
              <span className="ml-1 font-medium">60</span>
            </div>
            {!isViewMode && (
              <div className="text-center">
                <span className="text-muted-foreground">Start:</span>
                <span className="ml-1 font-medium">{new Date().toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-8">
        <div className="text-left mb-8">
          <h1 className="text-3xl font-heading font-bold mb-2">{assessmentTitle}</h1>
          <p className="text-muted-foreground">
            Complete all sections to submit your assessment. Read the instructions carefully before proceeding.
          </p>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-xl font-heading font-semibold">Proctoring Rules</h2>
            <ul className="space-y-2 text-muted-foreground">
              <li>• No copy-pasting is allowed during the assessment</li>
              <li>• Tab switching or window switching is not permitted</li>
              <li>• Assessment screen exit will result in violations</li>
              <li>• Maximum 3 violations are allowed before auto-submission</li>
            </ul>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-heading font-bold">Coding Challenges</h2>
            {codingChallenges.map((challenge, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold">{challenge.title}</h3>
                    <div className="flex gap-2">
                      <Badge className={getDifficultyColor(challenge.difficulty)}>
                        {challenge.difficulty}
                      </Badge>
                      <Badge variant="outline">{challenge.marks} marks</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {completedSections.coding && (
                        <div className="flex items-center space-x-1 text-success">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">Completed</span>
                        </div>
                      )}
                    </div>
                    <Button 
                      variant="link" 
                      className="text-primary p-0 h-auto"
                      onClick={() => {
                        setSelectedChallengeIndex(index);
                        setCurrentView('coding');
                      }}
                    >
                      {completedSections.coding ? 'View Solution' : 'Solve Challenge'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-heading font-bold">MCQ Quizzes</h2>
            {mcqQuizzes.map((quiz, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold">{quiz.title}</h3>
                    <div className="flex gap-2">
                      <Badge className={getDifficultyColor(quiz.difficulty)}>
                        {quiz.difficulty}
                      </Badge>
                      <Badge variant="outline">{quiz.marks} marks</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {completedSections.mcq && (
                        <div className="flex items-center space-x-1 text-success">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">Completed</span>
                        </div>
                      )}
                    </div>
                    <Button 
                      variant="link" 
                      className="text-primary p-0 h-auto"
                      onClick={() => {
                        setSelectedQuizIndex(index);
                        setCurrentView('mcq');
                      }}
                    >
                      {completedSections.mcq ? 'View Answers' : 'Attempt Quiz'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-heading font-bold">Open Ended Questions</h2>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Programming Concepts</h3>
                  <Badge variant="outline">2 questions</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {completedSections.openended && (
                      <div className="flex items-center space-x-1 text-success">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">Completed</span>
                      </div>
                    )}
                  </div>
                  <Button 
                    variant="link" 
                    className="text-primary p-0 h-auto"
                    onClick={() => setCurrentView('openended')}
                  >
                    {completedSections.openended ? 'View Answers' : 'Attempt Questions'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {!isViewMode && (
            <div className="flex justify-center pt-8">
              <Button 
                size="lg" 
                disabled={!canSubmitAssessment}
                onClick={handleSubmitAssessment}
              >
                Submit Assessment
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssessmentInstructions;
