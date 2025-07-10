
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { Module } from "@/lib/mockData";

interface ModuleCardProps {
  module: Module;
  courseId: string;
  moduleProgress: number;
  isCurrentModule: boolean;
  getModuleCTA: (moduleId: string, progress: number) => string;
  getModuleDescription: (moduleId: string) => string;
  currentModuleNextItem?: string;
}

const ModuleCard = ({
  module,
  courseId,
  moduleProgress,
  isCurrentModule,
  getModuleCTA,
  getModuleDescription,
  currentModuleNextItem,
}: ModuleCardProps) => {
  const isCompleted = moduleProgress === 100;
  const isLocked = module.isLocked || false;

  return (
    <Card className={`shadow-4dp ${isCurrentModule ? 'border-2 border-primary' : ''}`}>
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
          <div className="flex-1">
            {isLocked && (
              <Badge className="mb-2 bg-muted-light text-muted-foreground border-muted-foreground/20">
                <Lock className="w-3 h-3 mr-1" />
                Locked
              </Badge>
            )}
            {!isLocked && isCurrentModule && (
              <Badge className="mb-2 bg-primary-light text-primary border-primary/20 pointer-events-none">Current Module</Badge>
            )}
            {!isLocked && isCompleted && (
              <Badge className="mb-2 bg-success-light text-success border-success/20 pointer-events-none">Completed</Badge>
            )}
            <h3 className="text-xl font-heading font-semibold mb-2">
              Module {module.id}: {module.name}
            </h3>
            <p className="text-muted-foreground mb-3 text-sm">
              {getModuleDescription(module.id)}
            </p>
            {isLocked && module.lockReason && (
              <p className="text-sm text-muted-foreground mb-3">
                {module.lockReason}
              </p>
            )}
            {!isLocked && isCurrentModule && currentModuleNextItem && (
              <p className="text-sm text-muted-foreground mb-3">
                Continue with: {currentModuleNextItem}
              </p>
            )}
          </div>

          {/* Action Button - Desktop: top right, Mobile: bottom */}
          <div className="hidden lg:flex flex-shrink-0 items-center">
            {isLocked ? (
              <div className="flex items-center gap-2 px-6 py-2 text-muted-foreground">
                <Lock className="w-4 h-4" />
                <span className="text-sm font-medium">Locked</span>
              </div>
            ) : isCurrentModule ? (
              <Button className="px-6" asChild>
                <Link to={`/course/${courseId}/module/${module.id}`}>
                  {getModuleCTA(module.id, moduleProgress)}
                </Link>
              </Button>
            ) : (
              <Button variant="link" className="px-6 text-primary" asChild>
                <Link to={`/course/${courseId}/module/${module.id}`}>
                  {getModuleCTA(module.id, moduleProgress)}
                </Link>
              </Button>
            )}
          </div>
        </div>
        
        {/* Module Progress */}
        {!isLocked && (
          <div className="mb-4 lg:mb-0">
            <div className="relative bg-primary-light rounded-full h-2 w-full">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300 relative"
                style={{ width: `${moduleProgress}%` }}
              >
                <div 
                  className="absolute top-1/2 transform -translate-y-1/2 progress-label-bg progress-label px-2 py-0.5 rounded shadow-sm border text-xs font-medium whitespace-nowrap"
                  style={{ 
                    right: moduleProgress === 100 ? '0' : moduleProgress === 0 ? 'auto' : '-12px',
                    left: moduleProgress === 0 ? '0' : 'auto'
                  }}
                >
                  {moduleProgress}%
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Button - Mobile: bottom */}
        <div className="lg:hidden mt-4">
          {isLocked ? (
            <div className="flex items-center justify-center gap-2 w-full py-2 text-muted-foreground">
              <Lock className="w-4 h-4" />
              <span className="text-sm font-medium">Locked</span>
            </div>
          ) : isCurrentModule ? (
            <Button className="w-full" asChild>
              <Link to={`/course/${courseId}/module/${module.id}`}>
                {getModuleCTA(module.id, moduleProgress)}
              </Link>
            </Button>
          ) : (
            <Button variant="link" className="w-full text-primary" asChild>
              <Link to={`/course/${courseId}/module/${module.id}`}>
                {getModuleCTA(module.id, moduleProgress)}
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ModuleCard;
