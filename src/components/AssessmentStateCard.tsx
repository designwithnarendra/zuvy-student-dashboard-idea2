
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, XCircle, Calendar } from "lucide-react";
import AssessmentModal from "./AssessmentModal";

interface Assessment {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  duration: string;
  totalMarks: number;
  passScore: number;
  state: 'scheduled' | 'active' | 'completed' | 'expired';
  score?: number;
  attemptStatus: string;
}

interface AssessmentStateCardProps {
  assessment: Assessment;
}

const AssessmentStateCard = ({ assessment }: AssessmentStateCardProps) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (assessment.state === 'scheduled') {
      const updateTimer = () => {
        const now = new Date();
        const timeDiff = assessment.startDate.getTime() - now.getTime();
        
        if (timeDiff <= 0) {
          setTimeLeft('0');
          return;
        }
        
        const seconds = Math.floor(timeDiff / 1000);
        setTimeLeft(seconds.toString());
      };

      updateTimer();
      const interval = setInterval(updateTimer, 1000);

      return () => clearInterval(interval);
    }
  }, [assessment.state, assessment.startDate]);

  const formatTimeLeft = (seconds: string) => {
    const sec = parseInt(seconds);
    if (sec <= 0) return "Assessment starting now";
    
    if (sec < 60) return `${sec} second${sec !== 1 ? 's' : ''}`;
    
    const mins = Math.floor(sec / 60);
    if (mins < 60) return `${mins} minute${mins !== 1 ? 's' : ''}`;
    
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''}`;
    
    const days = Math.floor(hours / 24);
    return `${days} day${days !== 1 ? 's' : ''}`;
  };

  const getScoreStatus = () => {
    if (assessment.score === undefined) return null;
    return assessment.score >= assessment.passScore ? 'pass' : 'fail';
  };

  const scoreStatus = getScoreStatus();

  if (assessment.state === 'scheduled') {
    return (
      <>
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-heading font-bold">{assessment.title}</h3>
              <Badge variant="outline" className="bg-info-light text-info border-info">
                Scheduled
              </Badge>
            </div>
            
            <p className="text-muted-foreground mb-6">{assessment.description}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Start Date</p>
                  <p className="font-medium">{assessment.startDate.toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-medium">{assessment.duration}</p>
                </div>
              </div>
            </div>

            <div className="text-center mb-6">
              <Card className="bg-info-light border-info inline-block">
                <CardContent className="p-4">
                  <p className="text-info font-semibold">
                    Assessment starts in {formatTimeLeft(timeLeft)}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <Button 
                onClick={() => setShowModal(true)}
                disabled={parseInt(timeLeft) > 0}
              >
                Begin Assessment
              </Button>
            </div>
          </CardContent>
        </Card>

        <AssessmentModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          assessmentTitle={assessment.title}
          duration={assessment.duration}
        />
      </>
    );
  }

  if (assessment.state === 'completed') {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-heading font-bold">{assessment.title}</h3>
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-success-light text-success border-success">
                Completed
              </Badge>
              {scoreStatus && (
                <Badge 
                  variant="outline" 
                  className={scoreStatus === 'pass' 
                    ? "bg-success-light text-success border-success" 
                    : "bg-destructive-light text-destructive border-destructive"
                  }
                >
                  {scoreStatus === 'pass' ? 'Pass' : 'Fail'}
                </Badge>
              )}
            </div>
          </div>
          
          <p className="text-muted-foreground mb-6">{assessment.description}</p>
          
          {assessment.score !== undefined && (
            <div className="flex items-center gap-2 mb-4">
              {scoreStatus === 'pass' ? (
                <CheckCircle className="w-5 h-5 text-success" />
              ) : (
                <XCircle className="w-5 h-5 text-destructive" />
              )}
              <span className="font-medium">Score: {assessment.score}/{assessment.totalMarks}</span>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Submitted Date</p>
              <p className="font-medium">{assessment.endDate.toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="font-medium">{assessment.duration}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (assessment.state === 'expired') {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-heading font-bold">{assessment.title}</h3>
            <Badge variant="outline" className="bg-muted text-muted-foreground">
              Expired
            </Badge>
          </div>
          
          <p className="text-muted-foreground mb-6">{assessment.description}</p>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">End Date</p>
              <p className="font-medium">{assessment.endDate.toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="font-medium text-muted-foreground">Assessment Expired</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
};

export default AssessmentStateCard;
