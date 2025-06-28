
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface AssessmentHeaderProps {
  onClose: () => void;
  timeLeft: string;
}

const AssessmentHeader = ({ onClose, timeLeft }: AssessmentHeaderProps) => {
  return (
    <header className="w-full flex items-center justify-between p-4 border-b">
      <Button variant="ghost" size="icon" onClick={onClose}>
        <X className="w-5 h-5" />
      </Button>
      <div className="font-mono text-lg font-semibold">
        {timeLeft}
      </div>
    </header>
  );
};

export default AssessmentHeader;
