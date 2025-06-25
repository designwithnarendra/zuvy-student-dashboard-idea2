
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { List } from "lucide-react";
import { Module, TopicItem } from "@/lib/mockData";

interface MobileSidebarProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  prevItem: { item: TopicItem; topicId: string } | null;
  nextItem: { item: TopicItem; topicId: string } | null;
  onItemSelect: (itemId: string) => void;
}

const MobileSidebar = ({ 
  isOpen, 
  onOpenChange, 
  children, 
  prevItem, 
  nextItem, 
  onItemSelect 
}: MobileSidebarProps) => {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 flex items-center justify-between">
      <Button
        variant="link"
        className="text-charcoal p-0 h-auto"
        disabled={!prevItem}
        onClick={() => prevItem && onItemSelect(prevItem.item.id)}
      >
        Back
      </Button>
      
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetTrigger asChild>
          <Button variant="outline" className="border-primary text-primary">
            <List className="w-4 h-4 mr-2" />
            Module Content
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[80vh]">
          <SheetHeader>
            <SheetTitle>Module Content</SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            {children}
          </div>
        </SheetContent>
      </Sheet>
      
      <Button
        variant="link"
        className="text-primary p-0 h-auto"
        disabled={!nextItem}
        onClick={() => nextItem && onItemSelect(nextItem.item.id)}
      >
        Next
      </Button>
    </div>
  );
};

export default MobileSidebar;
