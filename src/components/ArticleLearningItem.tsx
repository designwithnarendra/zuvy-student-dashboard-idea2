
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ArticleLearningItemProps {
  item: {
    title: string;
    status: string;
  };
}

const ArticleLearningItem = ({ item }: ArticleLearningItemProps) => {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-heading font-bold">{item.title}</h1>
        <Badge variant="outline" className={item.status === 'completed' ? "text-success border-success" : "text-muted-foreground"}>
          {item.status === 'completed' ? 'Read' : 'To be Read'}
        </Badge>
      </div>
      <p className="text-muted-foreground mb-6">Approximate read time: 5 mins</p>
      <div className="prose max-w-none mb-8">
        <p>This is a sample article content. In a real implementation, this would contain the actual article text with proper formatting, images, and other content elements.</p>
        <p>The article content would be comprehensive and educational, providing valuable insights and knowledge to the student.</p>
      </div>
      {item.status !== 'completed' && (
        <div className="flex justify-center">
          <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            Mark as Read
          </Button>
        </div>
      )}
    </div>
  );
};

export default ArticleLearningItem;
