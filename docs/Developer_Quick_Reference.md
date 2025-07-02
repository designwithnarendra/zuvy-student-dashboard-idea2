# Developer Quick Reference Guide

## 1. Component State Management

### Session Storage Pattern
```typescript
// Store component state
sessionStorage.setItem(`component-type-${uniqueId}`, JSON.stringify({
  data: componentData,
  submissionTime: new Date().toISOString()
}));

// Restore component state on mount
useEffect(() => {
  const saved = sessionStorage.getItem(`component-type-${uniqueId}`);
  if (saved) {
    const parsed = JSON.parse(saved);
    restoreComponentState(parsed);
  }
}, [uniqueId]);
```

### Component Independence
- **Always use unique IDs**: Prevent state bleeding between similar components
- **Check for existing state**: Restore on component mount
- **Clear state appropriately**: Only on browser close, not navigation

## 2. New Components Added

### CodingSubmissionModal
```typescript
import CodingSubmissionModal from "@/components/CodingSubmissionModal";

<CodingSubmissionModal
  isOpen={showModal}
  onViewSolution={() => navigate('/solution')}
  onReturnToCourse={() => navigate('/course')}
  problemTitle="Array Manipulation"
  score="5/5 test cases passed"
/>
```

### FullscreenWarningModal
```typescript
import FullscreenWarningModal from "@/components/FullscreenWarningModal";

<FullscreenWarningModal
  isOpen={showWarning}
  onProceed={handleEnterFullscreen}
  onCancel={handleCancel}
  assessmentTitle="JavaScript Fundamentals"
/>
```

## 3. Enhanced Component Props

### MCQQuiz
```typescript
<MCQQuiz
  quiz={quizData}
  quizId={`${assessmentId}-mcq-${index}`} // Unique ID
  onBack={() => setCurrentView('instructions')}
  onComplete={() => handleCompletion()}
  timeLeft="1:30:00"
  isViewMode={false}
/>
```

### OpenEndedQuestions
```typescript
<OpenEndedQuestions
  questionsId={`${assessmentId}-openended`} // Unique ID
  onBack={() => setCurrentView('instructions')}
  onComplete={() => handleCompletion()}
  timeLeft="1:30:00"
  isViewMode={false}
/>
```

### CodingChallenge
```typescript
<CodingChallenge
  challenge={challengeData}
  challengeIndex={0} // For individual tracking
  onBack={() => setCurrentView('instructions')}
  onComplete={() => handleCompletion()}
  timeLeft="1:30:00"
  initialCode="// Starter code for this challenge"
/>
```

## 4. Fullscreen Management

### Assessment Page Pattern
```typescript
useEffect(() => {
  if (!isViewMode && assessmentData) {
    // Enter fullscreen
    const enterFullscreen = async () => {
      try {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } catch (error) {
        console.log('Fullscreen not supported');
      }
    };
    enterFullscreen();
  }

  // Listen for fullscreen changes
  const handleFullscreenChange = () => {
    const isCurrentlyFullscreen = Boolean(document.fullscreenElement);
    if (!isCurrentlyFullscreen && !isViewMode) {
      // Handle violation
      console.log('Fullscreen violation detected');
    }
  };

  document.addEventListener('fullscreenchange', handleFullscreenChange);
  
  return () => {
    document.removeEventListener('fullscreenchange', handleFullscreenChange);
    // Exit fullscreen on cleanup
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  };
}, [isViewMode, assessmentData]);
```

## 5. Navigation Patterns

### Coding Problem Flow
```typescript
// Module Content
const handleStartPractice = () => {
  window.location.href = `/coding-problem/${itemId}`;
};

// Coding Problem Page
const handleSubmit = () => {
  setShowSubmissionModal(true);
  // Store in sessionStorage
  sessionStorage.setItem(`coding-problem-${itemId}`, JSON.stringify({
    submissionState: 'submitted',
    submittedCode: code,
    submissionTime: new Date().toISOString()
  }));
};

// Modal choices
const handleViewSolution = () => {
  navigate(`/solution-viewer/${itemId}`);
};

const handleReturnToCourse = () => {
  navigate(`/course/${courseId}/module/${moduleId}`);
};
```

### Assessment Component Navigation
```typescript
// All assessment components return to instructions
const handleBack = () => {
  setCurrentView('instructions');
};

// Submit stays on page for MCQ and Open Ended
const handleSubmit = () => {
  setIsSubmitted(true);
  setShowSubmittedView(true);
  // Don't navigate - stay on page
};
```

## 6. State Restoration Patterns

### Check for Existing Submissions
```typescript
// In ModuleContentRenderer for coding problems
const submissionData = sessionStorage.getItem(`coding-problem-${item.id}`);
const sessionSubmissionState = submissionData ? 
  JSON.parse(submissionData).submissionState : null;

const submissionState = sessionSubmissionState || 
  itemState.submissionState || 'not-started';
```

### Component Mount Restoration
```typescript
useEffect(() => {
  const submissionData = sessionStorage.getItem(`component-${uniqueId}`);
  if (submissionData) {
    const parsed = JSON.parse(submissionData);
    // Restore all component state
    setAnswers(parsed.answers);
    setIsSubmitted(true);
    setShowSubmittedView(true);
  }
}, [uniqueId]);
```

## 7. Key SessionStorage Keys

| Component Type | Key Pattern | Example |
|---|---|---|
| Coding Problem | `coding-problem-${itemId}` | `coding-problem-1` |
| MCQ Quiz | `mcq-quiz-${quizId}` | `mcq-quiz-assessment-1-mcq-0` |
| Open Ended | `open-ended-${questionsId}` | `open-ended-assessment-1-openended` |
| Coding Challenge | `coding-challenge-${challengeIndex}` | `coding-challenge-0` |

## 8. Common Pitfalls to Avoid

### ❌ Don't Do This
```typescript
// Shared state between components
const [globalSubmissionState, setGlobalSubmissionState] = useState({});

// Using localStorage for session data
localStorage.setItem('quiz-answers', JSON.stringify(answers));

// Not checking for existing state
const [answers, setAnswers] = useState([]);
```

### ✅ Do This
```typescript
// Individual component state
const [answers, setAnswers] = useState([]);
const [isSubmitted, setIsSubmitted] = useState(false);

// Using sessionStorage for session data
sessionStorage.setItem(`mcq-quiz-${uniqueId}`, JSON.stringify(data));

// Always check for existing state
useEffect(() => {
  const existing = sessionStorage.getItem(`component-${uniqueId}`);
  if (existing) {
    restoreState(JSON.parse(existing));
  }
}, [uniqueId]);
```

## 9. Testing Checklist

### Component Independence
- [ ] Multiple instances of same component work independently
- [ ] Submitting one component doesn't affect others
- [ ] Navigation preserves individual states

### Session Persistence
- [ ] State survives page navigation
- [ ] State persists through browser refresh
- [ ] State clears on browser close

### User Experience
- [ ] Clear success/error feedback
- [ ] Proper loading states
- [ ] Intuitive navigation flows

## 10. Debugging Tips

### Check SessionStorage
```javascript
// In browser console
Object.keys(sessionStorage).filter(key => key.includes('coding-problem'))
JSON.parse(sessionStorage.getItem('mcq-quiz-assessment-1-mcq-0'))
```

### Verify Component Props
```typescript
// Add debug logging
console.log('Component mounted with:', { uniqueId, initialData });
console.log('Restored state:', submissionData);
```

### Test Independence
- Open multiple instances in different tabs
- Submit one and check others remain unaffected
- Navigate between components and verify states 