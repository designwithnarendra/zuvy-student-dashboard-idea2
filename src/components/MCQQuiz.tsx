import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { X, CheckCircle } from "lucide-react";

interface MCQQuizProps {
  quiz: {
    title: string;
    difficulty: string;
    marks: number;
  };
  onBack: () => void;
  onComplete: () => void;
  timeLeft: string;
  isViewMode?: boolean;
  quizId: string; // Added for unique identification
}

const MCQQuiz = ({ quiz, onBack, onComplete, timeLeft, isViewMode = false, quizId }: MCQQuizProps) => {
  const [answers, setAnswers] = useState<string[]>(new Array(5).fill(''));
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSubmittedView, setShowSubmittedView] = useState(false);

  const questions = [
    {
      question: "What is the correct way to declare a variable in JavaScript?",
      options: ["var x = 5;", "variable x = 5;", "v x = 5;", "declare x = 5;"],
      correct: 0
    },
    {
      question: "Which method is used to add an element to the end of an array?",
      options: ["append()", "push()", "add()", "insert()"],
      correct: 1
    },
    {
      question: "What does DOM stand for?",
      options: ["Document Object Model", "Data Object Management", "Dynamic Object Method", "Document Oriented Markup"],
      correct: 0
    },
    {
      question: "Which of the following is NOT a JavaScript data type?",
      options: ["String", "Boolean", "Integer", "Undefined"],
      correct: 2
    },
    {
      question: "How do you select an element by ID in JavaScript?",
      options: ["document.getElement('id')", "document.getElementById('id')", "document.selectId('id')", "document.findById('id')"],
      correct: 1
    }
  ];

  // Check for existing submission on component mount
  useEffect(() => {
    const submissionData = sessionStorage.getItem(`mcq-quiz-${quizId}`);
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
  }, [quizId, isViewMode]);

  const handleAnswerChange = (questionIndex: number, value: string) => {
    if (!isSubmitted) {
      const newAnswers = [...answers];
      newAnswers[questionIndex] = value;
      setAnswers(newAnswers);
    }
  };

  const calculateScore = () => {
    let correctCount = 0;
    questions.forEach((q, index) => {
      if (parseInt(answers[index]) === q.correct) {
        correctCount++;
      }
    });
    return { correct: correctCount, total: questions.length };
  };

  const handleSubmit = () => {
    if (!window.confirm('Are you sure you want to submit your quiz? You cannot change your answers after submission.')) {
      return;
    }
    
    setIsSubmitted(true);
    setShowSubmittedView(true);
    
    // Store submission in sessionStorage for persistence
    sessionStorage.setItem(`mcq-quiz-${quizId}`, JSON.stringify({
      answers,
      submissionTime: new Date().toISOString(),
      score: calculateScore()
    }));
    
    // Mark as completed when submitted
    onComplete();
  };

  const allAnswered = answers.every(answer => answer !== '');
  const score = calculateScore();

  return (
    <div className="min-h-screen bg-background">
      <header className="w-full flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <X className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-heading font-semibold">{quiz.title}</h1>
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
                <p className="font-semibold text-success">Quiz Submitted Successfully</p>
              </div>
              <p className="text-sm text-success mb-2">
                Your Score: {score.correct}/{score.total} ({Math.round((score.correct / score.total) * 100)}%)
              </p>
              <p className="text-sm text-success">
                Submitted on: {new Date(JSON.parse(sessionStorage.getItem(`mcq-quiz-${quizId}`) || '{}').submissionTime || new Date()).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        )}

        <div className="space-y-8">
          {questions.map((q, index) => (
            <div key={index} className="space-y-4">
              <h3 className="text-lg font-semibold">
                {index + 1}. {q.question}
              </h3>
              <RadioGroup
                value={answers[index]}
                onValueChange={(value) => handleAnswerChange(index, value)}
                disabled={isSubmitted}
                className="space-y-4"
              >
                {q.options.map((option, optionIndex) => {
                  const isSelected = parseInt(answers[index]) === optionIndex;
                  const isCorrect = optionIndex === q.correct;
                  const isWrong = isSubmitted && isSelected && !isCorrect;
                  const showCorrect = isSubmitted && isCorrect;
                  
                  return (
                    <div key={optionIndex} className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value={optionIndex.toString()} 
                        id={`q${index}_option${optionIndex}`}
                        className={
                          isSubmitted ? (
                            showCorrect ? "border-success text-success" : 
                            isWrong ? "border-destructive text-destructive" : ""
                          ) : ""
                        }
                      />
                      <Label 
                        htmlFor={`q${index}_option${optionIndex}`} 
                        className={`cursor-pointer ${
                          isSubmitted ? (
                            showCorrect ? "text-success font-medium" : 
                            isWrong ? "text-destructive font-medium" : ""
                          ) : ""
                        }`}
                      >
                        {option}
                      </Label>
                    </div>
                  );
                })}
                {isSubmitted && parseInt(answers[index]) !== q.correct && (
                  <p className="text-sm text-success mt-2 font-medium">
                    Correct Answer: {q.options[q.correct]}
                  </p>
                )}
              </RadioGroup>
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
              Submit Quiz
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MCQQuiz;
