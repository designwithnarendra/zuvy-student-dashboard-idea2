
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Play, Check, Clock } from "lucide-react";
import AssessmentView from "./AssessmentView";
import CodingProblemPage from "./CodingProblemPage";
import VideoLearningItem from "./VideoLearningItem";
import ArticleLearningItem from "./ArticleLearningItem";
import QuizLearningItem from "./QuizLearningItem";
import FeedbackLearningItem from "./FeedbackLearningItem";

interface ModuleContentRendererProps {
  selectedItemData: { item: any; topicId: string } | null;
  getAssessmentData: (itemId: string) => any;
}

const ModuleContentRenderer = ({ selectedItemData, getAssessmentData }: ModuleContentRendererProps) => {
  const [showCodingProblem, setShowCodingProblem] = useState(false);
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

  // Handle coding problem page as separate page
  if (showCodingProblem && item.type === 'coding-problem') {
    return (
      <div className="fixed inset-0 z-50 bg-background">
        <CodingProblemPage
          problem={{
            title: item.title,
            difficulty: 'Medium',
            topic: 'Arrays',
            status: item.status
          }}
          onClose={() => setShowCodingProblem(false)}
        />
      </div>
    );
  }

  // Handle assessment rendering
  if (item.type === 'assessment') {
    const assessmentData = getAssessmentData(item.id);
    if (assessmentData) {
      return <AssessmentView assessment={assessmentData} />;
    }
  }

  // Handle different learning item types with focused components
  if (item.type === 'video') {
    return <VideoLearningItem item={item} />;
  }

  if (item.type === 'article') {
    return <ArticleLearningItem item={item} />;
  }

  if (item.type === 'quiz') {
    return <QuizLearningItem item={item} />;
  }

  if (item.type === 'feedback') {
    return <FeedbackLearningItem item={item} />;
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
              <p className="font-medium">{item.scheduledDateTime?.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="font-medium">{item.duration || '45 mins'}</p>
            </div>
          </div>
          
          <div className="w-full mb-6">
            <Card className="bg-info-light border-info w-full">
              <CardContent className="p-4 text-center">
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
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-heading font-bold">{item.title}</h1>
            <Badge variant="outline" className="text-success border-success">
              Live Now
            </Badge>
          </div>
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
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-heading font-bold">{item.title}</h1>
            <Badge variant="outline" className="text-success border-success">
              Completed
            </Badge>
          </div>
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

  // Handle assignment rendering
  if (item.type === 'assignment') {
    const isDueDatePassed = new Date() > new Date('2024-12-15');
    
    const handleAssignmentSubmit = () => {
      if (assignmentLink.trim()) {
        setAssignmentSubmitted(true);
      }
    };
    
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-heading font-bold text-left">{item.title}</h1>
          <Badge variant="outline" className={assignmentSubmitted ? "text-success border-success" : "text-muted-foreground"}>
            {assignmentSubmitted ? 'Submitted' : 'Not Submitted'}
          </Badge>
        </div>
        <p className="text-muted-foreground mb-6 text-left">Due: December 15, 2024</p>
        <p className="text-muted-foreground mb-8 text-left">
          Complete this comprehensive assignment that covers all the concepts learned in this module. 
          You'll need to demonstrate your understanding through practical implementation and theoretical explanations.
          The assignment includes multiple components: coding exercises, written responses, and a final project.
          This assignment will test your ability to apply DOM manipulation techniques in real-world scenarios.
        </p>
        
        <div className="mb-8">
          <h2 className="text-xl font-heading font-semibold mb-4">Make a Submission</h2>
          <div className="space-y-4">
            {assignmentSubmitted ? (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Submitted:</p>
                <a href={assignmentLink} target="_blank" rel="noopener noreferrer" className="text-primary underline break-all">
                  {assignmentLink}
                </a>
              </div>
            ) : (
              <Input
                placeholder="Paste your assignment link (Google Drive, GitHub, etc.)"
                value={assignmentLink}
                onChange={(e) => setAssignmentLink(e.target.value)}
                disabled={isDueDatePassed}
              />
            )}
            {!isDueDatePassed && (
              <Button 
                onClick={handleAssignmentSubmit}
                disabled={!assignmentLink.trim()}
              >
                {assignmentSubmitted ? 'Re-Submit Assignment' : 'Submit Assignment'}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default ModuleContentRenderer;
