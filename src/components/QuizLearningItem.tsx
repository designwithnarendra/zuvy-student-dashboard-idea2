
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface QuizLearningItemProps {
  item: {
    title: string;
    status: string;
  };
}

const QuizLearningItem = ({ item }: QuizLearningItemProps) => {
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<string[]>(new Array(5).fill(''));

  const questions = [
    {
      question: "What does DOM stand for?",
      options: ["Document Object Model", "Data Object Management", "Dynamic Object Method", "Document Oriented Markup"],
      correct: 0
    },
    {
      question: "Which method is used to select an element by ID?",
      options: ["document.getElement()", "document.getElementById()", "document.selectId()", "document.findById()"],
      correct: 1
    },
    {
      question: "How do you add an event listener to an element?",
      options: ["element.addListener()", "element.addEventListener()", "element.on()", "element.bind()"],
      correct: 1
    },
    {
      question: "Which property is used to change the text content of an element?",
      options: ["innerHTML", "textContent", "innerText", "Both B and C"],
      correct: 3
    },
    {
      question: "What is the correct way to create a new HTML element?",
      options: ["document.new()", "document.createElement()", "document.create()", "document.newElement()"],
      correct: 1
    }
  ];

  const handleQuizSubmit = () => {
    if (quizAnswers.every(answer => answer !== '')) {
      setQuizSubmitted(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-heading font-bold">{item.title}</h1>
        <Badge variant="outline" className={item.status === 'completed' ? "text-success border-success" : "text-muted-foreground"}>
          {item.status === 'completed' ? 'Completed' : 'Not Completed'}
        </Badge>
      </div>
      
      <div className="space-y-6">
        {questions.map((q, index) => (
          <div key={index} className="space-y-3">
            <h3 className="text-lg font-semibold">
              {index + 1}. {q.question}
            </h3>
            <RadioGroup
              value={quizAnswers[index]}
              onValueChange={(value) => {
                const newAnswers = [...quizAnswers];
                newAnswers[index] = value;
                setQuizAnswers(newAnswers);
              }}
              disabled={quizSubmitted}
              className="space-y-4"
            >
              {q.options.map((option, optionIndex) => {
                const isSelected = parseInt(quizAnswers[index]) === optionIndex;
                const isCorrect = optionIndex === q.correct;
                const isWrong = quizSubmitted && isSelected && !isCorrect;
                const shouldHighlightCorrect = quizSubmitted && isCorrect;
                
                return (
                  <div key={optionIndex} className="flex items-center space-x-2" style={{ padding: '16px 0' }}>
                    <RadioGroupItem 
                      value={optionIndex.toString()} 
                      id={`q${index}_option${optionIndex}`}
                      className={shouldHighlightCorrect ? "border-success" : isWrong ? "border-destructive" : ""}
                    />
                    <Label 
                      htmlFor={`q${index}_option${optionIndex}`} 
                      className={`cursor-pointer ${
                        shouldHighlightCorrect ? "text-success font-medium" : 
                        isWrong ? "text-destructive font-medium" : ""
                      }`}
                    >
                      {option}
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <Button 
          onClick={handleQuizSubmit}
          disabled={!quizAnswers.every(answer => answer !== '') || quizSubmitted}
          className={quizSubmitted ? "bg-success hover:bg-success" : ""}
        >
          {quizSubmitted ? 'Submitted ✓' : 'Submit'}
        </Button>
      </div>
    </div>
  );
};

export default QuizLearningItem;
