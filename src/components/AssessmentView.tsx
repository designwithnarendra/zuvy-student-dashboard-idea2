
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { Clock, Calendar, Award, AlertCircle, CheckCircle, XCircle } from "lucide-react";

interface AssessmentData {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  duration: string;
  totalMarks: number;
  passScore: number;
  state: 'scheduled' | 'open' | 'interrupted' | 'reAttemptRequested' | 'completed' | 'expired';
  score?: number;
  attemptStatus: 'Not Attempted' | 'Attempted' | 'Interrupted';
}

interface AssessmentViewProps {
  assessment: AssessmentData;
}

const AssessmentView = ({ assessment }: AssessmentViewProps) => {
  const [currentState, setCurrentState] = useState(assessment.state);
  const [countdown, setCountdown] = useState(3);
  const [isCountdownActive, setIsCountdownActive] = useState(false);

  useEffect(() => {
    if (currentState === 'scheduled') {
      setIsCountdownActive(true);
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setCurrentState('open');
            setIsCountdownActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentState]);

  const handleReAttemptRequest = () => {
    setCurrentState('reAttemptRequested');
    setTimeout(() => {
      setCurrentState('scheduled');
    }, 3000);
  };

  const formatCountdown = (seconds: number) => {
    if (seconds >= 86400) {
      const days = Math.floor(seconds / 86400);
      const hours = Math.floor((seconds % 86400) / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      return `${days} Days ${hours} Hours ${mins} Mins`;
    } else if (seconds >= 3600) {
      const hours = Math.floor(seconds / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      return `${hours} Hours ${mins} Mins`;
    } else {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins} Mins ${secs} Secs`;
    }
  };

  const getAttemptStatusBadge = () => {
    switch (assessment.attemptStatus) {
      case 'Attempted':
        return <Badge variant="outline" className="text-success border-success">Attempted</Badge>;
      case 'Interrupted':
        return <Badge variant="outline" className="text-warning border-warning">Interrupted</Badge>;
      default:
        return <Badge variant="outline" className="text-muted-foreground">Not Attempted</Badge>;
    }
  };

  const renderContent = () => {
    // Common header info
    const headerContent = (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-heading font-bold">{assessment.title}</h1>
          {getAttemptStatusBadge()}
        </div>
        
        <div className="grid grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Start Date</p>
            <p className="font-medium">{assessment.startDate.toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">End Date</p>
            <p className="font-medium">{assessment.endDate.toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Duration</p>
            <p className="font-medium">{assessment.duration}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Marks</p>
            <p className="font-medium">{assessment.totalMarks}</p>
          </div>
        </div>
        
        <p className="text-muted-foreground">{assessment.description}</p>
      </div>
    );

    switch (currentState) {
      case 'scheduled':
        return (
          <div className="space-y-6">
            {headerContent}
            
            <Card className="bg-info-light border-info/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-6 h-6 text-info" />
                  <div>
                    <p className="font-medium text-info">Assessment opens in</p>
                    <p className="text-info font-mono text-lg">
                      {isCountdownActive ? formatCountdown(countdown) : 'Opening soon...'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'open':
        return (
          <div className="space-y-6">
            {headerContent}
            
            <div className="space-y-4">
              <p className="text-muted-foreground">
                The assessment is open to be taken until {assessment.endDate.toLocaleString()}
              </p>
              
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Begin Assessment
              </Button>
            </div>
          </div>
        );

      case 'interrupted':
        return (
          <div className="space-y-6">
            {headerContent}
            
            <Card className="bg-warning-light border-warning/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-6 h-6 text-warning" />
                    <div>
                      <p className="font-medium text-warning">Your previous attempt was interrupted</p>
                      <p className="text-sm text-warning/80">You can request a re-attempt to continue</p>
                    </div>
                  </div>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" className="border-warning text-warning hover:bg-warning hover:text-warning-foreground">
                        Request Re-Attempt
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Request Re-Attempt</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to request a re-attempt for this assessment? 
                          Your previous attempt data will be cleared.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleReAttemptRequest}>
                          Send Request
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'reAttemptRequested':
        return (
          <div className="space-y-6">
            {headerContent}
            
            <Card className="bg-info-light border-info/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-info" />
                  <div>
                    <p className="font-medium text-info">Re-attempt request sent</p>
                    <p className="text-sm text-info/80">We'll notify you on email once it's approved</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'completed':
        const isPassed = (assessment.score || 0) >= assessment.passScore;
        const cardClass = isPassed ? "bg-success-light border-success/20" : "bg-destructive-light border-destructive/20";
        const textClass = isPassed ? "text-success" : "text-destructive";
        const IconComponent = isPassed ? CheckCircle : XCircle;
        
        return (
          <div className="space-y-6">
            {headerContent}
            
            <Card className={cardClass}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <IconComponent className={`w-6 h-6 ${textClass}`} />
                    <div>
                      <p className={`font-medium ${textClass}`}>
                        Your Score: {assessment.score}/{assessment.totalMarks}
                      </p>
                      <p className={`text-sm ${textClass}/80`}>
                        {isPassed 
                          ? "Congratulations, you passed!" 
                          : `You need at least ${assessment.passScore} marks to pass`
                        }
                      </p>
                    </div>
                  </div>
                  
                  <Button variant="link" className={`${textClass} p-0 h-auto`}>
                    View Results
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'expired':
        return (
          <div className="space-y-6">
            {headerContent}
            
            <Card className="bg-destructive-light border-destructive/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <XCircle className="w-6 h-6 text-destructive" />
                  <div>
                    <p className="font-medium text-destructive">Assessment has ended</p>
                    <p className="text-sm text-destructive/80">This assessment can no longer be attempted</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      {renderContent()}
    </div>
  );
};

export default AssessmentView;
