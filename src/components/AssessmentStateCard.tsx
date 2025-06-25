
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Clock, Calendar, AlertCircle, CheckCircle, XCircle } from "lucide-react";

interface AssessmentStateCardProps {
  state: 'scheduled' | 'open' | 'interrupted' | 'reAttemptRequested' | 'completed' | 'expired';
  countdown?: number;
  endDate?: Date;
  score?: number;
  totalMarks?: number;
  passScore?: number;
  onReAttemptRequest?: () => void;
  onBeginAssessment?: () => void;
}

const AssessmentStateCard = ({ 
  state, 
  countdown, 
  endDate, 
  score, 
  totalMarks, 
  passScore, 
  onReAttemptRequest,
  onBeginAssessment 
}: AssessmentStateCardProps) => {
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

  switch (state) {
    case 'scheduled':
      return (
        <Card className="bg-info-light border-info/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-info" />
              <div>
                <p className="font-medium text-info">Assessment opens in</p>
                <p className="text-info font-mono text-lg">
                  {countdown ? formatCountdown(countdown) : 'Opening soon...'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      );

    case 'open':
      return (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            The assessment is open to be taken until {endDate?.toLocaleString()}
          </p>
          
          <Button size="lg" className="bg-primary hover:bg-primary/90" onClick={onBeginAssessment}>
            Begin Assessment
          </Button>
        </div>
      );

    case 'interrupted':
      return (
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
                    <AlertDialogAction onClick={onReAttemptRequest}>
                      Send Request
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      );

    case 'reAttemptRequested':
      return (
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
      );

    case 'completed':
      const isPassed = (score || 0) >= (passScore || 60);
      const cardClass = isPassed ? "bg-success-light border-success/20" : "bg-destructive-light border-destructive/20";
      const textClass = isPassed ? "text-success" : "text-destructive";
      const IconComponent = isPassed ? CheckCircle : XCircle;
      
      return (
        <Card className={cardClass}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <IconComponent className={`w-6 h-6 ${textClass}`} />
                <div>
                  <p className={`font-medium ${textClass}`}>
                    Your Score: {score}/{totalMarks}
                  </p>
                  <p className={`text-sm ${textClass}/80`}>
                    {isPassed 
                      ? "Congratulations, you passed!" 
                      : `You need at least ${passScore} marks to pass`
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
      );

    case 'expired':
      return (
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
      );

    default:
      return null;
  }
};

export default AssessmentStateCard;
