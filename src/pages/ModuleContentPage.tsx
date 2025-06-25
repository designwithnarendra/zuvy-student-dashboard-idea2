import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { mockCourses, Module, TopicItem } from "@/lib/mockData";
import Header from "@/components/Header";
import ModuleSidebar from "@/components/ModuleSidebar";
import ModuleContentRenderer from "@/components/ModuleContentRenderer";
import ModuleNavigation from "@/components/ModuleNavigation";
import MobileSidebar from "@/components/MobileSidebar";

const ModuleContentPage = () => {
  const { courseId, moduleId } = useParams();
  const course = mockCourses.find(c => c.id === courseId);
  const [selectedItem, setSelectedItem] = useState<string>("");
  const [isMobile, setIsMobile] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (course && moduleId) {
      const module = course.modules.find(m => m.id === moduleId);
      if (module && module.topics.length > 0) {
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

  // Enhanced module with additional content for module 2
  const enhancedModule: Module = moduleId === '2' ? {
    ...currentModule,
    topics: [
      {
        ...currentModule.topics[0],
        items: [
          ...currentModule.topics[0].items,
          {
            id: 'dom-quiz-1',
            title: 'DOM Fundamentals Quiz',
            type: 'quiz',
            status: 'not-completed',
            description: 'Test your understanding of DOM basics with multiple choice questions.'
          },
          {
            id: 'course-feedback-1',
            title: 'Module 2 Feedback',
            type: 'feedback',
            status: 'not-completed',
            description: 'Share your feedback about this module to help us improve.'
          },
          {
            id: 'coding-problem-1',
            title: 'Array Manipulation Challenge',
            type: 'coding-problem',
            status: 'not-completed',
            description: 'Practice array manipulation techniques with this coding problem.'
          }
        ]
      },
      ...currentModule.topics.slice(1),
      {
        id: 'assessments',
        name: 'Assessments',
        description: 'Module assessments and evaluations',
        items: [
          {
            id: 'dom-concepts-assessment',
            title: 'DOM Concepts Assessment',
            type: 'assessment',
            status: 'not-completed',
            description: 'Test your understanding of DOM concepts and manipulation techniques.',
            scheduledDateTime: new Date(Date.now() + 10000),
            duration: '2 hours'
          },
          {
            id: 'high-score-assessment',
            title: 'JavaScript Fundamentals Assessment',
            type: 'assessment',
            status: 'completed',
            description: 'Comprehensive test covering JavaScript basics and advanced concepts.'
          },
          {
            id: 'low-score-assessment',
            title: 'Event Handling Assessment',
            type: 'assessment',
            status: 'completed',
            description: 'Assessment focusing on event handling and user interactions.'
          },
          {
            id: 'expired-assessment',
            title: 'DOM Manipulation Final Test',
            type: 'assessment',
            status: 'not-completed',
            description: 'Final assessment for DOM manipulation concepts.'
          }
        ]
      }
    ]
  } : currentModule;

  // Assessment data mapping with fixed state logic
  const getAssessmentData = (itemId: string) => {
    const assessmentMap: { [key: string]: any } = {
      'dom-concepts-assessment': {
        id: 'dom-concepts-assessment',
        title: 'DOM Concepts Assessment',
        description: 'This assessment covers DOM manipulation, event handling, and interactive web development concepts. Complete coding problems, MCQ quiz, and open-ended questions.',
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        duration: '2 hours',
        totalMarks: 100,
        passScore: 60,
        state: 'scheduled',
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
        score: 70,
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
        score: 30,
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
      }
    };
    
    return assessmentMap[itemId];
  };

  const getSelectedItem = () => {
    for (const topic of enhancedModule.topics) {
      const item = topic.items.find(item => item.id === selectedItem);
      if (item) return { item, topicId: topic.id };
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

  const allItems = getAllItems();
  const currentIndex = allItems.findIndex(({ item }) => item.id === selectedItem);
  const prevItem = currentIndex > 0 ? allItems[currentIndex - 1] : null;
  const nextItem = currentIndex < allItems.length - 1 ? allItems[currentIndex + 1] : null;

  const handleItemSelect = (itemId: string) => {
    setSelectedItem(itemId);
    if (isMobile) {
      setIsSheetOpen(false);
    }
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

        <div className={`flex-1 ${!isMobile ? 'ml-80' : ''} overflow-y-auto flex flex-col`}>
          <div className="flex-1">
            <ModuleContentRenderer
              selectedItemData={selectedItemData}
              getAssessmentData={getAssessmentData}
            />
          </div>
          
          <ModuleNavigation
            prevItem={prevItem}
            nextItem={nextItem}
            onItemSelect={handleItemSelect}
          />
        </div>
      </div>

      {isMobile && (
        <MobileSidebar
          isOpen={isSheetOpen}
          onOpenChange={setIsSheetOpen}
          prevItem={prevItem}
          nextItem={nextItem}
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
