
import { Module, TopicItem } from "@/lib/mockData";

export const enhanceModule = (currentModule: Module, moduleId: string): Module => {
  if (moduleId !== '2') return currentModule;

  return {
    ...currentModule,
    topics: [
      {
        ...currentModule.topics[0],
        items: [
          ...currentModule.topics[0].items,
          {
            id: 'dom-quiz-1',
            title: 'DOM Fundamentals Quiz',
            type: 'quiz' as any,
            status: 'not-started',
            description: 'Test your understanding of DOM basics with multiple choice questions.'
          },
          {
            id: 'course-feedback-1',
            title: 'Module 2 Feedback',
            type: 'feedback' as any,
            status: 'not-started',
            description: 'Share your feedback about this module to help us improve.'
          },
          {
            id: 'coding-problem-1',
            title: 'Array Manipulation Challenge',
            type: 'coding-problem' as any,
            status: 'not-started',
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
            status: 'not-started',
            description: 'Test your understanding of DOM concepts and manipulation techniques.',
            scheduledDateTime: new Date(Date.now() + 10000),
            duration: '2 hours'
          },
          {
            id: 'interrupted-assessment',
            title: 'React Fundamentals Assessment',
            type: 'assessment',
            status: 'in-progress',
            description: 'Assessment covering React basics, components, state management, and hooks.'
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
            status: 'not-started',
            description: 'Final assessment for DOM manipulation concepts.'
          },
          {
            id: 'reattempt-assessment',
            title: 'CSS Fundamentals Assessment',
            type: 'assessment',
            status: 'in-progress',
            description: 'Assessment covering CSS selectors, styling, and layout techniques.'
          },
          {
            id: 'reattempt-flow-assessment',
            title: 'HTML Structure Assessment',
            type: 'assessment',
            status: 'in-progress',
            description: 'Assessment covering HTML structure, semantics, and accessibility.'
          }
        ] as TopicItem[]
      }
    ]
  };
};
