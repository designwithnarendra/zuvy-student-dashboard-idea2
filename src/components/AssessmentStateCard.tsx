
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, CheckCircle, XCircle } from "lucide-react";

interface AssessmentStateCardProps {
  state: 'scheduled' | 'open' | 'interrupted' | 'reAttemptRequested' | 'reAttemptFlow' | 'completed' | 'expired';
  countdown?: number;
  endDate: Date;
  score?: number;
  totalMarks: number;
  passScore: number;
  onReAttemptRequest: () => void;
  onBeginAssessment: () => void;
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
  const [reAttemptFlowState, setReAttemptFlowState] = useState<'interrupted' | 'requested' | 'approved'>('interrupted');

  const handleReAttemptRequest = () => {
    setReAttemptFlowState('requested');
    setTimeout(() => {
      setReAttemptFlowState('approved');
    }, 3000);
  };

  const getTimeRemaining = () => {
    const now = new Date();
    const timeDiff = endDate.getTime() - now.getTime();
    
    if (timeDiff <= 0) return "Assessment has ended";
    
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} remaining`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} remaining`;
    return "Less than 1 hour remaining";
  };

  if (state === 'reAttemptFlow') {
    if (reAttemptFlowState === 'interrupted') {
      return (
        <Card className="border-warning bg-warning-light">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-5 h-5 text-warning" />
              <h3 className="font-semibold">Assessment Interrupted</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Your previous attempt was interrupted. You can request a re-attempt to complete the assessment.
            </p>
            <Button onClick={handleReAttemptRequest}>
              Request Re-Attempt
            </Button>
          </CardContent>
        </Card>
      );
    }

    if (reAttemptFlowState === 'requested') {
      return (
        <Card className="border-info bg-info-light">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-5 h-5 text-info" />
              <h3 className="font-semibold">Re-attempt Requested</h3>
            </div>
            <p className="text-muted-foreground">
              Your re-attempt request has been sent. We'll notify you on email once it's approved.
            </p>
          </CardContent>
        </Card>
      );
    }

    if (reAttemptFlowState === 'approved') {
      return (
        <Card className="border-success bg-success-light">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-5 h-5 text-success" />
              <h3 className="font-semibold">Re-attempt Approved</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Your re-attempt has been approved. You can now begin the assessment.
            </p>
            <p className="text-sm text-muted-foreground mb-4">{getTimeRemaining()}</p>
            <Button onClick={onBeginAssessment}>
              Begin Assessment
            </Button>
          </CardContent>
        </Card>
      );
    }
  }

  if (state === 'scheduled') {
    return (
      <Card className="border-info bg-info-light">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-5 h-5 text-info" />
            <h3 className="font-semibold">Assessment Scheduled</h3>
          </div>
          {countdown !== undefined && (
            <div className="text-center mb-4">
              <div className="text-2xl font-mono font-bold text-info">
                {countdown}
              </div>
              <p className="text-sm text-muted-foreground">seconds to start</p>
            </div>
          )}
          <p className="text-muted-foreground">{getTimeRemaining()}</p>
        </CardContent>
      </Card>
    );
  }

  if (state === 'open') {
    return (
      <Card className="border-success bg-success-light">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="w-5 h-5 text-success" />
            <h3 className="font-semibold">Assessment Available</h3>
          </div>
          <p className="text-muted-foreground mb-4">
            The assessment is now available. Click below to begin.
          </p>
          <p className="text-sm text-muted-foreground mb-4">{getTimeRemaining()}</p>
          <Button onClick={onBeginAssessment}>
            Begin Assessment
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (state === 'interrupted') {
    return (
      <Card className="border-warning bg-warning-light">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-5 h-5 text-warning" />
            <h3 className="font-semibold">Assessment Interrupted</h3>
          </div>
          <p className="text-muted-foreground mb-4">
            Your assessment was interrupted. You can request a re-attempt if needed.
          </p>
          <p className="text-sm text-muted-foreground mb-4">{getTimeRemaining()}</p>
          <Button onClick={onReAttemptRequest}>
            Request Re-Attempt
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (state === 'reAttemptRequested') {
    return (
      <Card className="border-info bg-info-light">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-5 h-5 text-info" />
            <h3 className="font-semibold">Re-attempt Requested</h3>
          </div>
          <p className="text-muted-foreground">
            Your re-attempt request is being processed. We'll notify you once approved.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (state === 'completed') {
    const passed = score !== undefined && score >= passScore;
    return (
      <Card className={`border-${passed ? 'success' : 'destructive'} bg-${passed ? 'success' : 'destructive'}-light`}>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            {passed ? (
              <CheckCircle className="w-5 h-5 text-success" />
            ) : (
              <XCircle className="w-5 h-5 text-destructive" />
            )}
            <h3 className="font-semibold">Assessment Completed</h3>
          </div>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>Your Score:</span>
              <span className="font-semibold">{score}/{totalMarks}</span>
            </div>
            <div className="flex justify-between">
              <span>Pass Score:</span>
              <span>{passScore}/{totalMarks}</span>
            </div>
            <div className="flex justify-between">
              <span>Result:</span>
              <Badge variant={passed ? "default" : "destructive"}>
                {passed ? "Passed" : "Failed"}
              </Badge>
            </div>
          </div>
          {!passed && (
            <Button onClick={onReAttemptRequest} variant="outline">
              Request Re-Attempt
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  if (state === 'expired') {
    return (
      <Card className="border-destructive bg-destructive-light">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <XCircle className="w-5 h-5 text-destructive" />
            <h3 className="font-semibold">Assessment Expired</h3>
          </div>
          <p className="text-muted-foreground">
            The assessment period has ended. This assessment is no longer available.
          </p>
        </CardContent>
      </Card>
    );
  }

  return null;
};

export default AssessmentStateCard;
