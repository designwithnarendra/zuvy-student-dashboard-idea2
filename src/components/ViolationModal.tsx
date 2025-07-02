
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";

interface ViolationType {
  type: 'fullscreen-exit' | 'copy-paste';
  count: number;
}

interface ViolationModalProps {
  isOpen: boolean;
  onClose: () => void;
  violation: ViolationType | null;
}

const ViolationModal = ({ isOpen, onClose, violation }: ViolationModalProps) => {
  if (!violation) return null;

  const getViolationInfo = (type: string) => {
    switch (type) {
      case 'fullscreen-exit':
        return {
          title: 'Full Screen Exit Detected',
          description: 'You have attempted to exit full screen mode. Please return to full screen to continue your assessment. Repeated violations will lead to automatic assessment submission.',
          action: 'Return to Full Screen'
        };
      case 'copy-paste':
        return {
          title: 'Copy/Paste Violation',
          description: 'Copy and paste operations are not permitted during the assessment. This action has been blocked. Repeated violations will lead to automatic assessment submission.',
          action: 'Continue Assessment'
        };
      default:
        return {
          title: 'Violation Detected',
          description: 'A violation has been detected.',
          action: 'Continue Assessment'
        };
    }
  };

  const violationInfo = getViolationInfo(violation.type);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              <DialogTitle className="text-lg">{violationInfo.title}</DialogTitle>
            </div>
          </div>
          <div className="mt-4">
            <Badge variant="destructive" className="mb-4">
              Violation {violation.count}/3
            </Badge>
          </div>
          <DialogDescription className="text-left text-base">
            {violationInfo.description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onClose} className="w-full">
            {violationInfo.action}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViolationModal;
