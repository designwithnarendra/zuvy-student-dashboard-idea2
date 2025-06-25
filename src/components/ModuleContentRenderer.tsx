
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Check } from "lucide-react";
import { TopicItem } from "@/lib/mockData";
import AssessmentView from "./AssessmentView";

interface ModuleContentRendererProps {
  selectedItemData: { item: TopicItem; topicId: string } | null;
  getAssessmentData: (itemId: string) => any;
}

const ModuleContentRenderer = ({ selectedItemData, getAssessmentData }: ModuleContentRendererProps) => {
  const getTimeRemaining = (dateTime: Date) => {
    const now = new Date();
    const timeDiff = dateTime.getTime() - now.getTime();
    
    if (timeDiff <= 0) return "Starting now";
    
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
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
      return <AssessmentView assessment={assessmentData} />;
    }
  }

  if (item.type === 'live-class') {
    const isScheduled = item.scheduledDateTime && new Date() < item.scheduledDateTime;
    const isInProgress = item.scheduledDateTime && 
      new Date() >= new Date(item.scheduledDateTime.getTime() - 10 * 60 * 1000) &&
      new Date() < new Date(item.scheduledDateTime.getTime() + 60 * 60 * 1000);
    const isCompleted = item.status === 'completed';

    if (isScheduled) {
      return (
        <div className="max-w-4xl mx-auto p-8">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-heading font-bold">{item.title}</h1>
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
          <div className="bg-info-light p-4 rounded-lg mb-6">
            <p className="text-info">Class recording will be available after the class</p>
          </div>
          <div className="text-center">
            <Button disabled variant="outline" className="bg-transparent border-muted text-muted-foreground">
              Starts in {getTimeRemaining(item.scheduledDateTime!)}
            </Button>
          </div>
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

  if (item.type === 'video') {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="flex justify-between items-start mb-6">
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

  if (item.type === 'article') {
    return (
      <div className="max-w-2xl mx-auto p-8">
        <div className="flex justify-between items-start mb-6">
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

  if (item.type === 'assignment') {
    return (
      <div className="max-w-2xl mx-auto p-8">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-3xl font-heading font-bold text-left">{item.title}</h1>
          <Badge variant="outline" className={item.status === 'completed' ? "text-success border-success" : "text-muted-foreground"}>
            {item.status === 'completed' ? 'Attempted' : 'Not Attempted'}
          </Badge>
        </div>
        <p className="text-muted-foreground mb-6 text-left">Due: December 15, 2024</p>
        <p className="text-muted-foreground mb-8 text-left">Complete this assignment to demonstrate your understanding of the concepts covered in this module.</p>
        <div className="text-center">
          <Button>Start Assignment</Button>
        </div>
      </div>
    );
  }

  return null;
};

export default ModuleContentRenderer;
