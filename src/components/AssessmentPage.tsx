import { useState, useEffect } from "react";
import CodingChallenge from "./CodingChallenge";
import MCQQuiz from "./MCQQuiz";
import OpenEndedQuestions from "./OpenEndedQuestions";
import ViolationModal from "./ViolationModal";
import AssessmentHeader from "./assessment/AssessmentHeader";
import AssessmentInstructionsView from "./assessment/AssessmentInstructionsView";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface AssessmentPageProps {
  assessmentTitle: string;
  duration: string;
  onClose: () => void;
}

interface ViolationType {
  type: 'tab-switch' | 'fullscreen-exit' | 'copy-paste';
  count: number;
}

const AssessmentPage = ({ assessmentTitle, duration, onClose }: AssessmentPageProps) => {
  const [timeLeft, setTimeLeft] = useState(7200);
  const [currentView, setCurrentView] = useState<'instructions' | 'coding' | 'mcq' | 'openended'>('instructions');
  const [selectedChallengeIndex, setSelectedChallengeIndex] = useState(0);
  const [selectedQuizIndex, setSelectedQuizIndex] = useState(0);
  const [violations, setViolations] = useState<ViolationType[]>([]);
  const [showViolationModal, setShowViolationModal] = useState(false);
  const [currentViolation, setCurrentViolation] = useState<ViolationType | null>(null);
  const [showExitModal, setShowExitModal] = useState(false);
  const [completedSections, setCompletedSections] = useState({
    coding: false,
    mcq: false,
    openended: false
  });

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && currentView !== 'instructions') {
        handleViolation('tab-switch');
      }
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && currentView !== 'instructions') {
        handleViolation('fullscreen-exit');
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && document.fullscreenElement) {
        e.preventDefault();
        handleViolation('fullscreen-exit');
      }
    };

    const handleCopyPaste = (e: ClipboardEvent) => {
      if (e.type === 'paste' && currentView !== 'instructions') {
        e.preventDefault();
        handleViolation('copy-paste');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('paste', handleCopyPaste);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('paste', handleCopyPaste);
    };
  }, [currentView]);

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

  const handleAutoSubmit = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    onClose();
  };

  const handleCloseAttempt = () => {
    setShowExitModal(true);
  };

  const handleConfirmExit = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    onClose();
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

  const canSubmitAssessment = completedSections.coding && completedSections.mcq && completedSections.openended;

  const handleNavigation = (view: string, index?: number) => {
    if (view === 'coding' && index !== undefined) {
      setSelectedChallengeIndex(index);
      setCurrentView('coding');
    } else if (view === 'mcq' && index !== undefined) {
      setSelectedQuizIndex(index);
      setCurrentView('mcq');
    } else {
      setCurrentView(view as any);
    }
  };

  if (currentView === 'coding') {
    return (
      <div className="fixed inset-0 bg-background z-50">
        <CodingChallenge
          challenge={codingChallenges[selectedChallengeIndex]}
          onBack={() => setCurrentView('instructions')}
          onComplete={() => {
            setCompletedSections(prev => ({ ...prev, coding: true }));
            setCurrentView('instructions');
          }}
          timeLeft={formatTime(timeLeft)}
        />
      </div>
    );
  }

  if (currentView === 'mcq') {
    return (
      <div className="fixed inset-0 bg-background z-50">
        <MCQQuiz
          quiz={mcqQuizzes[selectedQuizIndex]}
          onBack={() => setCurrentView('instructions')}
          onComplete={() => {
            setCompletedSections(prev => ({ ...prev, mcq: true }));
            setCurrentView('instructions');
          }}
          timeLeft={formatTime(timeLeft)}
        />
      </div>
    );
  }

  if (currentView === 'openended') {
    return (
      <div className="fixed inset-0 bg-background z-50">
        <OpenEndedQuestions
          onBack={() => setCurrentView('instructions')}
          onComplete={() => {
            setCompletedSections(prev => ({ ...prev, openended: true }));
            setCurrentView('instructions');
          }}
          timeLeft={formatTime(timeLeft)}
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background z-50">
      <ViolationModal
        isOpen={showViolationModal}
        onClose={() => setShowViolationModal(false)}
        violation={currentViolation}
      />

      <Dialog open={showExitModal} onOpenChange={setShowExitModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              <DialogTitle>Exit Assessment?</DialogTitle>
            </div>
            <div className="mt-4">
              <DialogDescription className="text-left">
                Are you sure you want to exit the assessment? Your progress will be saved, but you may need to request a re-attempt to continue. We encourage you to complete the assessment now.
              </DialogDescription>
            </div>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setShowExitModal(false)}>
              Continue Assessment
            </Button>
            <Button onClick={handleConfirmExit} variant="destructive">
              Exit Assessment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <AssessmentHeader onClose={handleCloseAttempt} timeLeft={formatTime(timeLeft)} />

      <AssessmentInstructionsView
        assessmentTitle={assessmentTitle}
        codingChallenges={codingChallenges}
        mcqQuizzes={mcqQuizzes}
        completedSections={completedSections}
        onNavigate={handleNavigation}
        canSubmitAssessment={canSubmitAssessment}
        onSubmit={handleConfirmExit}
      />
    </div>
  );
};

export default AssessmentPage;
