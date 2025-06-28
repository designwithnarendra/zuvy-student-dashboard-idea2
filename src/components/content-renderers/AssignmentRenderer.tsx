
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AssignmentRendererProps {
  item: any;
}

const AssignmentRenderer = ({ item }: AssignmentRendererProps) => {
  const [assignmentLink, setAssignmentLink] = useState('');
  const [assignmentSubmitted, setAssignmentSubmitted] = useState(false);

  const isDueDatePassed = new Date() > new Date('2024-12-15');
  
  const handleAssignmentSubmit = () => {
    if (assignmentLink.trim()) {
      setAssignmentSubmitted(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-heading font-bold text-left">{item.title}</h1>
        <Badge variant="outline" className={assignmentSubmitted ? "text-success border-success" : "text-muted-foreground"}>
          {assignmentSubmitted ? 'Submitted' : 'Not Submitted'}
        </Badge>
      </div>
      <p className="text-muted-foreground mb-6 text-left">Due: December 15, 2024</p>
      <p className="text-muted-foreground mb-8 text-left">
        Complete this comprehensive assignment that covers all the concepts learned in this module. 
        You'll need to demonstrate your understanding through practical implementation and theoretical explanations.
        The assignment includes multiple components: coding exercises, written responses, and a final project.
      </p>
      
      <div className="mb-8">
        <h2 className="text-xl font-heading font-semibold mb-4">Make a Submission</h2>
        <div className="space-y-4">
          {!assignmentSubmitted ? (
            <>
              <Input
                placeholder="Paste your assignment link (Google Drive, GitHub, etc.)"
                value={assignmentLink}
                onChange={(e) => setAssignmentLink(e.target.value)}
                disabled={isDueDatePassed}
              />
              <Button 
                onClick={handleAssignmentSubmit}
                disabled={!assignmentLink.trim() || isDueDatePassed}
              >
                Submit Assignment
              </Button>
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Submitted: <a href={assignmentLink} target="_blank" rel="noopener noreferrer" className="text-primary underline">{assignmentLink}</a>
              </p>
              <Button 
                onClick={() => setAssignmentSubmitted(false)}
                disabled={isDueDatePassed}
                variant="outline"
              >
                Re-Submit Assignment
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignmentRenderer;
