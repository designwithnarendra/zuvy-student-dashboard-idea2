import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, X } from "lucide-react";

interface AssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed?: () => void;
  assessmentTitle: string;
  duration: string;
}

const AssessmentModal = ({ isOpen, onClose, onProceed, assessmentTitle, duration }: AssessmentModalProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleProceed = async () => {
    try {
      await document.documentElement.requestFullscreen();
      setIsFullscreen(true);
      if (onProceed) {
        onProceed();
      }
    } catch (error) {
      console.error('Failed to enter fullscreen:', error);
      // Proceed anyway for demo purposes
      if (onProceed) {
        onProceed();
      }
    }
  };

  const handleExitFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
      setIsFullscreen(false);
      onClose();
    } catch (error) {
      console.error('Failed to exit fullscreen:', error);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-warning" />
            <DialogTitle className="flex-1">Start Assessment</DialogTitle>
          </div>
          <div className="mt-6">
            <DialogDescription className="text-left">
              The assessment will happen in full screen mode. No tab switching, window switching, or full screen exit is allowed. Violations can result in auto-submission.
            </DialogDescription>
          </div>
        </DialogHeader>
        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Go Back
          </Button>
          <Button onClick={handleProceed}>
            Proceed
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssessmentModal;
