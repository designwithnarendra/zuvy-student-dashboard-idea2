import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { X, CheckCircle } from "lucide-react";

interface OpenEndedQuestionsProps {
  onBack: () => void;
  onComplete: () => void;
  timeLeft: string;
  isViewMode?: boolean;
  questionsId: string; // Added for unique identification
}

const OpenEndedQuestions = ({ onBack, onComplete, timeLeft, isViewMode = false, questionsId }: OpenEndedQuestionsProps) => {
  const [answers, setAnswers] = useState(['', '']);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSubmittedView, setShowSubmittedView] = useState(false);

  const questions = [
    {
      question: "Explain the concept of event bubbling in JavaScript and provide an example of how you would prevent it.",
      placeholder: "Describe event bubbling and how to prevent it..."
    },
    {
      question: "What are the differences between var, let, and const in JavaScript? When would you use each one?",
      placeholder: "Explain the differences and use cases..."
    }
  ];

  // Check for existing submission on component mount
  useEffect(() => {
    const submissionData = sessionStorage.getItem(`open-ended-${questionsId}`);
    if (submissionData) {
      const parsed = JSON.parse(submissionData);
      setAnswers(parsed.answers);
      setIsSubmitted(true);
      setShowSubmittedView(true);
    } else if (isViewMode) {
      // If in view mode but no submission, set submitted state based on completion
      setIsSubmitted(true);
      setShowSubmittedView(false);
    }
  }, [questionsId, isViewMode]);

  const handleAnswerChange = (index: number, value: string) => {
    if (!isSubmitted) {
      const newAnswers = [...answers];
      newAnswers[index] = value;
      setAnswers(newAnswers);
    }
  };

  const handleSubmit = () => {
    if (!window.confirm('Are you sure you want to submit your answers? You cannot change them after submission.')) {
      return;
    }
    
    setIsSubmitted(true);
    setShowSubmittedView(true);
    
    // Store submission in sessionStorage for persistence
    sessionStorage.setItem(`open-ended-${questionsId}`, JSON.stringify({
      answers,
      submissionTime: new Date().toISOString()
    }));
    
    // Mark as completed when submitted
    onComplete();
  };

  const allAnswered = answers.every(answer => answer.trim().length > 0);

  return (
    <div className="min-h-screen bg-background">
      <header className="w-full flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <X className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-heading font-semibold">Open Ended Questions</h1>
        </div>
        <div className="font-mono text-lg font-semibold">
          {isSubmitted ? 'Submitted' : timeLeft}
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-8">
        {showSubmittedView && (
          <Card className="mb-6 bg-success-light border-success">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-success" />
                <p className="font-semibold text-success">Answers Submitted Successfully</p>
              </div>
              <p className="text-sm text-success">
                Your answers have been recorded and will be reviewed by the instructor.
              </p>
              <p className="text-sm text-success">
                Submitted on: {new Date(JSON.parse(sessionStorage.getItem(`open-ended-${questionsId}`) || '{}').submissionTime || new Date()).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        )}

        <div className="space-y-8">
          {questions.map((q, index) => (
            <div key={index} className="space-y-4">
              <h3 className="text-lg font-semibold">
                Question {index + 1}
              </h3>
              <p className="text-muted-foreground">{q.question}</p>
              {isSubmitted ? (
                <div className="min-h-32 p-3 border rounded bg-muted/50">
                  <p className="text-sm whitespace-pre-wrap">{answers[index]}</p>
                </div>
              ) : (
                <Textarea
                  value={answers[index]}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  placeholder={q.placeholder}
                  className="min-h-32"
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          {!isSubmitted && (
            <Button 
              size="lg"
              onClick={handleSubmit}
              disabled={!allAnswered}
            >
              Submit Answers
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OpenEndedQuestions;
