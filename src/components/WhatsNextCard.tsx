
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Video, BookOpen, FileText, Clock } from "lucide-react";

interface UpcomingItem {
  id: string;
  title: string;
  type: 'class' | 'assessment' | 'assignment';
  dateTime: Date;
  canStart: boolean;
  actionText: string;
}

interface WhatsNextCardProps {
  upcomingItems: UpcomingItem[];
}

const WhatsNextCard = ({ upcomingItems }: WhatsNextCardProps) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  const formatDateRange = () => {
    const today = new Date();
    const seventhDay = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    const formatOptions: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric'
    };
    
    return `From ${today.toLocaleDateString('en-US', formatOptions)} to ${seventhDay.toLocaleDateString('en-US', formatOptions)}`;
  };

  const getItemIconWithBackground = (type: string) => {
    switch (type) {
      case 'class':
        return (
          <div className="w-10 h-10 rounded-full bg-secondary-light flex items-center justify-center">
            <Video className="w-5 h-5 text-secondary" />
          </div>
        );
      case 'assessment':
        return (
          <div className="w-10 h-10 rounded-full bg-warning-light flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-warning" />
          </div>
        );
      case 'assignment':
        return (
          <div className="w-10 h-10 rounded-full bg-info-light flex items-center justify-center">
            <FileText className="w-5 h-5 text-info" />
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 rounded-full bg-muted-light flex items-center justify-center">
            <Clock className="w-5 h-5 text-muted-foreground" />
          </div>
        );
    }
  };

  const getTimeRemaining = (dateTime: Date) => {
    const now = new Date();
    const timeDiff = dateTime.getTime() - now.getTime();
    
    if (timeDiff <= 0) return "Time passed";
    
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `Starts in ${days} day${days > 1 ? 's' : ''}`;
    if (hours > 0) return `Starts in ${hours} hour${hours > 1 ? 's' : ''}`;
    if (minutes > 0) return `Starts in ${minutes} minute${minutes > 1 ? 's' : ''}`;
    
    return "Starting soon";
  };

  return (
    <Card className="shadow-4dp">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl">What's Next?</CardTitle>
        <p className="text-sm text-muted-foreground">
          {formatDateRange()}
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        {upcomingItems.length > 0 ? (
          <div className="space-y-4">
            {upcomingItems.map((item, index) => (
              <div key={item.id}>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {getItemIconWithBackground(item.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h4 className="font-medium text-base">{item.title}</h4>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-medium">
                        {item.type === 'class' && `Scheduled on ${formatDate(item.dateTime)}`}
                        {item.type === 'assessment' && `Starts on ${formatDate(item.dateTime)}`}
                        {item.type === 'assignment' && `Due on ${formatDate(item.dateTime)}`}
                      </p>
                    </div>
                    {/* CTA - Bottom right */}
                    <div className="flex justify-end">
                      <Button 
                        size="sm" 
                        variant="link"
                        disabled={!item.canStart}
                        className="text-primary p-0 h-auto"
                      >
                        {item.canStart ? item.actionText : getTimeRemaining(item.dateTime)}
                      </Button>
                    </div>
                  </div>
                </div>
                {index < upcomingItems.length - 1 && (
                  <div className="border-t border-border mt-4"></div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No upcoming items</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WhatsNextCard;
