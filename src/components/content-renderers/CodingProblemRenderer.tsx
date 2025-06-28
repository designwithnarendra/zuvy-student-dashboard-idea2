
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CodingProblemPage from "../CodingProblemPage";

interface CodingProblemRendererProps {
  item: any;
}

const CodingProblemRenderer = ({ item }: CodingProblemRendererProps) => {
  const [showCodingProblem, setShowCodingProblem] = useState(false);

  if (showCodingProblem) {
    return (
      <CodingProblemPage
        problem={{
          title: item.title,
          difficulty: 'Medium',
          topic: 'Arrays',
          status: item.status
        }}
        onClose={() => setShowCodingProblem(false)}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-heading font-bold">{item.title}</h1>
        <Badge variant="outline" className={item.status === 'completed' ? "text-success border-success" : "text-muted-foreground"}>
          {item.status === 'completed' ? 'Submitted' : 'Not Attempted'}
        </Badge>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div>
          <p className="text-sm text-muted-foreground">Difficulty</p>
          <p className="font-medium">Medium</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Topic</p>
          <p className="font-medium">Arrays</p>
        </div>
        {item.status === 'completed' && (
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <p className="font-medium text-success">Submitted</p>
          </div>
        )}
      </div>
      
      <p className="text-muted-foreground mb-8">{item.description}</p>
      
      <div className="text-center">
        <Button onClick={() => setShowCodingProblem(true)}>
          {item.status === 'completed' ? 'View Solution' : 'Start Practice'}
        </Button>
      </div>
    </div>
  );
};

export default CodingProblemRenderer;
