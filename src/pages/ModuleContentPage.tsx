import { useState, useEffect, useReducer } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { mockCourses, Module, TopicItem } from "@/lib/mockData";
import Header from "@/components/Header";
import ModuleSidebar from "@/components/ModuleSidebar";
import ModuleContentRenderer from "@/components/ModuleContentRenderer";
import MobileSidebar from "@/components/MobileSidebar";

// Navigation State Types
interface NavigationState {
  lastSelectedItemId: string;
  lastSelectedTopicId: string;
  returnPath: string;
  timestamp: number;
}

// State Management Types
interface ModuleItemState extends TopicItem {
  // Additional session-specific state fields
  submissionText?: string;
  quizAnswers?: { [questionId: string]: string };
  feedbackAnswers?: { [questionId: string]: string };
  watchedPercentage?: number;
  violationCount?: number;
  assessmentAttempts?: number;
  lastAttemptScore?: number;
}

interface ModuleSessionState {
  items: { [itemId: string]: ModuleItemState };
  moduleId: string;
}

type ModuleAction = 
  | { type: 'INITIALIZE_MODULE'; payload: { moduleId: string; items: TopicItem[] } }
  | { type: 'UPDATE_ITEM_STATUS'; payload: { itemId: string; status: TopicItem['status'] } }
  | { type: 'UPDATE_ITEM_FIELD'; payload: { itemId: string; field: keyof ModuleItemState; value: any } }
  | { type: 'SUBMIT_ASSIGNMENT'; payload: { itemId: string; submissionLink: string } }
  | { type: 'SUBMIT_QUIZ'; payload: { itemId: string; answers: { [questionId: string]: string } } }
  | { type: 'SUBMIT_FEEDBACK'; payload: { itemId: string; answers: { [questionId: string]: string } } }
  | { type: 'MARK_VIDEO_WATCHED'; payload: { itemId: string; percentage: number } }
  | { type: 'MARK_ARTICLE_READ'; payload: { itemId: string } }
  | { type: 'JOIN_LIVE_CLASS'; payload: { itemId: string } }
  | { type: 'COMPLETE_CODING_PROBLEM'; payload: { itemId: string; testCasesPassed: number; totalTestCases: number; solutionCode?: string } }
  | { type: 'UPDATE_ASSESSMENT_ATTEMPT'; payload: { itemId: string; score?: number; state: string; violationCount?: number } }
  | { type: 'REQUEST_ASSESSMENT_REATTEMPT'; payload: { itemId: string } };

