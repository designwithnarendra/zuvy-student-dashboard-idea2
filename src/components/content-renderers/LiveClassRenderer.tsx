
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Check } from "lucide-react";

interface LiveClassRendererProps {
  item: any;
}

const LiveClassRenderer = ({ item }: LiveClassRendererProps) => {
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
        
        <div className="mb-6">
          <Card className="bg-info-light border-info w-full">
            <CardContent className="p-4">
              <p className="text-info font-semibold text-center">
                Class starts in {getTimeRemaining(item.scheduledDateTime!)}
              </p>
            </CardContent>
          </Card>
        </div>
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

  return null;
};

export default LiveClassRenderer;
