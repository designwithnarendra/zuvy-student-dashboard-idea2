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
import AssessmentView from "./AssessmentView";
import CodingProblemPage from "./CodingProblemPage";

interface ModuleContentRendererProps {
  selectedItemData: { item: TopicItem; topicId: string } | null;
  getAssessmentData: (itemId: string) => any;
}

const ModuleContentRenderer = ({ selectedItemData, getAssessmentData }: ModuleContentRendererProps) => {
  const [showCodingProblem, setShowCodingProblem] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<string[]>(new Array(5).fill(''));
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackAnswers, setFeedbackAnswers] = useState({
    mcq: '',
    checkbox: [] as string[],
    text: '',
    date: null as Date | null,
    time: ''
  });
  const [assignmentLink, setAssignmentLink] = useState('');
  const [assignmentSubmitted, setAssignmentSubmitted] = useState(false);

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

  // Handle coding problem page
  if (showCodingProblem && item.type === 'coding-problem') {
    return (
      <CodingProblemPage
        problem={{
          title: item.title,
          difficulty: 'Medium',
          topic: 'Arrays',
          status: item.status
        }}
        onClose={() => setShowCodingProblem(false)}
      />
    );
  }

  // Handle assessment rendering
  if (item.type === 'assessment') {
    const assessmentData = getAssessmentData(item.id);
    if (assessmentData) {
      return <AssessmentView assessment={assessmentData} />;
    }
  }

  // Handle Quiz rendering
  if (item.type === 'quiz') {
    const questions = [
      {
        question: "What does DOM stand for?",
        options: ["Document Object Model", "Data Object Management", "Dynamic Object Method", "Document Oriented Markup"],
        correct: 0
      },
      {
        question: "Which method is used to select an element by ID?",
        options: ["document.getElement()", "document.getElementById()", "document.selectId()", "document.findById()"],
        correct: 1
      },
      {
        question: "How do you add an event listener to an element?",
        options: ["element.addListener()", "element.addEventListener()", "element.on()", "element.bind()"],
        correct: 1
      },
      {
        question: "Which property is used to change the text content of an element?",
        options: ["innerHTML", "textContent", "innerText", "Both B and C"],
        correct: 3
      },
      {
        question: "What is the correct way to create a new HTML element?",
        options: ["document.new()", "document.createElement()", "document.create()", "document.newElement()"],
        correct: 1
      }
    ];

    const handleQuizSubmit = () => {
      if (quizAnswers.every(answer => answer !== '')) {
        setQuizSubmitted(true);
      }
    };

    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-heading font-bold">{item.title}</h1>
          <Badge variant="outline" className={item.status === 'completed' ? "text-success border-success" : "text-muted-foreground"}>
            {item.status === 'completed' ? 'Completed' : 'Not Completed'}
          </Badge>
        </div>
        
        <div className="space-y-6">
          {questions.map((q, index) => (
            <div key={index} className="space-y-3">
              <h3 className="text-lg font-semibold">
                {index + 1}. {q.question}
              </h3>
              <RadioGroup
                value={quizAnswers[index]}
                onValueChange={(value) => {
                  const newAnswers = [...quizAnswers];
                  newAnswers[index] = value;
                  setQuizAnswers(newAnswers);
                }}
                disabled={quizSubmitted}
              >
                {q.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex items-center space-x-2">
                    <RadioGroupItem 
                      value={optionIndex.toString()} 
                      id={`q${index}_option${optionIndex}`}
                      className={quizSubmitted && parseInt(quizAnswers[index]) === optionIndex ? "border-primary" : ""}
                    />
                    <Label htmlFor={`q${index}_option${optionIndex}`} className={`cursor-pointer ${
                      quizSubmitted && parseInt(quizAnswers[index]) === optionIndex ? "text-primary font-medium" : ""
                    }`}>
                      {option}
                    </Label>
                  </div>
                ))}
                {quizSubmitted && parseInt(quizAnswers[index]) !== q.correct && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Correct Answer: {q.options[q.correct]}
                  </p>
                )}
              </RadioGroup>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <Button 
            onClick={handleQuizSubmit}
            disabled={!quizAnswers.every(answer => answer !== '') || quizSubmitted}
          >
            {quizSubmitted ? 'Submitted ✓' : 'Submit'}
          </Button>
        </div>
      </div>
    );
  }

  // Handle Feedback Form rendering
  if (item.type === 'feedback') {
    const handleFeedbackSubmit = () => {
      setFeedbackSubmitted(true);
    };

    return (
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-heading font-bold mb-2">{item.title}</h1>
        {feedbackSubmitted && (
          <div className="bg-success-light p-4 rounded-lg mb-6 text-success">
            Your feedback has been submitted successfully
          </div>
        )}
        <p className="text-muted-foreground mb-8">{item.description}</p>
        
        <div className="space-y-8">
          {/* MCQ Question */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">1. How would you rate the overall quality of this module?</h3>
            <RadioGroup
              value={feedbackAnswers.mcq}
              onValueChange={(value) => setFeedbackAnswers(prev => ({ ...prev, mcq: value }))}
              disabled={feedbackSubmitted}
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
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">2. Which topics were most helpful? (Select all that apply)</h3>
            {['DOM Manipulation', 'Event Handling', 'Interactive Elements', 'Performance Optimization'].map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox 
                  id={`topic_${index}`}
                  checked={feedbackAnswers.checkbox.includes(option)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setFeedbackAnswers(prev => ({ 
                        ...prev, 
                        checkbox: [...prev.checkbox, option] 
                      }));
                    } else {
                      setFeedbackAnswers(prev => ({ 
                        ...prev, 
                        checkbox: prev.checkbox.filter(item => item !== option) 
                      }));
                    }
                  }}
                  disabled={feedbackSubmitted}
                />
                <Label htmlFor={`topic_${index}`} className="cursor-pointer">{option}</Label>
              </div>
            ))}
          </div>

          {/* Long Text Question */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">3. What suggestions do you have for improving this module?</h3>
            <Textarea
              value={feedbackAnswers.text}
              onChange={(e) => setFeedbackAnswers(prev => ({ ...prev, text: e.target.value }))}
              placeholder="Share your suggestions..."
              className="min-h-24"
              disabled={feedbackSubmitted}
            />
          </div>

          {/* Date Question */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">4. When did you start this module?</h3>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" disabled={feedbackSubmitted}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {feedbackAnswers.date ? feedbackAnswers.date.toLocaleDateString() : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={feedbackAnswers.date || undefined}
                  onSelect={(date) => setFeedbackAnswers(prev => ({ ...prev, date: date || null }))}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time Question */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">5. What time of day do you prefer studying?</h3>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <Input
                type="time"
                value={feedbackAnswers.time}
                onChange={(e) => setFeedbackAnswers(prev => ({ ...prev, time: e.target.value }))}
                disabled={feedbackSubmitted}
                className="w-40"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <Button 
            onClick={handleFeedbackSubmit}
            disabled={feedbackSubmitted}
          >
            {feedbackSubmitted ? 'Submitted ✓' : 'Submit'}
          </Button>
        </div>
      </div>
    );
  }

  // Handle Coding Problem rendering
  if (item.type === 'coding-problem') {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-heading font-bold">{item.title}</h1>
          <Badge variant="outline" className={item.status === 'completed' ? "text-success border-success" : "text-muted-foreground"}>
            {item.status === 'completed' ? 'Attempted' : 'Not Attempted'}
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-muted-foreground">Difficulty</p>
            <p className="font-medium">Medium</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Topic</p>
            <p className="font-medium">Arrays</p>
          </div>
        </div>
        
        <p className="text-muted-foreground mb-8">{item.description}</p>
        
        <div className="text-center">
          <Button onClick={() => setShowCodingProblem(true)}>
            {item.status === 'completed' ? 'View Submission' : 'Start Practice'}
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
          <h1 className="text-3xl font-heading font-bold mb-4">{item.title}</h1>
          <p className="text-muted-foreground mb-6">{item.description || "Join this live interactive session with your instructor and fellow students."}</p>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-muted-foreground">Scheduled Date & Time</p>
              <p className="font-medium">{item.scheduledDateTime?.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="font-medium">{item.duration || '45 mins'}</p>
            </div>
          </div>
          
          <div className="text-center mb-6">
            <Card className="bg-info-light border-info inline-block">
              <CardContent className="p-4">
                <p className="text-info font-semibold">
                  Class starts in {getTimeRemaining(item.scheduledDateTime!)}
                </p>
              </CardContent>
            </Card>
          </div>
          
          <p className="text-muted-foreground text-center">Class recording will be available after the class</p>
        </div>
      );
    }

    if (isInProgress) {
      return (
        <div className="max-w-4xl mx-auto p-8">
          <h1 className="text-3xl font-heading font-bold mb-4">{item.title}</h1>
          <p className="text-muted-foreground mb-6">{item.description || "Join this live interactive session with your instructor and fellow students."}</p>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-muted-foreground">Scheduled Date & Time</p>
              <p className="font-medium">{item.scheduledDateTime?.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="font-medium">{item.duration || '45 mins'}</p>
            </div>
          </div>
          <div className="text-center">
            <Button className="mb-6">Join Class</Button>
          </div>
        </div>
      );
    }

    if (isCompleted) {
      return (
        <div className="max-w-4xl mx-auto p-8">
          <h1 className="text-3xl font-heading font-bold mb-4">{item.title}</h1>
          <p className="text-muted-foreground mb-6">{item.description || "This live class has been completed."}</p>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <p className="text-sm text-muted-foreground">Date & Time</p>
              <p className="font-medium">{item.scheduledDateTime?.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="font-medium">{item.duration || '45 mins'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Attendance</p>
              <p className="font-medium text-success">Present</p>
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
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-heading font-bold">{item.title}</h1>
          <Badge variant="outline" className={item.status === 'completed' ? "text-success border-success" : "text-muted-foreground"}>
            {item.status === 'completed' ? 'Watched' : 'Not Watched'}
          </Badge>
        </div>
        <p className="text-muted-foreground mb-6">Duration: {item.duration || '20 mins'}</p>
        <div className="bg-black rounded-lg aspect-video flex items-center justify-center">
          <div className="text-center text-white">
            <Play className="w-16 h-16 mx-auto mb-4" />
            <p>Video Content</p>
            <p className="text-sm opacity-75">{item.duration || '20 mins'}</p>
          </div>
        </div>
      </div>
    );
  }

  // Handle article rendering
  if (item.type === 'article') {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-heading font-bold">{item.title}</h1>
          <Badge variant="outline" className={item.status === 'completed' ? "text-success border-success" : "text-muted-foreground"}>
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
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              Mark as Read
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Handle assignment rendering
  if (item.type === 'assignment') {
    const isDueDatePassed = new Date() > new Date('2024-12-15');
    
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-heading font-bold text-left">{item.title}</h1>
          <Badge variant="outline" className={item.status === 'completed' ? "text-success border-success" : "text-muted-foreground"}>
            {item.status === 'completed' ? 'Submitted' : 'Not Submitted'}
          </Badge>
        </div>
        <p className="text-muted-foreground mb-6 text-left">Due: December 15, 2024</p>
        <p className="text-muted-foreground mb-8 text-left">
          Complete this comprehensive assignment that covers all the concepts learned in this module. 
          You'll need to demonstrate your understanding through practical implementation and theoretical explanations.
          The assignment includes multiple components: coding exercises, written responses, and a final project.
        </p>
        
        <div className="mb-8">
          <h2 className="text-xl font-heading font-semibold mb-4">Make a Submission</h2>
          <div className="space-y-4">
            <Input
              placeholder="Paste your assignment link (Google Drive, GitHub, etc.)"
              value={assignmentLink}
              onChange={(e) => setAssignmentLink(e.target.value)}
              disabled={isDueDatePassed}
            />
            {!isDueDatePassed && (
              <Button 
                onClick={() => setAssignmentSubmitted(true)}
                disabled={!assignmentLink.trim() || assignmentSubmitted}
              >
                {assignmentSubmitted ? 'Submitted ✓' : 'Submit Assignment'}
              </Button>
            )}
            {assignmentSubmitted && assignmentLink && (
              <p className="text-sm text-muted-foreground">
                Submitted: <a href={assignmentLink} target="_blank" rel="noopener noreferrer" className="text-primary underline">{assignmentLink}</a>
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default ModuleContentRenderer;
