import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  RotateCcw,
  Eye,
  X
} from "lucide-react";

interface AssessmentStateCardProps {
  state: 'scheduled' | 'open' | 'interrupted' | 'reAttemptRequested' | 'completed' | 'expired';
  assessmentId: string;
  countdown?: number;
  endDate: Date;
  score?: number;
  totalMarks: number;
  passScore: number;
  onReAttemptRequest?: () => void;
  onBeginAssessment?: () => void;
  onViewResults?: () => void;
}

const AssessmentStateCard = ({ 
  state, 
  assessmentId,
  countdown, 
  endDate, 
  score, 
  totalMarks, 
  passScore,
  onReAttemptRequest,
  onBeginAssessment,
  onViewResults
}: AssessmentStateCardProps) => {

  const formatCountdown = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeUntilStart = () => {
    const now = new Date();
    const scheduledTime = new Date(endDate.getTime() - 2 * 24 * 60 * 60 * 1000); // 2 days before end
    const timeDiff = scheduledTime.getTime() - now.getTime();
    
    if (timeDiff <= 0) return "Assessment is ready";
    
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return `Starts in ${days} day${days > 1 ? 's' : ''}`;
    } else {
      return `Starts in ${hours} hour${hours > 1 ? 's' : ''}`;
    }
  };

  const isPassed = score !== undefined && score >= passScore;

  // Static scheduled state for React Advanced Patterns Assessment
  if (assessmentId === 'static-scheduled-assessment') {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <span className="text-lg font-semibold">Assessment Scheduled</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Scheduled for: {endDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-2xl font-mono font-bold text-primary">
                {getTimeUntilStart()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  switch (state) {
    case 'scheduled':
      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <span>Assessment Scheduled</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {countdown !== undefined && (
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-mono font-bold text-primary">
                  {formatCountdown(countdown)}
                </div>
                <p className="text-sm text-muted-foreground">
                  Assessment starts automatically
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      );

    case 'open':
      return (
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <span className="text-lg font-semibold">Assessment is open. Please attempt it before end date</span>
              </div>
              <Button onClick={onBeginAssessment} size="lg">
                Begin Assessment
              </Button>
            </div>
          </CardContent>
        </Card>
      );

    case 'interrupted':
      return (
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-warning" />
                <span className="text-lg font-semibold">Assessment interrupted due to technical issues</span>
              </div>
              <Button onClick={onReAttemptRequest}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Request Re-attempt
              </Button>
            </div>
          </CardContent>
        </Card>
      );

    case 'reAttemptRequested':
      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <span>Re-attempt Requested</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription>
                Your re-attempt request has been sent. Please wait for instructor approval.
              </AlertDescription>
            </Alert>
            <div className="text-center text-sm text-muted-foreground">
              Click here to simulate approval and restart assessment
            </div>
          </CardContent>
        </Card>
      );

    case 'completed':
      return (
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-2">
                {isPassed ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-success" />
                    <span className="text-lg font-semibold">You passed this assessment successfully</span>
                  </>
                ) : (
                  <>
                    <X className="w-5 h-5 text-destructive" />
                    <span className="text-lg font-semibold">You have failed due to low score</span>
                  </>
                )}
              </div>
              <div className="space-y-2">
                <div className="text-xl font-bold">Your Score: {score}</div>
                {!isPassed && (
                  <div className="text-sm text-muted-foreground">
                    Passing Score: {passScore}
                  </div>
                )}
                <Button onClick={onViewResults}>
                  View Results
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      );

    case 'expired':
      return (
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <XCircle className="w-5 h-5 text-destructive" />
                <span className="text-lg font-semibold">Assessment expired and cannot be submitted</span>
              </div>
              <div className="text-sm text-muted-foreground">
                End Date: {endDate.toLocaleDateString()}
              </div>
            </div>
          </CardContent>
        </Card>
      );

    default:
      return (
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-muted-foreground">
              Assessment state not recognized
            </div>
          </CardContent>
        </Card>
      );
  }
};

export default AssessmentStateCard;
