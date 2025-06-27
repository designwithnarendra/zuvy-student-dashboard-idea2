
export const getAssessmentData = (itemId: string) => {
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
    'interrupted-assessment': {
      id: 'interrupted-assessment',
      title: 'React Fundamentals Assessment',
      description: 'Assessment covering React basics, components, state management, and hooks.',
      startDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      duration: '90 minutes',
      totalMarks: 100,
      passScore: 60,
      state: 'interrupted',
      attemptStatus: 'Interrupted'
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
    },
    'reattempt-assessment': {
      id: 'reattempt-assessment',
      title: 'CSS Fundamentals Assessment',
      description: 'Assessment covering CSS selectors, styling, and layout techniques.',
      startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      duration: '2 hours',
      totalMarks: 100,
      passScore: 60,
      state: 'reAttemptRequested',
      attemptStatus: 'Interrupted'
    },
    'reattempt-flow-assessment': {
      id: 'reattempt-flow-assessment',
      title: 'HTML Structure Assessment',
      description: 'Assessment covering HTML structure, semantics, and accessibility.',
      startDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      duration: '90 minutes',
      totalMarks: 100,
      passScore: 60,
      state: 'reAttemptFlow',
      attemptStatus: 'Interrupted'
    }
  };
  
  return assessmentMap[itemId];
};
