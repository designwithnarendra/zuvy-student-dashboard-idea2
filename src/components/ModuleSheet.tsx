
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { BookOpen, ChevronDown, ChevronRight } from "lucide-react";
import { Module, Topic } from "@/lib/mockData";

interface ModuleSheetProps {
  modules: Module[];
  selectedModule: string;
  selectedTopic: string;
  onTopicSelect: (moduleId: string, topicId: string) => void;
  courseName: string;
}

const ModuleSheet = ({
  modules,
  selectedModule,
  selectedTopic,
  onTopicSelect,
  courseName,
}: ModuleSheetProps) => {
  const [expandedModules, setExpandedModules] = useState<string[]>([selectedModule]);
  const [isOpen, setIsOpen] = useState(false);

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const handleTopicSelect = (moduleId: string, topicId: string) => {
    onTopicSelect(moduleId, topicId);
    setIsOpen(false); // Close the sheet
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button className="w-full">
          <BookOpen className="w-4 h-4 mr-2" />
          Course Modules
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[80vh]">
        <SheetHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="text-left">
            <SheetTitle className="text-lg">Course Curriculum</SheetTitle>
            <p className="text-sm text-muted-foreground mt-1">{courseName}</p>
          </div>
        </SheetHeader>
        <Separator className="mb-4" />
        
        <ScrollArea className="h-[calc(80vh-120px)]">
          <div className="space-y-4">
            {modules.map((module: Module) => (
              <div key={module.id} className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-between text-left h-auto p-3 hover:bg-primary-light hover:text-charcoal"
                  onClick={() => toggleModule(module.id)}
                >
                  <div className="flex-1 min-w-0 pr-3">
                    <div className="font-bold text-sm break-words leading-relaxed">
                      Module {module.id}: {module.name}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {module.topics.length} topics
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {expandedModules.includes(module.id) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </div>
                </Button>
                
                {expandedModules.includes(module.id) && (
                  <div className="ml-4 space-y-1">
                    {module.topics.map((topic: Topic) => (
                      <SheetClose asChild key={topic.id}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`w-full justify-start text-left text-sm break-words leading-relaxed p-2 ${
                            selectedModule === module.id && selectedTopic === topic.id 
                              ? "bg-primary-light border-l-4 border-primary text-charcoal" 
                              : "hover:bg-primary-light hover:text-charcoal"
                          }`}
                          onClick={() => handleTopicSelect(module.id, topic.id)}
                        >
                          <span className="break-words">{topic.name}</span>
                        </Button>
                      </SheetClose>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default ModuleSheet;
