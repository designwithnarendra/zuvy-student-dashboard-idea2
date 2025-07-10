import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Play, Check, Calendar as CalendarIcon, Clock } from "lucide-react";
import { TopicItem } from "@/lib/mockData";
import { getStatusBadgeStyles, formatDate, formatDateTime } from "@/lib/utils";
import AssessmentView from "./AssessmentView";
import CodingProblemPage from "./CodingProblemPage";

// Import types from ModuleContentPage
interface ModuleItemState extends TopicItem {
  submissionText?: string;
  quizAnswers?: { [questionId: string]: string };
  feedbackAnswers?: { [questionId: string]: string };
  watchedPercentage?: number;
  violationCount?: number;
  assessmentAttempts?: number;
  lastAttemptScore?: number;
  submissionState?: 'not-started' | 'in-progress' | 'submitted';
  submissionTime?: string;
  testCasesPassed?: number;
  totalTestCases?: number;
}

interface SessionStateHandlers {
  handleAssignmentSubmission: (itemId: string, submissionLink: string) => void;
  handleQuizSubmission: (itemId: string, answers: { [questionId: string]: string }) => void;
  handleFeedbackSubmission: (itemId: string, answers: { [questionId: string]: string }) => void;
  handleVideoWatch: (itemId: string, percentage: number) => void;
  handleArticleRead: (itemId: string) => void;
  handleLiveClassJoin: (itemId: string) => void;
  handleCodingProblemCompletion: (itemId: string, testCasesPassed: number, totalTestCases: number, solutionCode?: string) => void;
  handleAssessmentUpdate: (itemId: string, updates: { score?: number; state: string; violationCount?: number }) => void;
  handleAssessmentReAttempt: (itemId: string) => void;
  handleItemStatusUpdate: (itemId: string, status: TopicItem['status']) => void;
  handleItemFieldUpdate: (itemId: string, field: keyof ModuleItemState, value: any) => void;
}

interface ModuleContentRendererProps {
  selectedItemData: { item: any; topicId: string } | null;
  getAssessmentData: (itemId: string) => any;
  sessionStateHandlers: SessionStateHandlers;
}

