
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { mockCourses } from "@/lib/mockData";
import Header from "@/components/Header";
import CourseInfoBanner from "@/components/CourseInfoBanner";
import ModuleCard from "@/components/ModuleCard";
import WhatsNextCard from "@/components/WhatsNextCard";
import AttendanceCard from "@/components/AttendanceCard";

const CourseDashboard = () => {
  const { courseId } = useParams();
  const course = mockCourses.find(c => c.id === courseId);
  const [showAllModules, setShowAllModules] = useState(false);

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-heading font-bold mb-2">Course Not Found</h1>
          <p className="text-muted-foreground mb-4">The course you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  const getModuleCTA = (moduleId: string, progress: number) => {
    if (moduleId === course.currentModule.id) {
      return "Continue Learning";
    } else if (progress === 0) {
      return "Start Learning";
    } else if (progress === 100) {
      return "Revise Module";
    } else {
      return "Continue Learning";
    }
  };

  const getModuleProgress = (moduleId: string) => {
    const progressMap: { [key: string]: number } = {
      '1': 100,
      '2': 65,
      '3': 0,
      '4': 0,
    };
    return progressMap[moduleId] || 0;
  };

  const getModuleDescription = (moduleId: string) => {
    const descriptionMap: { [key: string]: string } = {
      '1': 'Learn the fundamentals of JavaScript programming language and build a strong foundation.',
      '2': 'Master DOM manipulation and event handling for interactive web applications.',
      '3': 'Understand asynchronous programming, promises, and API integration.',
      '4': 'Build server-side applications with Node.js and Express framework.',
      '5': 'Connect frontend and backend to create full-stack applications.',
    };
    return descriptionMap[moduleId] || "Learn essential concepts and build practical skills.";
  };

  const modulesToShow = showAllModules ? course.modules : course.modules.slice(0, 7);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="w-full">
        <CourseInfoBanner course={course} />

        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Course Modules */}
            <div className="lg:col-span-2 space-y-8">
              {/* Course Modules Section */}
              <div>
                <h2 className="text-2xl font-heading font-semibold mb-6">Course Modules</h2>
                
                <div className="space-y-4">
                  {modulesToShow.map((module) => {
                    const moduleProgress = getModuleProgress(module.id);
                    const isCurrentModule = module.id === '2';
                    
                    return (
                      <ModuleCard
                        key={module.id}
                        module={module}
                        courseId={courseId!}
                        moduleProgress={moduleProgress}
                        isCurrentModule={isCurrentModule}
                        getModuleCTA={getModuleCTA}
                        getModuleDescription={getModuleDescription}
                        currentModuleNextItem={isCurrentModule ? course.currentModule.nextItem.name : undefined}
                      />
                    );
                  })}
                  
                  {course.modules.length > 7 && !showAllModules && (
                    <div className="flex justify-center">
                      <Button 
                        variant="link" 
                        onClick={() => setShowAllModules(true)}
                        className="text-primary"
                      >
                        Show More Modules
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - What's Next & Attendance */}
            <div className="space-y-8">
              <WhatsNextCard upcomingItems={course.upcomingItems} />
              <AttendanceCard attendanceStats={course.attendanceStats} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDashboard;
