
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { List } from "lucide-react";

interface MobileSidebarProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  onItemSelect: (itemId: string) => void;
}

const MobileSidebar = ({ 
  isOpen, 
  onOpenChange, 
  children, 
  onItemSelect 
}: MobileSidebarProps) => {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 flex items-center justify-center">
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
    </div>
  );
};

export default MobileSidebar;