const ModuleContentRenderer = ({ selectedItemData, getAssessmentData, sessionStateHandlers }: ModuleContentRendererProps) => {
  // All state management handled via session state

  const getTimeRemaining = (dateTime: Date) => {
    const now = new Date();
    const timeDiff = dateTime.getTime() - now.getTime();
    
    if (timeDiff <= 0) return "Starting now";
    
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    return `${seconds} second${seconds > 1 ? 's' : ''}`;
  };

  if (!selectedItemData) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-heading font-bold mb-2">Module Content</h1>
        <p className="text-muted-foreground">Select a learning item from the sidebar to view its content</p>
      </div>
    );
  }

  const { item } = selectedItemData;



  // Handle assessment rendering
  if (item.type === 'assessment') {
    const assessmentData = getAssessmentData(item.id);
    if (assessmentData) {
      return <AssessmentView 
        assessment={assessmentData} 
        onReAttemptRequest={sessionStateHandlers.handleAssessmentReAttempt}
      />;
    }
  }

  // Handle Quiz rendering
  if (item.type === 'quiz') {
    const questions = [
      {
        id: "q1",
        question: "What does DOM stand for?",
        options: ["Document Object Model", "Data Object Management", "Dynamic Object Method", "Document Oriented Markup"],
        correct: 0
      },
      {
        id: "q2", 
        question: "Which method is used to select an element by ID?",
        options: ["document.getElement()", "document.getElementById()", "document.selectId()", "document.findById()"],
        correct: 1
      },
      {
        id: "q3",
        question: "How do you add an event listener to an element?",
        options: ["element.addListener()", "element.addEventListener()", "element.on()", "element.bind()"],
        correct: 1
      },
      {
        id: "q4",
        question: "Which property is used to change the text content of an element?",
        options: ["innerHTML", "textContent", "innerText", "Both B and C"],
        correct: 3
      },
      {
        id: "q5",
        question: "What is the correct way to create a new HTML element?",
        options: ["document.new()", "document.createElement()", "document.create()", "document.newElement()"],
        correct: 1
      },
      {
        id: "q6",
        question: "Which event is triggered when the DOM is fully loaded?",
        options: ["window.onload", "DOMContentLoaded", "document.ready", "page.loaded"],
        correct: 1
      }
    ];

    // Get quiz state from session
    const currentAnswers = (item as ModuleItemState).quizAnswers || {};
    const isCompleted = item.status === 'completed';

    const handleAnswerChange = (questionId: string, value: string) => {
      const newAnswers = { ...currentAnswers, [questionId]: value };
      sessionStateHandlers.handleItemFieldUpdate(item.id, 'quizAnswers', newAnswers);
    };

    const handleQuizSubmit = () => {
      if (questions.every(q => currentAnswers[q.id])) {
        sessionStateHandlers.handleQuizSubmission(item.id, currentAnswers);
      }
    };

    const allAnswered = questions.every(q => currentAnswers[q.id]);

    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-heading font-bold">{item.title}</h1>
          <Badge variant="outline" className={getStatusBadgeStyles(item.status === 'completed' ? 'completed' : 'not completed')}>
            {item.status === 'completed' ? 'Completed' : 'Not Completed'}
          </Badge>
        </div>

        {isCompleted && (
          <Card className="bg-success-light border-success mb-6">
            <CardContent className="p-4">
              <p className="text-success font-medium">You have submitted the quiz successfully.</p>
            </CardContent>
          </Card>
        )}
        
        <div className="space-y-8">
          {questions.map((q, index) => (
            <div key={q.id} className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-normal">
                  {index + 1}. {q.question}
                </h3>
                {isCompleted && (
                  <Badge variant="outline" className={
                    currentAnswers[q.id] && parseInt(currentAnswers[q.id]) === q.correct 
                      ? getStatusBadgeStyles('completed')
                      : "bg-destructive-light text-destructive border border-destructive"
                  }>
                    {currentAnswers[q.id] && parseInt(currentAnswers[q.id]) === q.correct ? 'Correct' : 'Incorrect'}
                  </Badge>
                )}
              </div>
              <RadioGroup
                value={currentAnswers[q.id] || ''}
                onValueChange={(value) => handleAnswerChange(q.id, value)}
                disabled={isCompleted}
                className="space-y-4"
              >
                {q.options.map((option, optionIndex) => {
                  const isSelected = currentAnswers[q.id] === optionIndex.toString();
                  const isCorrect = optionIndex === q.correct;
                  const isWrong = isCompleted && isSelected && !isCorrect;
                  
                  return (
                    <div key={optionIndex} className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value={optionIndex.toString()} 
                        id={`${q.id}_option${optionIndex}`}
                        className={isCompleted && isCorrect ? "border-success" : isWrong ? "border-destructive" : ""}
                      />
                      <Label 
                        htmlFor={`${q.id}_option${optionIndex}`} 
                        className={`cursor-pointer ${
                          isCompleted && isCorrect ? "text-success font-medium" : 
                          isWrong ? "text-destructive font-medium" : ""
                        }`}
                      >
                        {option}
                      </Label>
                    </div>
                  );
                })}
                {isCompleted && currentAnswers[q.id] && parseInt(currentAnswers[q.id]) !== q.correct && (
                  <p className="text-sm text-success mt-2 font-medium">
                    Correct Answer: {q.options[q.correct]}
                  </p>
                )}
              </RadioGroup>
            </div>
          ))}
        </div>

        {!isCompleted && (
          <div className="flex justify-center mt-8">
            <Button 
              onClick={handleQuizSubmit}
              disabled={!allAnswered}
            >
              Submit Quiz
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Handle Feedback Form rendering
  if (item.type === 'feedback') {
    // Get feedback state from session
    const currentAnswers = (item as ModuleItemState).feedbackAnswers || {};
    const isCompleted = item.status === 'completed';

          const handleFeedbackSubmit = () => {
        const requiredFields = ['mcq', 'text', 'date', 'time'];
        const checkboxArray = Array.isArray(currentAnswers.checkbox) ? currentAnswers.checkbox : [];
        const hasCheckboxAnswer = checkboxArray.length > 0;
        const allRequired = requiredFields.every(field => currentAnswers[field]);
        
        if (allRequired && hasCheckboxAnswer) {
          sessionStateHandlers.handleFeedbackSubmission(item.id, currentAnswers);
        }
      };

    const updateAnswer = (field: string, value: any) => {
      const newAnswers = { ...currentAnswers, [field]: value };
      sessionStateHandlers.handleItemFieldUpdate(item.id, 'feedbackAnswers', newAnswers);
    };

    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl font-heading font-bold">{item.title}</h1>
          <Badge variant="outline" className={getStatusBadgeStyles(item.status === 'completed' ? 'completed' : 'not completed')}>
            {item.status === 'completed' ? 'Completed' : 'Not Completed'}
          </Badge>
        </div>
        {isCompleted && (
          <div className="bg-success-light p-4 rounded-lg mt-4 mb-6 text-success">
            Your feedback has been submitted successfully
          </div>
        )}
        <p className="text-muted-foreground mb-8">{item.description}</p>
        
        <div className="space-y-8">
          {/* MCQ Question */}
          <div className="space-y-4">
            <h3 className="text-lg font-normal">1. How would you rate the overall quality of this module?</h3>
            <RadioGroup
              value={currentAnswers.mcq as string || ''}
              onValueChange={(value) => updateAnswer('mcq', value)}
              disabled={isCompleted}
              className="space-y-4"
            >
              {['Excellent', 'Good', 'Average', 'Poor'].map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`rating_${index}`} />
                  <Label htmlFor={`rating_${index}`} className="cursor-pointer">{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Checkbox Question */}
          <div className="space-y-4">
            <h3 className="text-lg font-normal">2. Which topics were most helpful? (Select all that apply)</h3>
            {['DOM Manipulation', 'Event Handling', 'Interactive Elements', 'Performance Optimization'].map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox 
                  id={`topic_${index}`}
                  checked={Array.isArray(currentAnswers.checkbox) ? currentAnswers.checkbox.includes(option) : false}
                  onCheckedChange={(checked) => {
                    const currentCheckbox = Array.isArray(currentAnswers.checkbox) ? currentAnswers.checkbox : [];
                    if (checked) {
                      updateAnswer('checkbox', [...currentCheckbox, option]);
                    } else {
                      updateAnswer('checkbox', currentCheckbox.filter(item => item !== option));
                    }
                  }}
                  disabled={isCompleted}
                />
                <Label htmlFor={`topic_${index}`} className="cursor-pointer">{option}</Label>
              </div>
            ))}
          </div>

          {/* Long Text Question */}
          <div className="space-y-4">
            <h3 className="text-lg font-normal">3. What suggestions do you have for improving this module?</h3>
            <Textarea
              value={currentAnswers.text as string || ''}
              onChange={(e) => updateAnswer('text', e.target.value)}
              placeholder="Share your suggestions..."
              className="min-h-24"
              disabled={isCompleted}
            />
          </div>

          {/* Date Question */}
          <div className="space-y-4">
            <h3 className="text-lg font-normal">4. When did you start this module?</h3>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" disabled={isCompleted}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {currentAnswers.date ? formatDate(new Date(currentAnswers.date as string)) : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={currentAnswers.date ? new Date(currentAnswers.date as string) : undefined}
                  onSelect={(date) => updateAnswer('date', date?.toISOString() || null)}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time Question */}
          <div className="space-y-4">
            <h3 className="text-lg font-normal">5. What time of day do you prefer studying?</h3>
            <div className="relative w-40">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="time"
                value={currentAnswers.time as string || ''}
                onChange={(e) => updateAnswer('time', e.target.value)}
                disabled={isCompleted}
                className="w-40 pl-10"
              />
            </div>
          </div>
        </div>

        {!isCompleted && (
          <div className="flex justify-center mt-8">
            <Button 
              onClick={handleFeedbackSubmit}
              disabled={!currentAnswers.mcq || !currentAnswers.text || !currentAnswers.date || !currentAnswers.time || !Array.isArray(currentAnswers.checkbox) || !currentAnswers.checkbox.length}
            >
              Submit Feedback
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Handle Coding Problem rendering
  if (item.type === 'coding-problem') {
    const itemState = item as ModuleItemState;
    
    // Check for session-persistent submission state
    const submissionData = sessionStorage.getItem(`coding-problem-${item.id}`);
    const sessionSubmissionState = submissionData ? JSON.parse(submissionData).submissionState : null;
    
    const submissionState = sessionSubmissionState || itemState.submissionState || 'not-started';
    const isSubmitted = submissionState === 'submitted';
    
    const handleStartPractice = () => {
      // Navigate to separate coding problem page in same window
      window.location.href = `/coding-problem/${item.id}`;
    };

    const handleViewSolution = () => {
      // Navigate to solution viewer page in same window
      window.location.href = `/solution-viewer/${item.id}`;
    };

    const getStatusBadge = () => {
      switch (submissionState) {
        case 'submitted':
          return (
            <div className="text-center">
              <Badge variant="outline" className={getStatusBadgeStyles('submitted')}>Submitted</Badge>
            </div>
          );
        case 'in-progress':
          return <Badge variant="outline" className="bg-warning-light text-warning border border-warning">In Progress</Badge>;
        default:
          return <Badge variant="outline" className={getStatusBadgeStyles('not submitted')}>Not Submitted</Badge>;
      }
    };

    const getSubmissionInfo = () => {
      if (submissionData) {
        const parsed = JSON.parse(submissionData);
        return {
          submissionTime: parsed.submissionTime,
          testCasesPassed: parsed.testCasesPassed || 5,
          totalTestCases: parsed.totalTestCases || 5
        };
      }
      return {
        testCasesPassed: itemState.testCasesPassed || 5,
        totalTestCases: itemState.totalTestCases || 5
      };
    };

    const submissionInfo = getSubmissionInfo();

    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-heading font-bold">{item.title}</h1>
          {getStatusBadge()}
        </div>
        
        <div className="grid grid-cols-1 gap-4 mb-6">
          <div>
            <p className="text-sm text-muted-foreground">Difficulty</p>
            <p className="font-medium">{item.difficulty || 'Medium'}</p>
          </div>
        </div>
        
        <p className="text-muted-foreground mb-8">{item.description}</p>
        
        {isSubmitted && (
          <div className="bg-success-light border border-success rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Check className="w-5 h-5 text-success" />
              <p className="font-semibold text-success">Problem Submitted</p>
            </div>
            <p className="text-sm text-success">
              Test Cases: {submissionInfo.testCasesPassed}/{submissionInfo.totalTestCases} passed
              {submissionInfo.submissionTime && (
                <span className="ml-4">
                  • Submitted on: {formatDateTime(new Date(submissionInfo.submissionTime))}
                </span>
              )}
            </p>
          </div>
        )}
        
        <div className="text-center">
          <Button onClick={isSubmitted ? handleViewSolution : handleStartPractice}>
            {isSubmitted ? 'View Results' : 'Start Practice'}
          </Button>
        </div>
      </div>
    );
  }

  // Handle live class rendering with countdown
  if (item.type === 'live-class') {
    const isScheduled = item.scheduledDateTime && new Date() < item.scheduledDateTime;
    const isInProgress = item.scheduledDateTime && 
      new Date() >= new Date(item.scheduledDateTime.getTime() - 10 * 60 * 1000) &&
      new Date() < new Date(item.scheduledDateTime.getTime() + 60 * 60 * 1000);
    const isCompleted = item.status === 'completed';

    if (isScheduled) {
      return (
        <div className="max-w-4xl mx-auto p-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-heading font-bold">{item.title}</h1>
            <Badge variant="outline" className="text-muted-foreground">
              Scheduled
            </Badge>
          </div>
          <p className="text-muted-foreground mb-6">{item.description || "Join this live interactive session with your instructor and fellow students."}</p>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-muted-foreground">Scheduled Date & Time</p>
              <p className="font-medium">{formatDateTime(item.scheduledDateTime)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="font-medium">{item.duration || '45 mins'}</p>
            </div>
          </div>
          
          <Card className="bg-info-light border-info mb-6 h-14 flex items-center justify-center">
            <CardContent className="p-4">
              <p className="text-info font-semibold">
                Class starts in {getTimeRemaining(item.scheduledDateTime!)}
              </p>
            </CardContent>
          </Card>
          
          <p className="text-muted-foreground text-center">Class recording will be available after the class</p>
        </div>
      );
    }

    if (isInProgress) {
      return (
        <div className="max-w-4xl mx-auto p-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-heading font-bold">{item.title}</h1>
            <Badge variant="outline" className={getStatusBadgeStyles('live')}>
              Live Now
            </Badge>
          </div>
          <p className="text-muted-foreground mb-6">{item.description || "Join this live interactive session with your instructor and fellow students."}</p>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-muted-foreground">Scheduled Date & Time</p>
              <p className="font-medium">{formatDateTime(item.scheduledDateTime)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="font-medium">{item.duration || '45 mins'}</p>
            </div>
          </div>
          <div className="text-center">
            <Button 
              className="mb-6"
              onClick={() => sessionStateHandlers.handleLiveClassJoin(item.id)}
            >
              Join Class
            </Button>
          </div>
        </div>
      );
    }

    if (isCompleted) {
      return (
        <div className="max-w-4xl mx-auto p-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-heading font-bold">{item.title}</h1>
            <Badge variant="outline" className={getStatusBadgeStyles('completed')}>
              Completed
            </Badge>
          </div>
          <p className="text-muted-foreground mb-6">{item.description || "This live class has been completed."}</p>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <p className="text-sm text-muted-foreground">Date & Time</p>
              <p className="font-medium">{item.scheduledDateTime ? formatDateTime(item.scheduledDateTime) : 'TBD'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="font-medium">{item.duration || '45 mins'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Your Attendance Duration</p>
              <p className="font-medium text-success">{item.duration || '45 mins'}</p>
            </div>
          </div>
          <p className="text-success mb-6 flex items-center gap-2">
            <Check className="w-5 h-5" />
            Class completed
          </p>
          
          <div className="border-t border-border pt-6">
            <h2 className="text-xl font-heading font-semibold mb-4">Recording available for the live class</h2>
            <div className="bg-black rounded-lg aspect-video flex items-center justify-center">
              <div className="text-center text-white">
                <Play className="w-16 h-16 mx-auto mb-4" />
                <p>Class Recording</p>
                <p className="text-sm opacity-75">{item.duration || '45 mins'}</p>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  // Handle video rendering
  if (item.type === 'video') {
    const videoId = item.videoUrl ? item.videoUrl.split('v=')[1] || item.videoUrl.split('/').pop()?.split('?')[0] : 'DrAZf4ZHqaM';
    const watchedPercentage = (item as ModuleItemState).watchedPercentage || 0;
    const isWatched = watchedPercentage >= 70; // 70% threshold for watched status
    
    const handleVideoEnd = () => {
      sessionStateHandlers.handleVideoWatch(item.id, 100);
    };

    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-heading font-bold">{item.title}</h1>
          <Badge variant="outline" className={getStatusBadgeStyles(isWatched ? 'watched' : 'not watched')}>
            {isWatched ? 'Watched' : 'Not Watched'}
          </Badge>
        </div>
        <p className="text-muted-foreground mb-6">Duration: {item.duration || '20 mins'}</p>
        <div className="bg-black rounded-lg aspect-video">
          {videoId ? (
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1`}
              title={item.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="rounded-lg"
              onLoad={() => {
                // Simulate video watch completion after 5 seconds for demo
                setTimeout(() => {
                  if (item.status !== 'completed') {
                    handleVideoEnd();
                  }
                }, 5000);
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-white">
                <Play className="w-16 h-16 mx-auto mb-4" />
                <p>Video Content</p>
                <p className="text-sm opacity-75">{item.duration || '20 mins'}</p>
              </div>
            </div>
          )}
        </div>
        {watchedPercentage > 0 && watchedPercentage < 100 && (
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">Watched: {watchedPercentage}%</p>
          </div>
        )}
      </div>
    );
  }

  // Handle article rendering
  if (item.type === 'article') {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-heading font-bold">{item.title}</h1>
          <Badge variant="outline" className={getStatusBadgeStyles(item.status === 'completed' ? 'read' : 'to be read')}>
            {item.status === 'completed' ? 'Read' : 'To be Read'}
          </Badge>
        </div>
        <p className="text-muted-foreground mb-6">Approximate read time: 5 mins</p>
        <div className="prose max-w-none mb-8">
          <p>This is a sample article content. In a real implementation, this would contain the actual article text with proper formatting, images, and other content elements.</p>
          <p>The article content would be comprehensive and educational, providing valuable insights and knowledge to the student.</p>
        </div>
        {item.status !== 'completed' && (
          <div className="flex justify-center">
            <Button 
              variant="outline" 
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              onClick={() => sessionStateHandlers.handleArticleRead(item.id)}
            >
              Mark as Read
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Handle assignment rendering
  if (item.type === 'assignment') {
    const isDueDatePassed = item.dueDate ? new Date() > item.dueDate : false;
    const currentSubmission = (item as ModuleItemState).submissionText || '';
    const isSubmitted = item.status === 'completed';
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [inputValue, setInputValue] = useState(currentSubmission);
    
    const handleSubmissionChange = (value: string) => {
      setInputValue(value);
      setErrorMessage(''); // Clear error when user types
      sessionStateHandlers.handleItemFieldUpdate(item.id, 'submissionText', value);
    };

    const isValidLink = (url: string) => {
      const trimmedUrl = url.trim();
      if (!trimmedUrl) return false;
      
      // Check for Google Drive links
      const googleDrivePattern = /^https:\/\/(drive|docs)\.google\.com\//;
      // Check for GitHub links
      const githubPattern = /^https:\/\/github\.com\//;
      
      return googleDrivePattern.test(trimmedUrl) || githubPattern.test(trimmedUrl);
    };

    const handleSubmit = () => {
      const trimmedInput = inputValue.trim();
      
      if (!trimmedInput) {
        setErrorMessage('Please paste a submission link');
        return;
      }
      
      if (!isValidLink(trimmedInput)) {
        setErrorMessage('Please provide a valid Google Drive or GitHub link');
        return;
      }
      
      setErrorMessage('');
      sessionStateHandlers.handleAssignmentSubmission(item.id, trimmedInput);
    };

    const handleResubmit = () => {
      sessionStateHandlers.handleItemStatusUpdate(item.id, 'not-started');
      setInputValue('');
      setErrorMessage('');
    };
    
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-heading font-bold text-left">{item.title}</h1>
          <Badge variant="outline" className={getStatusBadgeStyles(isSubmitted ? 'submitted' : 'not submitted')}>
            {isSubmitted ? 'Submitted' : 'Not Submitted'}
          </Badge>
        </div>
        <p className="text-muted-foreground mb-6 text-left">
          Due: {item.dueDate ? formatDate(item.dueDate) : 'December 15, 2024'}
        </p>
        <p className="text-muted-foreground mb-8 text-left">
          {item.description || 
          "Complete this comprehensive assignment that covers all the concepts learned in this module. You'll need to demonstrate your understanding through practical implementation and theoretical explanations. The assignment includes multiple components: coding exercises, written responses, and a final project."}
        </p>
        
        <div className="mb-8">
          <h2 className="text-xl font-heading font-semibold mb-4">Make a Submission</h2>
          <div className="space-y-4">
            {!isSubmitted ? (
              <>
                <Input
                  placeholder="Paste your assignment link (Google Drive, GitHub, etc.)"
                  value={inputValue}
                  onChange={(e) => handleSubmissionChange(e.target.value)}
                  disabled={isDueDatePassed}
                />
                {errorMessage && (
                  <p className="text-sm text-destructive">{errorMessage}</p>
                )}
                {!isDueDatePassed && (
                  <Button 
                    onClick={handleSubmit}
                  >
                    Submit Assignment
                  </Button>
                )}
              </>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Your Submission</h3>
                  <p className="text-muted-foreground break-all">{inputValue}</p>
                </div>
                {!isDueDatePassed && (
                  <Button 
                    variant="outline"
                    onClick={handleResubmit}
                  >
                    Resubmit Assignment
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default ModuleContentRenderer;
