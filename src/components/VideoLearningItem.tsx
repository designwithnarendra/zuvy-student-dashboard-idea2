
import { Badge } from "@/components/ui/badge";
import { Play } from "lucide-react";

interface VideoLearningItemProps {
  item: {
    title: string;
    status: string;
    duration?: string;
  };
}

const VideoLearningItem = ({ item }: VideoLearningItemProps) => {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-heading font-bold">{item.title}</h1>
        <Badge variant="outline" className={item.status === 'completed' ? "text-success border-success" : "text-muted-foreground"}>
          {item.status === 'completed' ? 'Watched' : 'Not Watched'}
        </Badge>
      </div>
      <p className="text-muted-foreground mb-6">Duration: {item.duration || '20 mins'}</p>
      <div className="bg-black rounded-lg aspect-video flex items-center justify-center">
        <div className="text-center text-white">
          <Play className="w-16 h-16 mx-auto mb-4" />
          <p>Video Content</p>
          <p className="text-sm opacity-75">{item.duration || '20 mins'}</p>
        </div>
      </div>
    </div>
  );
};

export default VideoLearningItem;
