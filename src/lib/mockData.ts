export interface Student {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface Course {
  id: string;
  name: string;
  description: string;
  instructor: {
    name: string;
    avatar: string;
  };
  image: string;
  progress: number;
  status: 'enrolled' | 'completed';
  batchName: string;
  duration: string;
  studentsEnrolled: number;
  upcomingItems: UpcomingItem[];
  modules: Module[];
  projects: Project[];
  attendanceStats: {
    percentage: number;
    attended: number;
    total: number;
    recentClasses: RecentClass[];
  };
  currentModule: {
    id: string;
    name: string;
    currentChapter: string;
    currentItem: string;
    nextItem: {
      type: string;
      name: string;
      scheduledTime?: string;
      dueDate?: string;
    };
    isJustStarting: boolean;
  };
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: 'not-submitted' | 'submitted';
  dueDate: string;
  submissionLink?: string;
  attachments?: string[];
}

export interface UpcomingItem {
  id: string;
  type: 'class' | 'assessment' | 'assignment';
  title: string;
  description: string;
  dateTime: Date;
  tag: string;
  actionText: string;
  canStart: boolean;
  daysUntil?: number;
}

export interface RecentClass {
  id: string;
  name: string;
  status: 'attended' | 'absent';
  date: Date;
  instructor: string;
}

export interface Module {
  id: string;
  name: string;
  topics: Topic[];
}

export interface Topic {
  id: string;
  name: string;
  description: string;
  items: TopicItem[];
}

export interface TopicItem {
  id: string;
  type: 'live-class' | 'recording' | 'video' | 'article' | 'assignment' | 'assessment' | 'quiz' | 'feedback' | 'coding-problem';
  title: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'submitted' | 'watched' | 'read';
  description?: string;
  duration?: string;
  meetLink?: string;
  videoUrl?: string;
  content?: string;
  dueDate?: Date;
  scheduledDateTime?: Date;
  endDateTime?: Date;
  attendanceStatus?: 'present' | 'absent';
  submissionLink?: string;
  solutionCode?: string;
  testCasesPassed?: number;
  totalTestCases?: number;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  marks?: number;
  submissionState?: 'not-started' | 'in-progress' | 'submitted';
  submissionTime?: string;
  submittedCode?: string;
}

// Mock Data
export const mockStudent: Student = {
  id: "1",
  name: "Alex Johnson",
  email: "alex.johnson@email.com",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
};

export const mockCourses: Course[] = [
  {
    id: "1",
    name: "Full Stack JavaScript Development",
    description: "Master modern web development with React, Node.js, and MongoDB",
    instructor: {
      name: "Dr. Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5c5?w=150&h=150&fit=crop&crop=face"
    },
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop",
    progress: 68,
    status: 'enrolled',
    batchName: "FSB-2024-A",
    duration: "6 months",
    studentsEnrolled: 45,
    upcomingItems: [
      {
        id: "1",
        type: 'class',
        title: "Live Class: Advanced React Patterns",
        description: "Learn about render props, higher-order components, and hooks patterns",
        dateTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        tag: "Upcoming Live Class",
        actionText: "Class starts in 1 day",
        canStart: false,
        daysUntil: 1
      },
      {
        id: "2",
        type: 'assessment',
        title: "Assessment: React Fundamentals Quiz",
        description: "Test your knowledge of React hooks, state management, and lifecycle methods",
        dateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        tag: "Upcoming Assessment",
        actionText: "Assessment starts in 2 days",
        canStart: false
      },
      {
        id: "3",
        type: 'assignment',
        title: "Assignment: Build a Todo App",
        description: "Create a fully functional todo application using React and local storage",
        dateTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        tag: "Upcoming Assignment",
        actionText: "Start Assignment",
        canStart: true
      },
      {
        id: "4",
        type: 'class',
        title: "Live Class: State Management Deep Dive",
        description: "Advanced state management patterns with Redux and Context API",
        dateTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        tag: "Upcoming Live Class",
        actionText: "Class starts in 4 days",
        canStart: false,
        daysUntil: 4
      },
      {
        id: "5",
        type: 'assessment',
        title: "Assessment: DOM Manipulation Final",
        description: "Comprehensive assessment on DOM manipulation and events",
        dateTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        tag: "Upcoming Assessment",
        actionText: "Assessment starts in 5 days",
        canStart: false
      },
      {
        id: "6",
        type: 'assignment',
        title: "Assignment: Interactive Web Page",
        description: "Build an interactive web page using DOM manipulation techniques",
        dateTime: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
        tag: "Assignment Due",
        actionText: "Due in 6 days",
        canStart: true
      },
      {
        id: "7",
        type: 'class',
        title: "Live Class: React Router and Navigation",
        description: "Master client-side routing with React Router and navigation patterns",
        dateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        tag: "Upcoming Live Class",
        actionText: "Class starts in 7 days",
        canStart: false,
        daysUntil: 7
      },
      {
        id: "8",
        type: 'class',
        title: "Live Class: API Integration and Fetch",
        description: "Learn to integrate APIs and handle asynchronous data in React applications",
        dateTime: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
        tag: "Upcoming Live Class",
        actionText: "Class starts in 8 days",
        canStart: false,
        daysUntil: 8
      },
      {
        id: "9",
        type: 'assignment',
        title: "Assignment: E-commerce Product Page",
        description: "Build a complete e-commerce product page with cart functionality",
        dateTime: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
        tag: "Assignment Due",
        actionText: "Due in 9 days",
        canStart: true
      },
      {
        id: "10",
        type: 'class',
        title: "Live Class: Testing React Applications",
        description: "Introduction to testing React components with Jest and React Testing Library",
        dateTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        tag: "Upcoming Live Class",
        actionText: "Class starts in 10 days",
        canStart: false,
        daysUntil: 10
      },
      {
        id: "11",
        type: 'assessment',
        title: "Assessment: React Hooks and Context",
        description: "Comprehensive assessment on React hooks, context API, and component patterns",
        dateTime: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000),
        tag: "Upcoming Assessment",
        actionText: "Assessment starts in 11 days",
        canStart: false
      },
      {
        id: "12",
        type: 'class',
        title: "Live Class: Performance Optimization",
        description: "Optimize React applications for better performance and user experience",
        dateTime: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
        tag: "Upcoming Live Class",
        actionText: "Class starts in 12 days",
        canStart: false,
        daysUntil: 12
      }
    ],
    attendanceStats: {
      percentage: 85,
      attended: 17,
      total: 20,
      recentClasses: [
        {
          id: "1",
          name: "Introduction to React Hooks",
          status: 'attended',
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          instructor: "Dr. Sarah Chen"
        },
        {
          id: "2",
          name: "State Management Basics",
          status: 'attended',
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          instructor: "Dr. Sarah Chen"
        },
        {
          id: "3",
          name: "Component Composition",
          status: 'absent',
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          instructor: "Dr. Sarah Chen"
        },
        {
          id: "4",
          name: "DOM Manipulation Fundamentals",
          status: 'attended',
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          instructor: "Dr. Sarah Chen"
        },
        {
          id: "5",
          name: "Event Handling in JavaScript",
          status: 'attended',
          date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
          instructor: "Dr. Sarah Chen"
        },
        {
          id: "6",
          name: "JavaScript Functions Deep Dive",
          status: 'attended',
          date: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000),
          instructor: "Dr. Sarah Chen"
        },
        {
          id: "7",
          name: "Variables and Data Types",
          status: 'absent',
          date: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000),
          instructor: "Dr. Sarah Chen"
        }
      ]
    },
    currentModule: {
      id: "2",
      name: "DOM Manipulation & Events",
      currentChapter: "Introduction to the DOM",
      currentItem: "DOM Fundamentals Quiz",
      nextItem: {
        type: "video",
        name: "DOM Element Selection Methods",
        scheduledTime: "Available now"
      },
      isJustStarting: false
    },
    projects: [
      {
        id: "1",
        title: "Personal Portfolio Website",
        description: "Create a personal portfolio website showcasing your projects and skills. The website should be responsive, include a contact form, and demonstrate your understanding of HTML, CSS, and JavaScript fundamentals. You should include sections for about, projects, skills, and contact information.",
        status: 'not-submitted',
        dueDate: "December 15, 2024",
        attachments: ["project-requirements.pdf", "design-mockup.fig"]
      },
      {
        id: "2", 
        title: "Interactive JavaScript Game",
        description: "Build an interactive browser-based game using vanilla JavaScript. The game should include user interactions, score tracking, and dynamic DOM manipulation. Consider creating a puzzle game, memory game, or simple arcade-style game.",
        status: 'submitted',
        dueDate: "January 20, 2025",
        submissionLink: "https://github.com/student/js-game-project",
        attachments: ["game-requirements.pdf"]
      }
    ],
    modules: [
      {
        id: "1",
        name: "JavaScript Fundamentals",
        topics: [
          {
            id: "1",
            name: "Introduction to JavaScript & Setup",
            description: "Learn the absolute basics of JavaScript and set up your development environment",
            items: [
              {
                id: "1-1-1",
                type: 'live-class',
                title: "What is JavaScript? History, Use Cases & Setting up Your Development Environment",
                status: 'completed',
                duration: "90 min",
                scheduledDateTime: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
                meetLink: "https://meet.google.com/abc-defg-hij",
                attendanceStatus: 'present',
                description: "Introduction to JavaScript fundamentals and development environment setup"
              },
              {
                id: "1-1-2",
                type: 'video',
                title: "Installing Node.js and npm",
                status: 'completed',
                duration: "15 min",
                videoUrl: "https://youtu.be/DrAZf4ZHqaM?si=jcWByRHmXDKXwKkb"
              },
              {
                id: "1-1-3",
                type: 'article',
                title: "The History of JavaScript",
                status: 'completed',
                duration: "6 min read"
              },
              {
                id: "1-1-4",
                type: 'assignment',
                title: "Setup your Development Environment",
                status: 'completed',
                description: "Setup your development environment and write a 'Hello, World!' program in JavaScript",
                submissionLink: "https://github.com/student/js-setup"
              }
            ]
          }
        ]
      },
      {
        id: "2",
        name: "DOM Manipulation & Events",
        topics: [
          {
            id: "1",
            name: "Introduction to the DOM",
            description: "Learn about the Document Object Model and how to select elements",
            items: [
              {
                id: "2-1-1",
                type: 'live-class',
                title: "DOM Fundamentals and Element Selection",
                status: 'not-started',
                duration: "90 min",
                scheduledDateTime: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
                description: "Introduction to DOM concepts and element selection methods"
              },
              {
                id: "2-1-2",
                type: 'live-class',
                title: "Advanced DOM Manipulation Techniques",
                status: 'completed',
                duration: "90 min",
                scheduledDateTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                attendanceStatus: 'present',
                description: "Deep dive into DOM manipulation methods and best practices"
              },
              {
                id: "2-1-3",
                type: 'video',
                title: "Visualizing the DOM tree",
                status: 'not-started',
                duration: "15 min",
                videoUrl: "https://youtu.be/DrAZf4ZHqaM?si=jcWByRHmXDKXwKkb"
              },
              {
                id: "2-1-4",
                type: 'article',
                title: "Understanding Nodes in the DOM",
                status: 'not-started',
                duration: "8 min read"
              },
              {
                id: "2-1-5",
                type: 'assignment',
                title: "DOM Selection Practice",
                status: 'not-started',
                description: "Practice selecting elements using various DOM methods",
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
              },
              {
                id: "dom-quiz-1",
                type: 'quiz',
                title: 'DOM Fundamentals Quiz',
                status: 'not-started',
                description: 'Test your understanding of DOM basics with multiple choice questions.'
              },
              {
                id: "course-feedback-1",
                type: 'feedback',
                title: 'Module 2 Feedback',
                status: 'not-started',
                description: 'Share your feedback about this module to help us improve.'
              },
              {
                id: "coding-problem-1",
                type: 'coding-problem',
                title: 'Array Manipulation Challenge',
                status: 'not-started',
                description: 'Practice array manipulation techniques with this coding problem.',
                difficulty: 'Medium',
                marks: 25,
                totalTestCases: 5
              }
            ]
          },
          {
            id: "assessments",
            name: "Assessments",
            description: "Module assessments and evaluations",
            items: [
              {
                id: "dom-concepts-assessment",
                type: 'assessment',
                title: 'DOM Concepts Assessment',
                status: 'not-started',
                description: 'This assessment covers DOM manipulation, event handling, and interactive web development concepts. Complete coding problems, MCQ quiz, and open-ended questions.',
                scheduledDateTime: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour from now
                endDateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                duration: '2 hours'
              },
              {
                id: "high-score-assessment",
                type: 'assessment',
                title: 'JavaScript Fundamentals Assessment',
                status: 'completed',
                description: 'Comprehensive assessment covering JavaScript basics, data types, functions, and control structures.',
                scheduledDateTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
                endDateTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                duration: '90 minutes'
              },
              {
                id: "low-score-assessment",
                type: 'assessment',
                title: 'Event Handling Assessment',
                status: 'completed',
                description: 'Assessment focusing on event handling, user interactions, and dynamic content updates.',
                scheduledDateTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                endDateTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
                duration: '75 minutes'
              },
              {
                id: "expired-assessment",
                type: 'assessment',
                title: 'DOM Manipulation Final Test',
                status: 'not-started',
                description: 'Final comprehensive assessment covering all DOM manipulation concepts and techniques.',
                scheduledDateTime: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
                endDateTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                duration: '3 hours'
              },
              {
                id: "scheduled-assessment",
                type: 'assessment',
                title: 'JavaScript Advanced Concepts',
                status: 'not-started',
                description: 'This assessment will demonstrate the re-attempt flow and complete assessment experience.',
                scheduledDateTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
                endDateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                duration: '2 hours'
              },
              {
                id: "static-scheduled-assessment",
                type: 'assessment',
                title: 'React Advanced Patterns Assessment',
                status: 'not-started',
                description: 'Assessment on advanced React patterns, hooks, and performance optimization.',
                scheduledDateTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                endDateTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
                duration: '90 minutes'
              }
            ]
          }
        ]
      },
      {
        id: "3",
        name: "React Fundamentals",
        topics: [
          {
            id: "3-1",
            name: "Introduction to React",
            description: "Learn React basics, components, and JSX",
            items: [
              {
                id: "3-1-1",
                type: 'live-class',
                title: "What is React? Components and JSX",
                status: 'not-started',
                duration: "90 min",
                scheduledDateTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                description: "Introduction to React library and component-based architecture"
              },
              {
                id: "3-1-2",
                type: 'video',
                title: "Setting up React Development Environment",
                status: 'not-started',
                duration: "20 min",
                videoUrl: "https://youtu.be/DrAZf4ZHqaM?si=jcWByRHmXDKXwKkb"
              },
              {
                id: "3-1-3",
                type: 'assignment',
                title: "Create Your First React Component",
                status: 'not-started',
                description: "Build a simple React component using JSX",
                dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
              }
            ]
          }
        ]
      },
      {
        id: "4",
        name: "React State Management",
        topics: [
          {
            id: "4-1",
            name: "Hooks and State",
            description: "Master React hooks and state management",
            items: [
              {
                id: "4-1-1",
                type: 'live-class',
                title: "useState and useEffect Hooks",
                status: 'not-started',
                duration: "90 min",
                scheduledDateTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
                description: "Deep dive into React hooks for state and side effects"
              },
              {
                id: "4-1-2",
                type: 'video',
                title: "Custom Hooks Tutorial",
                status: 'not-started',
                duration: "25 min",
                videoUrl: "https://youtu.be/DrAZf4ZHqaM?si=jcWByRHmXDKXwKkb"
              },
              {
                id: "4-1-3",
                type: 'coding-problem',
                title: 'State Management Challenge',
                status: 'not-started',
                description: 'Build a counter app using React hooks',
                difficulty: 'Easy',
                marks: 20,
                totalTestCases: 3
              }
            ]
          }
        ]
      },
      {
        id: "5",
        name: "Advanced React Patterns",
        topics: [
          {
            id: "5-1",
            name: "Component Patterns",
            description: "Learn advanced React component patterns",
            items: [
              {
                id: "5-1-1",
                type: 'live-class',
                title: "Higher-Order Components and Render Props",
                status: 'not-started',
                duration: "90 min",
                scheduledDateTime: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
                description: "Advanced component composition patterns"
              },
              {
                id: "5-1-2",
                type: 'assignment',
                title: "Build a Reusable Modal Component",
                status: 'not-started',
                description: "Create a flexible modal component using render props",
                dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "2",
    name: "Android Development with Kotlin",
    description: "Build native Android apps using Kotlin and modern Android development practices",
    instructor: {
      name: "Prof. Michael Rodriguez",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=250&fit=crop",
    progress: 45,
    status: 'enrolled',
    batchName: "ADK-2024-B",
    duration: "5 months",
    studentsEnrolled: 28,
    upcomingItems: [],
    attendanceStats: {
      percentage: 88,
      attended: 15,
      total: 17,
      recentClasses: []
    },
    currentModule: {
      id: "1",
      name: "Kotlin Fundamentals",
      currentChapter: "Kotlin Syntax and Basics",
      currentItem: "Kotlin Variables and Data Types",
      nextItem: {
        type: "video",
        name: "Kotlin Control Flow"
      },
      isJustStarting: false
    },
    projects: [],
    modules: []
  },
  {
    id: "3",
    name: "Python for Data Science",
    description: "Learn Python programming for data analysis and machine learning",
    instructor: {
      name: "Dr. Emily Watson",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face"
    },
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop",
    progress: 100,
    status: 'completed',
    batchName: "PDS-2024-B",
    duration: "4 months",
    studentsEnrolled: 32,
    upcomingItems: [],
    attendanceStats: {
      percentage: 95,
      attended: 19,
      total: 20,
      recentClasses: []
    },
    currentModule: {
      id: "1",
      name: "Course Completed",
      currentChapter: "All chapters completed",
      currentItem: "All content completed",
      nextItem: {
        type: "completed",
        name: "Course Certificate Available"
      },
      isJustStarting: false
    },
    projects: [],
    modules: []
  }
];
