import { useState, useEffect } from "react";
import AssessmentHeader from "./AssessmentHeader";
import AssessmentStateCard from "./AssessmentStateCard";
import AssessmentInstructions from "./AssessmentInstructions";
import FullscreenWarningModal from "./FullscreenWarningModal";

interface AssessmentData {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  duration: string;
  totalMarks: number;
  passScore: number;
  state: 'scheduled' | 'open' | 'interrupted' | 'reAttemptRequested' | 'completed' | 'expired';
  score?: number;
  attemptStatus: 'Not Attempted' | 'Attempted' | 'Interrupted';
}

interface AssessmentViewProps {
  assessment: AssessmentData;
  onReAttemptRequest?: (assessmentId: string) => void;
}

const AssessmentView = ({ assessment, onReAttemptRequest }: AssessmentViewProps) => {
  const [currentState, setCurrentState] = useState(assessment.state);
  const [countdown, setCountdown] = useState(3);
  const [isCountdownActive, setIsCountdownActive] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showFullscreenWarning, setShowFullscreenWarning] = useState(false);

  // Reset state when assessment changes
  useEffect(() => {
    setCurrentState(assessment.state);
    setShowInstructions(false);
    setIsCountdownActive(false);
    setCountdown(3);
    setShowFullscreenWarning(false);
  }, [assessment.id, assessment.state]);

  useEffect(() => {
    if (currentState === 'scheduled') {
      setIsCountdownActive(true);
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setCurrentState('open');
            setIsCountdownActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentState]);

  const handleReAttemptRequest = () => {
    if (onReAttemptRequest && assessment.id) {
      onReAttemptRequest(assessment.id);
      // Simulate request processing
      setCurrentState('reAttemptRequested');
      setTimeout(() => {
        setCurrentState('open');
      }, 3000);
    } else {
      // Fallback behavior
      setCurrentState('reAttemptRequested');
      setTimeout(() => {
        setCurrentState('scheduled');
      }, 3000);
    }
  };

  const handleBeginAssessment = () => {
    // Show fullscreen warning modal before starting assessment
    setShowFullscreenWarning(true);
  };

  const handleFullscreenProceed = () => {
    setShowFullscreenWarning(false);
    // Navigate to separate assessment page with fullscreen
    window.location.href = `/assessment/${assessment.id}`;
  };

  const handleFullscreenCancel = () => {
    setShowFullscreenWarning(false);
  };

  const handleCloseInstructions = (result?: { score: number; passed: boolean }) => {
    setShowInstructions(false);
    if (result) {
      // Update state based on assessment result
      setCurrentState('completed');
    } else {
      // Assessment was exited without completion
      setCurrentState('completed');
    }
  };

  // If instructions are shown, render the full instructions component
  if (showInstructions) {
    return (
      <AssessmentInstructions
        assessmentTitle={assessment.title}
        duration={assessment.duration}
        assessmentId={assessment.id}
        isViewMode={currentState === 'completed'}
        viewModeData={currentState === 'completed' ? {
          score: assessment.score || 0,
          passed: (assessment.score || 0) >= assessment.passScore,
          answers: {}
        } : undefined}
        onClose={handleCloseInstructions}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="space-y-6">
        <AssessmentHeader
          title={assessment.title}
          attemptStatus={assessment.attemptStatus}
          startDate={assessment.startDate}
          endDate={assessment.endDate}
          duration={assessment.duration}
          totalMarks={assessment.totalMarks}
          description={assessment.description}
        />
        
        <AssessmentStateCard
          state={currentState}
          assessmentId={assessment.id}
          countdown={isCountdownActive ? countdown : undefined}
          endDate={assessment.endDate}
          score={assessment.score}
          totalMarks={assessment.totalMarks}
          passScore={assessment.passScore}
          onReAttemptRequest={handleReAttemptRequest}
          onBeginAssessment={handleBeginAssessment}
          onViewResults={() => {
            // Navigate to view results mode in separate page
            window.location.href = `/assessment/${assessment.id}?view=results`;
          }}
        />
      </div>

      <FullscreenWarningModal
        isOpen={showFullscreenWarning}
        onProceed={handleFullscreenProceed}
        onCancel={handleFullscreenCancel}
        assessmentTitle={assessment.title}
      />
    </div>
  );
};

export default AssessmentView;
