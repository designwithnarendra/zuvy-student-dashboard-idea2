import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Video, BookOpen, FileText, Clock } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

interface UpcomingItem {
  id: string;
  title: string;
  type: 'class' | 'assessment' | 'assignment';
  dateTime: Date;
  canStart: boolean;
  actionText: string;
}

interface ViewAllUpcomingModalProps {
  isOpen: boolean;
  onClose: () => void;
  upcomingItems: UpcomingItem[];
}

const ViewAllUpcomingModal = ({ isOpen, onClose, upcomingItems }: ViewAllUpcomingModalProps) => {
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle>All Upcoming Items</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] scrollbar-hide">
          <div className="space-y-4 p-1">
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
                        {item.type === 'class' && `Scheduled on ${formatDateTime(item.dateTime)}`}
                        {item.type === 'assessment' && `Starts on ${formatDateTime(item.dateTime)}`}
                        {item.type === 'assignment' && `Due on ${formatDateTime(item.dateTime)}`}
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
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ViewAllUpcomingModal; 