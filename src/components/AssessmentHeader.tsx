
import { Badge } from "@/components/ui/badge";

interface AssessmentHeaderProps {
  title: string;
  attemptStatus: string;
  startDate: Date;
  endDate: Date;
  duration: string;
  totalMarks: number;
  description: string;
}

const AssessmentHeader = ({ 
  title, 
  attemptStatus, 
  startDate, 
  endDate, 
  duration, 
  totalMarks, 
  description 
}: AssessmentHeaderProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-heading font-bold">{title}</h1>
        <Badge variant="outline" className="text-muted-foreground">
          {attemptStatus}
        </Badge>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Start Date</p>
          <p className="font-medium">{startDate.toLocaleDateString()}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">End Date</p>
          <p className="font-medium">{endDate.toLocaleDateString()}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Duration</p>
          <p className="font-medium">{duration}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Total Marks</p>
          <p className="font-medium">{totalMarks}</p>
        </div>
      </div>
      
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default AssessmentHeader;