// State Management Reducer
const moduleSessionReducer = (state: ModuleSessionState, action: ModuleAction): ModuleSessionState => {
  switch (action.type) {
    case 'INITIALIZE_MODULE':
      const { moduleId, items } = action.payload;
      const itemsMap: { [itemId: string]: ModuleItemState } = {};
      
      items.forEach(item => {
        itemsMap[item.id] = { ...item };
      });
      
      return {
        moduleId,
        items: itemsMap
      };

    case 'UPDATE_ITEM_STATUS':
      return {
        ...state,
        items: {
          ...state.items,
          [action.payload.itemId]: {
            ...state.items[action.payload.itemId],
            status: action.payload.status
          }
        }
      };

    case 'UPDATE_ITEM_FIELD':
      return {
        ...state,
        items: {
          ...state.items,
          [action.payload.itemId]: {
            ...state.items[action.payload.itemId],
            [action.payload.field]: action.payload.value
          }
        }
      };

    case 'SUBMIT_ASSIGNMENT':
      return {
        ...state,
        items: {
          ...state.items,
          [action.payload.itemId]: {
            ...state.items[action.payload.itemId],
            status: 'completed',
            submissionLink: action.payload.submissionLink,
            submissionText: action.payload.submissionLink
          }
        }
      };

    case 'SUBMIT_QUIZ':
      return {
        ...state,
        items: {
          ...state.items,
          [action.payload.itemId]: {
            ...state.items[action.payload.itemId],
            status: 'completed',
            quizAnswers: action.payload.answers
          }
        }
      };

    case 'SUBMIT_FEEDBACK':
      return {
        ...state,
        items: {
          ...state.items,
          [action.payload.itemId]: {
            ...state.items[action.payload.itemId],
            status: 'completed',
            feedbackAnswers: action.payload.answers
          }
        }
      };

    case 'MARK_VIDEO_WATCHED':
      return {
        ...state,
        items: {
          ...state.items,
          [action.payload.itemId]: {
            ...state.items[action.payload.itemId],
            status: action.payload.percentage >= 90 ? 'completed' : 'in-progress',
            watchedPercentage: action.payload.percentage
          }
        }
      };

    case 'MARK_ARTICLE_READ':
      return {
        ...state,
        items: {
          ...state.items,
          [action.payload.itemId]: {
            ...state.items[action.payload.itemId],
            status: 'completed'
          }
        }
      };

    case 'JOIN_LIVE_CLASS':
      return {
        ...state,
        items: {
          ...state.items,
          [action.payload.itemId]: {
            ...state.items[action.payload.itemId],
            status: 'completed'
          }
        }
      };

    case 'COMPLETE_CODING_PROBLEM':
      return {
        ...state,
        items: {
          ...state.items,
          [action.payload.itemId]: {
            ...state.items[action.payload.itemId],
            status: 'completed',
            testCasesPassed: action.payload.testCasesPassed,
            totalTestCases: action.payload.totalTestCases,
            solutionCode: action.payload.solutionCode
          }
        }
      };

    case 'UPDATE_ASSESSMENT_ATTEMPT':
      return {
        ...state,
        items: {
          ...state.items,
          [action.payload.itemId]: {
            ...state.items[action.payload.itemId],
            status: action.payload.state === 'completed' ? 'completed' : state.items[action.payload.itemId].status,
            lastAttemptScore: action.payload.score,
            violationCount: action.payload.violationCount ?? state.items[action.payload.itemId].violationCount ?? 0,
            assessmentAttempts: (state.items[action.payload.itemId].assessmentAttempts ?? 0) + 1
          }
        }
      };

    case 'REQUEST_ASSESSMENT_REATTEMPT':
      return {
        ...state,
        items: {
          ...state.items,
          [action.payload.itemId]: {
            ...state.items[action.payload.itemId],
            status: 'not-started', // Reset status to allow re-attempt
            violationCount: 0       // Reset violations for fresh attempt
          }
        }
      };

    default:
      return state;
  }
};

