import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Clock, Calendar, AlertTriangle, CheckCircle, XCircle, RotateCcw } from "lucide-react";
import AssessmentModal from "./AssessmentModal";
import AssessmentPage from "./AssessmentPage";

interface AssessmentStateCardProps {
  assessment: any;
}

const AssessmentStateCard = ({ assessment }: AssessmentStateCardProps) => {
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [startAssessment, setStartAssessment] = useState(false);

  const handleCloseAssessment = () => {
    setStartAssessment(false);
    setShowAssessmentModal(false);
  };

  const handleProceedAssessment = () => {
    setStartAssessment(true);
  };

  const startDate = new Date();
  const endDate = new Date(startDate.getTime() + (60 * 60 * 1000));

  return (
    <>
      <Card className="p-6">
        <CardContent className="p-0 text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            {/* Available State */}
            {assessment.state === 'available' && (
              <>
                <CheckCircle className="w-12 h-12 text-success" />
                <h6 className="text-xl font-heading font-semibold text-success">Assessment Available</h6>
                <p className="text-muted-foreground">
                  You can now take the assessment. Make sure you have enough time to complete it.
                </p>
                <Button onClick={() => setShowAssessmentModal(true)}>
                  Begin Assessment
                </Button>
              </>
            )}

            {/* In Progress State */}
            {assessment.state === 'in-progress' && (
              <>
                <Clock className="w-12 h-12 text-warning" />
                <h6 className="text-xl font-heading font-semibold text-warning">Assessment In Progress</h6>
                <p className="text-muted-foreground">
                  Continue where you left off. Time is running!
                </p>
                <Button onClick={() => setStartAssessment(true)}>
                  Continue Assessment
                </Button>
              </>
            )}

            {/* Completed State */}
            {assessment.state === 'completed' && (
              <>
                <CheckCircle className="w-12 h-12 text-success" />
                <h6 className="text-xl font-heading font-semibold text-success">Assessment Completed</h6>
                <p className="text-muted-foreground">
                  You have already completed this assessment.
                </p>
                <Badge variant="secondary">Score: {assessment.score}</Badge>
              </>
            )}

            {/* Expired State */}
            {assessment.state === 'expired' && (
              <>
                <XCircle className="w-12 h-12 text-destructive" />
                <h6 className="text-xl font-heading font-semibold text-destructive">Assessment Expired</h6>
                <p className="text-muted-foreground">
                  The assessment time has expired. You cannot take it anymore.
                </p>
              </>
            )}

            {/* Re-attempt State */}
            {assessment.state === 'reattempt' && (
              <>
                <RotateCcw className="w-12 h-12 text-primary" />
                <h6 className="text-xl font-heading font-semibold text-primary">Re-attempt Available</h6>
                <p className="text-muted-foreground">
                  You can re-attempt the assessment.
                </p>
                <Button onClick={() => setShowAssessmentModal(true)}>
                  Re-attempt Assessment
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <AssessmentModal
        isOpen={showAssessmentModal}
        onClose={() => setShowAssessmentModal(false)}
        onProceed={handleProceedAssessment}
        assessmentTitle={assessment.title}
        duration={assessment.duration}
      />

      {startAssessment && (
        <AssessmentPage
          assessmentTitle={assessment.title}
          duration={assessment.duration}
          onClose={handleCloseAssessment}
        />
      )}
    </>
  );
};

export default AssessmentStateCard;
