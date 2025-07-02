import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Monitor, Info } from "lucide-react";

interface FullscreenWarningModalProps {
  isOpen: boolean;
  onProceed: () => void;
  onCancel: () => void;
  assessmentTitle: string;
}

const FullscreenWarningModal = ({ 
  isOpen, 
  onProceed, 
  onCancel, 
  assessmentTitle 
}: FullscreenWarningModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-warning-light rounded-full flex items-center justify-center">
              <Monitor className="w-8 h-8 text-warning" />
            </div>
          </div>
          <DialogTitle className="text-center text-xl">
            Fullscreen Mode Required
          </DialogTitle>
        </DialogHeader>
        
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">
            <span className="font-semibold">{assessmentTitle}</span> requires fullscreen mode for proctoring purposes.
          </p>
          
          <div className="bg-info-light border border-info rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-5 h-5 text-info" />
              <p className="font-semibold text-info">Important Guidelines</p>
            </div>
            <ul className="text-sm text-info space-y-1 text-left">
              <li>• Do not switch tabs or applications</li>
              <li>• Do not exit fullscreen mode</li>
              <li>• Violations will be tracked and reported</li>
              <li>• Keep your webcam and microphone ready</li>
            </ul>
          </div>
          
          <div className="flex flex-col gap-3 pt-4">
            <Button onClick={onProceed} size="lg" className="w-full">
              I Understand, Proceed
            </Button>
            <Button onClick={onCancel} variant="outline" size="lg" className="w-full">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FullscreenWarningModal; 