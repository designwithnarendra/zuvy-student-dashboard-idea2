import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import AssessmentInstructions from "@/components/AssessmentInstructions";
import AssessmentExitWarningModal from "@/components/AssessmentExitWarningModal";
import ViolationModal from "@/components/ViolationModal";
import { mockCourses } from "@/lib/mockData";

const AssessmentPage = () => {
  const { courseId, moduleId, assessmentId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [assessmentData, setAssessmentData] = useState<any>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [violationCount, setViolationCount] = useState(0);
  const [showViolationModal, setShowViolationModal] = useState(false);
  const [showExitWarning, setShowExitWarning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string>("");

  // Check if this is view mode from query params
  const isViewMode = searchParams.get('view') === 'results';

  useEffect(() => {
    // Find assessment data based on assessmentId
    const getAssessmentData = (itemId: string) => {
      const baseAssessmentMap: { [key: string]: any } = {
        'dom-concepts-assessment': {
          id: 'dom-concepts-assessment',
          title: 'DOM Concepts Assessment',
          description: 'This assessment covers DOM manipulation, event handling, and interactive web development concepts. Complete coding problems, MCQ quiz, and open-ended questions.',
          startDate: new Date(),
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          duration: '2 hours',
          totalMarks: 100,
          passScore: 60,
          state: 'open',
          score: undefined,
          attemptStatus: 'Not Attempted'
        },
        'high-score-assessment': {
          id: 'high-score-assessment',
          title: 'JavaScript Fundamentals Assessment',
          description: 'Comprehensive assessment covering JavaScript basics, data types, functions, and control structures.',
          startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          duration: '90 minutes',
          totalMarks: 100,
          passScore: 60,
          state: 'completed',
          score: 85,
          attemptStatus: 'Attempted'
        },
        'low-score-assessment': {
          id: 'low-score-assessment',
          title: 'Event Handling Assessment',
          description: 'Assessment focusing on event handling, user interactions, and dynamic content updates.',
          startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          duration: '75 minutes',
          totalMarks: 100,
          passScore: 60,
          state: 'completed',
          score: 45,
          attemptStatus: 'Attempted'
        },
        'expired-assessment': {
          id: 'expired-assessment',
          title: 'DOM Manipulation Final Test',
          description: 'Final comprehensive assessment covering all DOM manipulation concepts and techniques.',
          startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          duration: '3 hours',
          totalMarks: 150,
          passScore: 60,
          state: 'expired',
          attemptStatus: 'Not Attempted'
        },
        'scheduled-assessment': {
          id: 'scheduled-assessment',
          title: 'JavaScript Advanced Concepts',
          description: 'This assessment will demonstrate the re-attempt flow and complete assessment experience.',
          startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          duration: '2 hours',
          totalMarks: 100,
          passScore: 60,
          state: 'interrupted',
          score: 35,
          attemptStatus: 'Interrupted'
        },
        'static-scheduled-assessment': {
          id: 'static-scheduled-assessment',
          title: 'React Advanced Patterns Assessment',
          description: 'Assessment on advanced React patterns, hooks, and performance optimization.',
          startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          duration: '90 minutes',
          totalMarks: 100,
          passScore: 60,
          state: 'scheduled',
          attemptStatus: 'Not Attempted'
        }
      };
      
      return baseAssessmentMap[itemId] || null;
    };

    if (assessmentId) {
      const data = getAssessmentData(assessmentId);
      setAssessmentData(data);
    }
  }, [assessmentId]);

  // Fullscreen management and proctoring
  useEffect(() => {
    if (!isViewMode && assessmentData) {
      // Enter fullscreen when assessment starts (non-view mode)
      const enterFullscreen = async () => {
        try {
          if (document.documentElement.requestFullscreen) {
            await document.documentElement.requestFullscreen();
            setIsFullscreen(true);
          }
        } catch (error) {
          console.log('Fullscreen not supported or denied');
        }
      };

      enterFullscreen();
    }

    // Enhanced keyboard event monitoring for violations
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isViewMode) return;
      
      // ESC key detection for fullscreen exit attempts
      if (event.key === 'Escape') {
        event.preventDefault();
        handleViolation('ESC Key Press - Attempted fullscreen exit');
        return;
      }
      
      // Copy/Paste detection
      if ((event.ctrlKey || event.metaKey) && (event.key === 'c' || event.key === 'v')) {
        event.preventDefault();
        handleViolation(`${event.key === 'c' ? 'Copy' : 'Paste'} Attempt Detected`);
        return;
      }
      
      // Other suspicious key combinations
      if ((event.ctrlKey || event.metaKey) && 
          ['Tab', 'r', 'w', 't', 'n', 'F12'].includes(event.key)) {
        event.preventDefault();
        handleViolation(`Suspicious key combination: Ctrl+${event.key}`);
        return;
      }
      
      // F12 and other developer tools shortcuts
      if (['F12', 'F5'].includes(event.key)) {
        event.preventDefault();
        handleViolation(`Developer tools shortcut: ${event.key}`);
        return;
      }
    };

    // Enhanced fullscreen change detection
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = Boolean(document.fullscreenElement);
      setIsFullscreen(isCurrentlyFullscreen);
      
      if (!isCurrentlyFullscreen && !isViewMode && assessmentData) {
        // User exited fullscreen during assessment
        handleViolation('Fullscreen Exit Detected');
      }
    };

    // Visibility change detection (tab switching)
    const handleVisibilityChange = () => {
      if (isViewMode) return;
      
      if (document.hidden) {
        handleViolation('Tab Switch / Window Hidden Detected');
      }
    };

    // Context menu prevention (right-click)
    const handleContextMenu = (event: MouseEvent) => {
      if (!isViewMode) {
        event.preventDefault();
        handleViolation('Right-click / Context Menu Attempt');
      }
    };

    // Add all event listeners
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      // Remove all event listeners
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('contextmenu', handleContextMenu);
      
      // Exit fullscreen when component unmounts
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    };
  }, [isViewMode, assessmentData, violationCount]);

  const handleClose = (result?: { 
    score: number; 
    passed: boolean; 
    autoSubmitted?: boolean; 
    violations?: number 
  }) => {
    // Exit fullscreen before navigating
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }

    // Log additional result data if provided
    if (result?.autoSubmitted) {
      console.log('Assessment auto-submitted due to violations:', result.violations);
    }

    // Find the course and module for this assessment
    let foundCourse = null;
    let foundModule = null;
    
    for (const course of mockCourses) {
      for (const module of course.modules) {
        for (const topic of module.topics) {
          const assessmentItem = topic.items.find(item => item.id === assessmentId);
          if (assessmentItem) {
            foundCourse = course;
            foundModule = module;
            break;
          }
        }
        if (foundCourse) break;
      }
      if (foundCourse) break;
    }

    // Navigate back to module content page or provided courseId/moduleId
    const targetCourseId = courseId || foundCourse?.id;
    const targetModuleId = moduleId || foundModule?.id;
    
    if (targetCourseId && targetModuleId) {
      navigate(`/course/${targetCourseId}/module/${targetModuleId}`);
    } else {
      navigate('/dashboard');
    }
  };

  // Violation management functions
  const handleViolation = (type: string) => {
    if (isViewMode) return; // No violations in view mode
    
    const newCount = violationCount + 1;
    setViolationCount(newCount);
    
    console.log(`Violation detected: ${type}. Count: ${newCount}/3`);
    
    if (newCount >= 3) {
      // Auto-submit assessment after 3 violations
      console.log('3 violations reached. Auto-submitting assessment...');
      autoSubmitAssessment();
    } else {
      setShowViolationModal(true);
    }
  };

  const autoSubmitAssessment = () => {
    // Auto-submit logic with partial score
    const autoSubmitScore = Math.max(0, Math.floor(Math.random() * 40)); // Random low score
    
    // Exit fullscreen first
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    
    // Show results with auto-submitted status
    setTimeout(() => {
      handleClose({ 
        score: autoSubmitScore, 
        passed: autoSubmitScore >= (assessmentData?.passScore || 60),
        autoSubmitted: true,
        violations: violationCount
      });
    }, 1000);
  };

  const getTimeRemaining = () => {
    if (!assessmentData?.endDate) return "";
    
    const now = new Date();
    const end = new Date(assessmentData.endDate);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return "Time's up!";
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    }
    return `${minutes}m remaining`;
  };

  // Update time remaining periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(getTimeRemaining());
    }, 60000); // Update every minute

    setTimeRemaining(getTimeRemaining()); // Initial set
    
    return () => clearInterval(interval);
  }, [assessmentData]);

  // Modal handlers
  const handleExitAssessment = () => {
    setShowExitWarning(false);
    autoSubmitAssessment();
  };

  const handleStayInAssessment = () => {
    setShowExitWarning(false);
  };

  const handleViolationContinue = () => {
    setShowViolationModal(false);
  };

  if (!assessmentData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading Assessment...</h2>
          <p className="text-muted-foreground">Please wait while we load the assessment.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <AssessmentInstructions
        assessmentTitle={assessmentData.title}
        duration={assessmentData.duration}
        assessmentId={assessmentData.id}
        isViewMode={isViewMode}
        viewModeData={isViewMode ? {
          score: assessmentData.score || 0,
          passed: (assessmentData.score || 0) >= assessmentData.passScore,
          answers: {}
        } : undefined}
        onClose={handleClose}
      />

      {/* Exit Warning Modal */}
      <AssessmentExitWarningModal
        isOpen={showExitWarning}
        onStayInAssessment={handleStayInAssessment}
        onExitAndSubmit={handleExitAssessment}
        assessmentTitle={assessmentData.title}
        timeRemaining={timeRemaining}
      />

      {/* Violation Modal */}
      <ViolationModal
        isOpen={showViolationModal}
        onClose={handleViolationContinue}
        violation={violationCount > 0 ? { type: 'fullscreen-exit', count: violationCount } : null}
      />
    </>
  );
};

export default AssessmentPage; 