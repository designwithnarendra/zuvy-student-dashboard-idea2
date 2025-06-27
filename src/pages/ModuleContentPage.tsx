
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { mockCourses } from "@/lib/mockData";
import Header from "@/components/Header";
import ModuleSidebar from "@/components/ModuleSidebar";
import ModuleContentRenderer from "@/components/ModuleContentRenderer";
import ModuleNavigation from "@/components/ModuleNavigation";
import MobileSidebar from "@/components/MobileSidebar";
import { enhanceModule } from "@/utils/moduleEnhancer";
import { getAssessmentData } from "@/utils/assessmentData";
import { useModuleNavigation } from "@/hooks/useModuleNavigation";

const ModuleContentPage = () => {
  const { courseId, moduleId } = useParams();
  const course = mockCourses.find(c => c.id === courseId);
  const [selectedItem, setSelectedItem] = useState<string>("");
  const [isMobile, setIsMobile] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (course && moduleId) {
      const module = course.modules.find(m => m.id === moduleId);
      if (module && module.topics.length > 0) {
        if (module.topics[0].items.length > 0) {
          setSelectedItem(module.topics[0].items[0].id);
        }
      }
    }
  }, [course, moduleId]);

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-heading font-bold mb-2">Course Not Found</h1>
          <Button asChild>
            <Link to="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  const currentModule = course.modules.find(m => m.id === moduleId);
  
  if (!currentModule) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-heading font-bold mb-2">Module Not Found</h1>
          <Button asChild>
            <Link to={`/course/${courseId}`}>Back to Course</Link>
          </Button>
        </div>
      </div>
    );
  }

  const enhancedModule = enhanceModule(currentModule, moduleId!);
  const { getSelectedItem, prevItem, nextItem } = useModuleNavigation(enhancedModule, selectedItem);
  const selectedItemData = getSelectedItem();

  const handleItemSelect = (itemId: string) => {
    setSelectedItem(itemId);
    if (isMobile) {
      setIsSheetOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {isMobile && (
        <div className="lg:hidden px-4 py-4 border-b border-border">
          <h2 className="text-lg font-heading font-semibold">Module {moduleId}: {enhancedModule.name}</h2>
        </div>
      )}

      <div className="flex h-[calc(100vh-80px)] lg:h-[calc(100vh-80px)]">
        {!isMobile && (
          <ModuleSidebar
            courseId={courseId!}
            moduleId={moduleId!}
            module={enhancedModule}
            selectedItem={selectedItem}
            onItemSelect={handleItemSelect}
          />
        )}

        <div className={`flex-1 ${!isMobile ? 'ml-80' : ''} overflow-y-auto flex flex-col`}>
          <div className="flex-1">
            <ModuleContentRenderer
              selectedItemData={selectedItemData}
              getAssessmentData={getAssessmentData}
            />
          </div>
          
          <ModuleNavigation
            prevItem={prevItem}
            nextItem={nextItem}
            onItemSelect={handleItemSelect}
          />
        </div>
      </div>

      {isMobile && (
        <MobileSidebar
          isOpen={isSheetOpen}
          onOpenChange={setIsSheetOpen}
          prevItem={prevItem}
          nextItem={nextItem}
          onItemSelect={handleItemSelect}
        >
          <ModuleSidebar
            courseId={courseId!}
            moduleId={moduleId!}
            module={enhancedModule}
            selectedItem={selectedItem}
            onItemSelect={handleItemSelect}
          />
        </MobileSidebar>
      )}
    </div>
  );
};

export default ModuleContentPage;
