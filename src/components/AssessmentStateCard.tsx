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
import { formatDate, formatDateTime } from "@/lib/utils";

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
  styling?: {
    backgroundColor?: string;
    borderColor?: string;
    textColor?: string;
    textStyle?: string;
    ctaStyle?: string;
    topLineStyle?: string;
    scheduledForStyle?: string;
    startsInStyle?: string;
    removeBackgroundFromTimer?: boolean;
  };
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
  onViewResults,
  styling
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
      <Card className={styling?.backgroundColor || "bg-info-light"} style={{borderColor: styling?.borderColor ? `var(--${styling.borderColor.split('-')[1]})` : undefined}}>
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            {styling?.topLineStyle && (
              <div className="flex items-center justify-center space-x-2">
                <Calendar className="w-5 h-5 text-info" />
                <span className={styling?.topLineStyle || "text-base font-semibold"}>Assessment Scheduled</span>
              </div>
            )}
            <p className={`text-lg ${styling?.scheduledForStyle || "text-base font-normal"}`}>
              Assessment Scheduled for: {formatDateTime(endDate)}
            </p>
            <div className={styling?.startsInStyle || "text-base font-bold text-primary"}>
              {getTimeUntilStart()}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  switch (state) {
    case 'scheduled':
      return (
        <Card className={styling?.backgroundColor || "bg-muted-light"} style={{borderColor: styling?.borderColor ? `var(--${styling.borderColor.split('-')[1]})` : undefined}}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className={`w-5 h-5 ${styling?.textColor || "text-muted-foreground"}`} />
              <span className={styling?.textColor || ""}>Assessment Scheduled</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {countdown !== undefined && (
              <div className={`text-center ${!styling?.removeBackgroundFromTimer ? "p-4 bg-muted rounded-lg" : ""}`}>
                <div className={`text-2xl font-bold ${styling?.textColor || "text-primary"}`}>
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
        <Card className={styling?.backgroundColor || "bg-info-light"} style={{borderColor: styling?.borderColor ? `var(--${styling.borderColor.split('-')[1]})` : undefined}}>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <p className={`text-lg ${styling?.textColor || "text-info"} ${styling?.textStyle || ""}`}>Assessment is open. Please attempt it before end date</p>
              </div>
              <Button className={styling?.ctaStyle || "bg-info text-info-foreground hover:bg-info/90"} onClick={onBeginAssessment} size="lg">
                Begin Assessment
              </Button>
            </div>
          </CardContent>
        </Card>
      );

    case 'interrupted':
      return (
        <Card className={styling?.backgroundColor || "bg-warning-light"} style={{borderColor: styling?.borderColor ? `var(--${styling.borderColor.split('-')[1]})` : undefined}}>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <AlertTriangle className={`w-5 h-5 ${styling?.textColor || "text-warning"}`} />
                <p className={`text-lg ${styling?.textColor || "text-warning"}`}>Assessment interrupted due to technical issues</p>
              </div>
              <Button variant="outline" className={styling?.ctaStyle || "bg-warning-light text-warning border-warning hover:bg-warning hover:text-warning-foreground"} onClick={onReAttemptRequest}>
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
        <Card className={isPassed ? "bg-success-light border-success" : "bg-destructive-light border-destructive"}>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="flex flex-col items-center justify-center">
                <div className="flex items-center space-x-2">
                  {isPassed ? (
                    <CheckCircle className="w-5 h-5 text-success" />
                  ) : (
                    <X className="w-5 h-5 text-destructive" />
                  )}
                  <p className={isPassed ? "text-lg text-success font-semibold" : "text-lg text-destructive font-semibold"}>
                    {isPassed 
                      ? "You passed this assessment successfully" 
                      : "You have failed due to low score"}
                  </p>
                </div>
                <p className="font-bold mt-2">
                  Your Score: {score}
                </p>
              </div>
              <Button 
                className={isPassed ? "bg-success text-white hover:bg-success/90" : "bg-destructive text-white hover:bg-destructive/90"}
                onClick={onViewResults}
              >
                View Results
              </Button>
            </div>
          </CardContent>
        </Card>
      );

    case 'expired':
      return (
        <Card className="bg-destructive-light border-destructive">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <XCircle className="w-5 h-5 text-destructive" />
                <p className="text-lg font-semibold text-destructive">Assessment expired and cannot be submitted</p>
              </div>
              <div className="text-sm text-destructive/80">
                End Date: {formatDate(endDate)}
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