const ModuleContentPage = () => {
  const { courseId, moduleId } = useParams();
  const location = useLocation();
  const course = mockCourses.find(c => c.id === courseId);
  const [selectedItem, setSelectedItem] = useState<string>("");
  const [isMobile, setIsMobile] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Initialize session state management
  const [moduleState, dispatch] = useReducer(moduleSessionReducer, {
    items: {},
    moduleId: moduleId || ""
  });

  // Navigation state management functions
  const saveNavigationState = (itemId: string, topicId: string) => {
    if (!courseId || !moduleId) return;
    
    const navigationState: NavigationState = {
      lastSelectedItemId: itemId,
      lastSelectedTopicId: topicId,
      returnPath: location.pathname,
      timestamp: Date.now()
    };
    
    sessionStorage.setItem(
      `navigation-state-${courseId}-${moduleId}`, 
      JSON.stringify(navigationState)
    );
  };

  const restoreNavigationState = (): NavigationState | null => {
    if (!courseId || !moduleId) return null;
    
    const saved = sessionStorage.getItem(`navigation-state-${courseId}-${moduleId}`);
    if (!saved) return null;
    
    try {
      const navigationState: NavigationState = JSON.parse(saved);
      // Check if the state is recent (within last 30 minutes)
      const isRecent = Date.now() - navigationState.timestamp < 30 * 60 * 1000;
      return isRecent ? navigationState : null;
    } catch {
      return null;
    }
  };

  const findTopicIdForItem = (itemId: string): string => {
    if (!enhancedModule) return "";
    
    for (const topic of enhancedModule.topics) {
      if (topic.items.some(item => item.id === itemId)) {
        return topic.id;
      }
    }
    return "";
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Listen for assessment completion messages from standalone assessment window
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      
      if (event.data.type === 'ASSESSMENT_COMPLETED') {
        const { assessmentId, score, state, violationCount } = event.data.payload;
        handleAssessmentUpdate(assessmentId, { score, state, violationCount });
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    if (course && moduleId) {
      const module = course.modules.find(m => m.id === moduleId);
      if (module && module.topics.length > 0) {
        // Try to restore navigation state first
        const savedState = restoreNavigationState();
        if (savedState && savedState.lastSelectedItemId) {
          // Verify the item still exists in the module
          const itemExists = module.topics.some(topic => 
            topic.items.some(item => item.id === savedState.lastSelectedItemId)
          );
          if (itemExists) {
            setSelectedItem(savedState.lastSelectedItemId);
            return;
          }
        }
        
        // Fallback to first item if no saved state or item doesn't exist
        if (module.topics[0].items.length > 0) {
          setSelectedItem(module.topics[0].items[0].id);
        }
      }
    }
  }, [course, moduleId]);

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-heading font-bold mb-2">Course Not Found</h1>
          <Button asChild>
            <Link to="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  const currentModule = course.modules.find(m => m.id === moduleId);
  
  if (!currentModule) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-heading font-bold mb-2">Module Not Found</h1>
          <Button asChild>
            <Link to={`/course/${courseId}`}>Back to Course</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Use current module directly since duplicates are now removed from mock data
  const enhancedModule: Module = currentModule;

  // Initialize module state when module data is available
  useEffect(() => {
    if (enhancedModule && moduleId) {
      const allItems: TopicItem[] = [];
      
      // Collect all items from all topics in the module
      enhancedModule.topics.forEach(topic => {
        allItems.push(...topic.items);
      });
      
      // Initialize the state management with all items
      dispatch({
        type: 'INITIALIZE_MODULE',
        payload: {
          moduleId,
          items: allItems
        }
      });
    }
  }, [moduleId, enhancedModule]);

  // Get item from session state or fallback to mock data
  const getItemWithSessionState = (itemId: string): ModuleItemState | null => {
    return moduleState.items[itemId] || null;
  };

  // Assessment data mapping with fixed state logic and specific styling
  const getAssessmentData = (itemId: string) => {
    const sessionItem = getItemWithSessionState(itemId);
    
    const baseAssessmentMap: { [key: string]: any } = {
      'dom-concepts-assessment': {
        id: 'dom-concepts-assessment',
        title: 'DOM Concepts Assessment',
        description: 'This assessment covers DOM manipulation, event handling, and interactive web development concepts. Complete coding problems, MCQ quiz, and open-ended questions.',
        startDate: new Date('2024-11-15T09:00:00'),
        endDate: new Date('2024-11-22T23:59:00'),
        duration: '2 hours',
        totalMarks: 100,
        passScore: 60,
        state: 'open',
        attemptStatus: 'Not Attempted',
        styling: {
          backgroundColor: 'bg-info-light',
          textStyle: 'font-semibold',
          borderColor: 'border-info',
          ctaStyle: 'bg-primary text-primary-foreground hover:bg-primary/90'
        }
      },
      'high-score-assessment': {
        id: 'high-score-assessment',
        title: 'JavaScript Fundamentals Assessment',
        description: 'Comprehensive assessment covering JavaScript basics, data types, functions, and control structures.',
        startDate: new Date('2024-11-10T09:00:00'),
        endDate: new Date('2024-11-15T23:59:00'),
        duration: '90 minutes',
        totalMarks: 100,
        passScore: 60,
        state: 'completed',
        score: 85,
        attemptStatus: 'Attempted',
        styling: {
          borderColor: 'border-success',
          ctaStyle: 'bg-success text-white hover:bg-success/90'
        }
      },
      'low-score-assessment': {
        id: 'low-score-assessment',
        title: 'Event Handling Assessment',
        description: 'Assessment focusing on event handling, user interactions, and dynamic content updates.',
        startDate: new Date('2024-11-12T14:30:00'),
        endDate: new Date('2024-11-17T23:59:00'),
        duration: '75 minutes',
        totalMarks: 100,
        passScore: 60,
        state: 'completed',
        score: 45,
        attemptStatus: 'Attempted',
        styling: {
          borderColor: 'border-destructive',
          ctaStyle: 'bg-destructive text-white hover:bg-destructive/90'
        }
      },
      'expired-assessment': {
        id: 'expired-assessment',
        title: 'DOM Manipulation Final Test',
        description: 'Final comprehensive assessment covering all DOM manipulation concepts and techniques.',
        startDate: new Date('2024-11-05T10:00:00'),
        endDate: new Date('2024-11-12T23:59:00'),
        duration: '3 hours',
        totalMarks: 100,
        passScore: 60,
        state: 'expired',
        attemptStatus: 'Not Attempted',
        styling: {
          backgroundColor: 'bg-destructive-light',
          textStyle: 'text-sm',
          borderColor: 'border-destructive'
        }
      },
      'scheduled-assessment': {
        id: 'scheduled-assessment',
        title: 'JavaScript Advanced Concepts',
        description: 'This assessment will demonstrate the re-attempt flow and complete assessment experience.',
        startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 23 * 60 * 60 * 1000),
        duration: '2 hours',
        totalMarks: 100,
        passScore: 60,
        state: 'interrupted',
        attemptStatus: 'Interrupted',
        styling: {
          backgroundColor: 'bg-warning-light',
          borderColor: 'border-warning',
          textColor: 'text-black',
          ctaStyle: 'bg-warning text-black hover:bg-warning/90'
        }
      },
      'static-scheduled-assessment': {
        id: 'static-scheduled-assessment',
        title: 'React Advanced Patterns Assessment',
        description: 'Assessment on advanced React patterns, hooks, and performance optimization.',
        startDate: new Date('2024-11-18T09:00:00'),
        endDate: new Date('2024-11-20T23:59:00'),
        duration: '90 minutes',
        totalMarks: 100,
        passScore: 60,
        state: 'scheduled',
        attemptStatus: 'Not Attempted',
        styling: {
          backgroundColor: 'bg-info-light',
          borderColor: 'border-info',
          textStyle: 'font-semibold',
          textColor: 'text-info',
          topLineStyle: '', // Remove "Assessment Scheduled" text
          scheduledForStyle: 'font-semibold text-info',
          startsInStyle: 'text-base font-bold',
          removeBackgroundFromTimer: true
        }
      }
    };
    
    const baseData = baseAssessmentMap[itemId];
    if (!baseData) return null;
    
    // Enhance with session state data if available
    if (sessionItem) {
      const enhancedData = { ...baseData };
      
      // Update state based on session data
      if (sessionItem.status === 'completed' && sessionItem.lastAttemptScore !== undefined) {
        enhancedData.state = 'completed';
        enhancedData.score = sessionItem.lastAttemptScore;
        enhancedData.attemptStatus = 'Attempted';
      } else if (sessionItem.status === 'in-progress') {
        enhancedData.state = 'interrupted';
        enhancedData.attemptStatus = 'Interrupted';
      }
      
      // Add attempt and violation data
      enhancedData.attempts = sessionItem.assessmentAttempts || 0;
      enhancedData.violations = sessionItem.violationCount || 0;
      
      return enhancedData;
    }
    
    return baseData;
  };

  const getSelectedItem = () => {
    for (const topic of enhancedModule.topics) {
      const baseItem = topic.items.find(item => item.id === selectedItem);
      if (baseItem) {
        // Use session state if available, otherwise use base item
        const sessionItem = getItemWithSessionState(baseItem.id);
        const item = sessionItem || baseItem;
        return { item, topicId: topic.id };
      }
    }
    return null;
  };

  const selectedItemData = getSelectedItem();

  const getAllItems = () => {
    const items: { item: TopicItem; topicId: string }[] = [];
    enhancedModule.topics.forEach(topic => {
      topic.items.forEach(item => {
        items.push({ item, topicId: topic.id });
      });
    });
    return items;
  };

  const handleItemSelect = (itemId: string) => {
    setSelectedItem(itemId);
    
    // Save navigation state for restoration
    const topicId = findTopicIdForItem(itemId);
    if (topicId) {
      saveNavigationState(itemId, topicId);
    }
    
    if (isMobile) {
      setIsSheetOpen(false);
    }
  };

  // State Update Handlers - Sub-task 2.2
  const handleAssignmentSubmission = (itemId: string, submissionLink: string) => {
    dispatch({
      type: 'SUBMIT_ASSIGNMENT',
      payload: { itemId, submissionLink }
    });
  };

  const handleQuizSubmission = (itemId: string, answers: { [questionId: string]: string }) => {
    dispatch({
      type: 'SUBMIT_QUIZ',
      payload: { itemId, answers }
    });
  };

  const handleFeedbackSubmission = (itemId: string, answers: { [questionId: string]: string }) => {
    dispatch({
      type: 'SUBMIT_FEEDBACK',
      payload: { itemId, answers }
    });
  };

  const handleVideoWatch = (itemId: string, percentage: number) => {
    dispatch({
      type: 'MARK_VIDEO_WATCHED',
      payload: { itemId, percentage }
    });
  };

  const handleArticleRead = (itemId: string) => {
    dispatch({
      type: 'MARK_ARTICLE_READ',
      payload: { itemId }
    });
  };

  const handleLiveClassJoin = (itemId: string) => {
    dispatch({
      type: 'JOIN_LIVE_CLASS',
      payload: { itemId }
    });
  };

  const handleCodingProblemCompletion = (itemId: string, testCasesPassed: number, totalTestCases: number, solutionCode?: string) => {
    dispatch({
      type: 'COMPLETE_CODING_PROBLEM',
      payload: { itemId, testCasesPassed, totalTestCases, solutionCode }
    });
  };

  const handleAssessmentUpdate = (itemId: string, updates: { score?: number; state: string; violationCount?: number }) => {
    dispatch({
      type: 'UPDATE_ASSESSMENT_ATTEMPT',
      payload: { itemId, ...updates }
    });
  };

  const handleItemStatusUpdate = (itemId: string, status: TopicItem['status']) => {
    dispatch({
      type: 'UPDATE_ITEM_STATUS',
      payload: { itemId, status }
    });
  };

  const handleItemFieldUpdate = (itemId: string, field: keyof ModuleItemState, value: any) => {
    dispatch({
      type: 'UPDATE_ITEM_FIELD',
      payload: { itemId, field, value }
    });
  };

  const handleAssessmentReAttempt = (itemId: string) => {
    dispatch({
      type: 'REQUEST_ASSESSMENT_REATTEMPT',
      payload: { itemId }
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {isMobile && (
        <div className="lg:hidden px-4 py-4 border-b border-border">
          <h2 className="text-lg font-heading font-semibold">Module {moduleId}: {enhancedModule.name}</h2>
        </div>
      )}

      <div className="flex h-[calc(100vh-80px)] lg:h-[calc(100vh-80px)]">
        {!isMobile && (
          <ModuleSidebar
            courseId={courseId!}
            moduleId={moduleId!}
            module={enhancedModule}
            selectedItem={selectedItem}
            onItemSelect={handleItemSelect}
          />
        )}

        <div className={`flex-1 ${!isMobile ? 'ml-80' : ''} flex flex-col`}>
          <div className="flex-1 overflow-y-auto">
            <ModuleContentRenderer
              selectedItemData={selectedItemData}
              getAssessmentData={getAssessmentData}
              sessionStateHandlers={{
                handleAssignmentSubmission,
                handleQuizSubmission,
                handleFeedbackSubmission,
                handleVideoWatch,
                handleArticleRead,
                handleLiveClassJoin,
                handleCodingProblemCompletion,
                handleAssessmentUpdate,
                handleAssessmentReAttempt,
                handleItemStatusUpdate,
                handleItemFieldUpdate
              }}
            />
          </div>
        </div>
      </div>

      {isMobile && (
        <MobileSidebar
          isOpen={isSheetOpen}
          onOpenChange={setIsSheetOpen}
          onItemSelect={handleItemSelect}
        >
          <ModuleSidebar
            courseId={courseId!}
            moduleId={moduleId!}
            module={enhancedModule}
            selectedItem={selectedItem}
            onItemSelect={handleItemSelect}
          />
        </MobileSidebar>
      )}
    </div>
  );
};

export default ModuleContentPage;
