
import { Badge } from "@/components/ui/badge";
import { getStatusBadgeStyles, formatDate } from "@/lib/utils";

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
  const getAttemptStatusBadge = () => {
    switch (attemptStatus) {
      case 'Attempted':
        return <Badge variant="outline" className={getStatusBadgeStyles('completed')}>Attempted</Badge>;
      case 'Interrupted':
        return <Badge variant="outline" className={getStatusBadgeStyles('interrupted')}>Interrupted</Badge>;
      default:
        return <Badge variant="outline" className={getStatusBadgeStyles('not attempted')}>Not Attempted</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-heading font-bold">{title}</h1>
        {getAttemptStatusBadge()}
      </div>
      
      <div className="grid grid-cols-4 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Start Date</p>
          <p className="font-medium">{formatDate(startDate)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">End Date</p>
          <p className="font-medium">{formatDate(endDate)}</p>
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
