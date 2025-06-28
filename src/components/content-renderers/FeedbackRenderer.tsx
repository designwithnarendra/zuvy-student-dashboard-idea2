
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";

interface FeedbackRendererProps {
  item: any;
}

const FeedbackRenderer = ({ item }: FeedbackRendererProps) => {
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackAnswers, setFeedbackAnswers] = useState({
    mcq: '',
    checkbox: [] as string[],
    text: '',
    date: null as Date | null,
    time: ''
  });

  const handleFeedbackSubmit = () => {
    setFeedbackSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-heading font-bold mb-2">{item.title}</h1>
      {feedbackSubmitted && (
        <div className="bg-success-light p-4 rounded-lg mb-6 text-success">
          Your feedback has been submitted successfully
        </div>
      )}
      <p className="text-muted-foreground mb-8">{item.description}</p>
      
      <div className="space-y-8">
        {/* MCQ Question */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">1. How would you rate the overall quality of this module?</h3>
          <RadioGroup
            value={feedbackAnswers.mcq}
            onValueChange={(value) => setFeedbackAnswers(prev => ({ ...prev, mcq: value }))}
            disabled={feedbackSubmitted}
            className="space-y-4"
          >
            {['Excellent', 'Good', 'Average', 'Poor'].map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`rating_${index}`} />
                <Label htmlFor={`rating_${index}`} className="cursor-pointer">{option}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Checkbox Question */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">2. Which topics were most helpful? (Select all that apply)</h3>
          <div className="space-y-4">
            {['DOM Manipulation', 'Event Handling', 'Interactive Elements', 'Performance Optimization'].map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox 
                  id={`topic_${index}`}
                  checked={feedbackAnswers.checkbox.includes(option)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setFeedbackAnswers(prev => ({ 
                        ...prev, 
                        checkbox: [...prev.checkbox, option] 
                      }));
                    } else {
                      setFeedbackAnswers(prev => ({ 
                        ...prev, 
                        checkbox: prev.checkbox.filter(item => item !== option) 
                      }));
                    }
                  }}
                  disabled={feedbackSubmitted}
                />
                <Label htmlFor={`topic_${index}`} className="cursor-pointer">{option}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Long Text Question */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">3. What suggestions do you have for improving this module?</h3>
          <Textarea
            value={feedbackAnswers.text}
            onChange={(e) => setFeedbackAnswers(prev => ({ ...prev, text: e.target.value }))}
            placeholder="Share your suggestions..."
            className="min-h-24"
            disabled={feedbackSubmitted}
          />
        </div>

        {/* Date Question */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">4. When did you start this module?</h3>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" disabled={feedbackSubmitted}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {feedbackAnswers.date ? feedbackAnswers.date.toLocaleDateString() : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={feedbackAnswers.date || undefined}
                onSelect={(date) => setFeedbackAnswers(prev => ({ ...prev, date: date || null }))}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Time Question */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">5. What time of day do you prefer studying?</h3>
          <Input
            type="time"
            value={feedbackAnswers.time}
            onChange={(e) => setFeedbackAnswers(prev => ({ ...prev, time: e.target.value }))}
            disabled={feedbackSubmitted}
            className="w-40 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:opacity-0"
          />
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <Button 
          onClick={handleFeedbackSubmit}
          disabled={feedbackSubmitted}
        >
          {feedbackSubmitted ? 'Submitted ✓' : 'Submit'}
        </Button>
      </div>
    </div>
  );
};

export default FeedbackRenderer;
