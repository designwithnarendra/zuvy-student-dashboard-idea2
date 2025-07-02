
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { mockCourses } from "@/lib/mockData";
import Header from "@/components/Header";
import CourseInfoBanner from "@/components/CourseInfoBanner";
import ModuleCard from "@/components/ModuleCard";
import ProjectCard from "@/components/ProjectCard";
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

  // Create a combined array of modules and projects in the correct order
  const createCourseContent = () => {
    const content = [];
    
    // Add modules 1 and 2
    if (course.modules[0]) content.push({ type: 'module', data: course.modules[0] });
    if (course.modules[1]) content.push({ type: 'module', data: course.modules[1] });
    
    // Add first project after module 2
    if (course.projects[0]) content.push({ type: 'project', data: course.projects[0] });
    
    // Add remaining modules 3, 4, 5
    for (let i = 2; i < Math.min(5, course.modules.length); i++) {
      content.push({ type: 'module', data: course.modules[i] });
    }
    
    // Add second project after module 5 (if exists)
    if (course.projects[1]) content.push({ type: 'project', data: course.projects[1] });
    
    // Add any remaining modules if not showing all
    if (!showAllModules) {
      return content.slice(0, 7);
    }
    
    // Add remaining modules when showing all
    for (let i = 5; i < course.modules.length; i++) {
      content.push({ type: 'module', data: course.modules[i] });
    }
    
    return content;
  };

  const courseContent = createCourseContent();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="w-full">
        <div>
          <CourseInfoBanner course={course} />
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Course Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Course Content Section */}
              <div>
                <h2 className="text-2xl font-heading font-semibold mb-6">Course Content</h2>
                
                <div className="space-y-6">
                  {courseContent.map((item, index) => {
                    if (item.type === 'module') {
                      const module = item.data;
                      const moduleProgress = getModuleProgress(module.id);
                      const isCurrentModule = module.id === '2';
                      
                      return (
                        <ModuleCard
                          key={`module-${module.id}`}
                          module={module}
                          courseId={courseId!}
                          moduleProgress={moduleProgress}
                          isCurrentModule={isCurrentModule}
                          getModuleCTA={getModuleCTA}
                          getModuleDescription={getModuleDescription}
                          currentModuleNextItem={isCurrentModule ? course.currentModule.nextItem.name : undefined}
                        />
                      );
                    } else {
                      const project = item.data;
                      return (
                        <ProjectCard 
                          key={`project-${project.id}`} 
                          project={project}
                          isCurrentFocus={false}
                        />
                      );
                    }
                  })}
                  
                  {course.modules.length > 5 && !showAllModules && (
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
