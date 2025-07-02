import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Clock } from "lucide-react";

interface AssessmentExitWarningModalProps {
  isOpen: boolean;
  onStayInAssessment: () => void;
  onExitAndSubmit: () => void;
  assessmentTitle: string;
  timeRemaining?: string;
}

const AssessmentExitWarningModal = ({ 
  isOpen, 
  onStayInAssessment, 
  onExitAndSubmit, 
  assessmentTitle,
  timeRemaining 
}: AssessmentExitWarningModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-destructive-light rounded-full flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
          </div>
          <DialogTitle className="text-center text-xl">
            Exit Assessment?
          </DialogTitle>
        </DialogHeader>
        
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">
            Are you sure you want to exit <span className="font-semibold">{assessmentTitle}</span>?
          </p>
          
          <div className="bg-destructive-light border border-destructive rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              <p className="font-semibold text-destructive">Warning</p>
            </div>
            <ul className="text-sm text-destructive space-y-1 text-left">
              <li>• Your current progress will be auto-submitted</li>
              <li>• You cannot resume this assessment attempt</li>
              <li>• Incomplete sections will be marked as not attempted</li>
              {timeRemaining && <li>• Time remaining: {timeRemaining}</li>}
            </ul>
          </div>
          
          <div className="bg-info-light border border-info rounded-lg p-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-info" />
              <p className="text-sm text-info font-medium">
                We recommend staying to complete your assessment
              </p>
            </div>
          </div>
          
          <div className="flex flex-col gap-3 pt-4">
            <Button onClick={onStayInAssessment} size="lg" className="w-full">
              Stay in Assessment
            </Button>
            <Button onClick={onExitAndSubmit} variant="destructive" size="lg" className="w-full">
              Exit and Submit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssessmentExitWarningModal; 