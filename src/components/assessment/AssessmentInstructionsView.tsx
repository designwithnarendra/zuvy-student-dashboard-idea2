
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

interface AssessmentInstructionsViewProps {
  assessmentTitle: string;
  codingChallenges: any[];
  mcqQuizzes: any[];
  completedSections: any;
  onNavigate: (view: string, index?: number) => void;
  canSubmitAssessment: boolean;
  onSubmit: () => void;
}

const AssessmentInstructionsView = ({
  assessmentTitle,
  codingChallenges,
  mcqQuizzes,
  completedSections,
  onNavigate,
  canSubmitAssessment,
  onSubmit
}: AssessmentInstructionsViewProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-success-light text-success';
      case 'Medium': return 'bg-warning-light text-black';
      case 'Hard': return 'bg-destructive-light text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="text-left mb-8">
        <h1 className="text-3xl font-heading font-bold mb-2">{assessmentTitle}</h1>
        <p className="text-muted-foreground">
          Complete all sections to submit your assessment. Read the instructions carefully before proceeding.
        </p>
      </div>

      <div className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-xl font-heading font-semibold">Proctoring Rules</h2>
          <ul className="space-y-2 text-muted-foreground">
            <li>• No copy-pasting is allowed during the assessment</li>
            <li>• Tab switching or window switching is not permitted</li>
            <li>• Assessment screen exit will result in violations</li>
            <li>• Maximum 3 violations are allowed before auto-submission</li>
          </ul>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-heading font-bold">Coding Challenges</h2>
          {codingChallenges.map((challenge, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">{challenge.title}</h3>
                  <div className="flex gap-2">
                    <Badge className={getDifficultyColor(challenge.difficulty)}>
                      {challenge.difficulty}
                    </Badge>
                    <Badge variant="outline">{challenge.marks} marks</Badge>
                  </div>
                </div>
                {completedSections.coding && (
                  <div className="flex items-center gap-2 mb-4">
                    <Check className="w-4 h-4 text-success" />
                    <span className="text-success font-medium">Submitted</span>
                  </div>
                )}
                <div className="flex justify-end">
                  <Button 
                    variant="link" 
                    className="text-primary p-0 h-auto"
                    onClick={() => onNavigate('coding', index)}
                  >
                    {completedSections.coding ? 'View Solution' : 'Solve Challenge'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-heading font-bold">MCQ Quizzes</h2>
          {mcqQuizzes.map((quiz, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">{quiz.title}</h3>
                  <div className="flex gap-2">
                    <Badge className={getDifficultyColor(quiz.difficulty)}>
                      {quiz.difficulty}
                    </Badge>
                    <Badge variant="outline">{quiz.marks} marks</Badge>
                  </div>
                </div>
                {completedSections.mcq && (
                  <div className="flex items-center gap-2 mb-4">
                    <Check className="w-4 h-4 text-success" />
                    <span className="text-success font-medium">Submitted</span>
                  </div>
                )}
                <div className="flex justify-end">
                  <Button 
                    variant="link" 
                    className="text-primary p-0 h-auto"
                    onClick={() => onNavigate('mcq', index)}
                  >
                    {completedSections.mcq ? 'View Answers' : 'Attempt Quiz'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-heading font-bold">Open Ended Questions</h2>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Programming Concepts</h3>
                <Badge variant="outline">2 questions</Badge>
              </div>
              {completedSections.openended && (
                <div className="flex items-center gap-2 mb-4">
                  <Check className="w-4 h-4 text-success" />
                  <span className="text-success font-medium">Submitted</span>
                </div>
              )}
              <div className="flex justify-end">
                <Button 
                  variant="link" 
                  className="text-primary p-0 h-auto"
                  onClick={() => onNavigate('openended')}
                >
                  {completedSections.openended ? 'View Answers' : 'Attempt Questions'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center pt-8">
          <Button 
            size="lg" 
            disabled={!canSubmitAssessment}
            onClick={onSubmit}
          >
            Submit Assessment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AssessmentInstructionsView;
