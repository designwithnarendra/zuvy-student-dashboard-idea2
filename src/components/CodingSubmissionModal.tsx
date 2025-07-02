import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface CodingSubmissionModalProps {
  isOpen: boolean;
  onViewSolution: () => void;
  onReturnToCourse: () => void;
  problemTitle: string;
  score?: string;
}

const CodingSubmissionModal = ({ 
  isOpen, 
  onViewSolution, 
  onReturnToCourse, 
  problemTitle,
  score 
}: CodingSubmissionModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-success-light rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
          </div>
          <DialogTitle className="text-center text-xl">
            Submission Successful!
          </DialogTitle>
        </DialogHeader>
        
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">
            Your solution for <span className="font-semibold">{problemTitle}</span> has been submitted successfully.
          </p>
          
          {score && (
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-sm font-medium">Your Score: {score}</p>
            </div>
          )}
          
          <div className="flex flex-col gap-3 pt-4">
            <Button onClick={onViewSolution} size="lg" className="w-full">
              View Solution
            </Button>
            <Button onClick={onReturnToCourse} variant="outline" size="lg" className="w-full">
              Return to Course
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CodingSubmissionModal; 