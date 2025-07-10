
import { useParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, BookOpen, FileText, Clock, Users, ArrowLeft, Lock } from "lucide-react";
import { mockCourses } from "@/lib/mockData";
import Header from "@/components/Header";
import CourseInfoBanner from "@/components/CourseInfoBanner";

const CourseSyllabusPage = () => {
  const { courseId } = useParams();
  const course = mockCourses.find(c => c.id === courseId);

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-sans font-bold mb-2">Course Not Found</h1>
          <Button asChild>
            <Link to="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'live-class':
        return <Video className="w-4 h-4 text-primary" />;
      case 'video':
        return <Video className="w-4 h-4 text-primary" />;
      case 'article':
        return <FileText className="w-4 h-4 text-accent" />;
      case 'assignment':
        return <FileText className="w-4 h-4 text-secondary" />;
      case 'assessment':
        return <BookOpen className="w-4 h-4 text-warning" />;
      case 'quiz':
        return <BookOpen className="w-4 h-4 text-warning" />;
      case 'feedback':
        return <FileText className="w-4 h-4 text-info" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Button variant="link" className="p-0 h-auto text-primary hover:text-primary hover:underline" asChild>
            <Link to={`/course/${courseId}`} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Course Dashboard</span>
            </Link>
          </Button>
        </div>

        {/* Course Information */}
        <div className="mb-8">
          <CourseInfoBanner course={course} />
        </div>

        {/* Course Modules */}
        <div>
          <h2 className="text-2xl font-heading font-bold mb-6">Course Syllabus</h2>
          <div className="space-y-6">
            {course.modules.map((module, moduleIndex) => (
              <Card key={module.id} className="shadow-4dp">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-heading font-bold mb-2">
                        Module {module.id}: {module.name}
                      </h3>
                      <p className="text-base text-muted-foreground">
                        {getModuleDescription(module.id)}
                      </p>
                    </div>
                    {module.isLocked && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Lock className="w-4 h-4" />
                        <span className="text-sm font-medium">Locked</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    {module.topics.map((topic, topicIndex) => (
                      <div key={topic.id} className="border-l-2 border-border pl-4">
                        <h4 className="text-lg font-bold mb-3">{topic.name}</h4>
                        <div className="mb-2">
                          {topic.items.map((item, itemIndex) => {
                            const isClickable = !module.isLocked;
                            const itemContent = (
                              <>
                                <div className="flex-shrink-0">
                                  {getItemIcon(item.type)}
                                </div>
                                <span className="text-sm flex-1 font-medium">
                                  {item.type === 'live-class' ? `Live Class: ${item.title}` :
                                   item.type === 'video' ? `Video: ${item.title}` :
                                   item.type === 'article' ? `Article: ${item.title}` :
                                   item.type === 'assignment' ? `Assignment: ${item.title}` :
                                   item.type === 'assessment' ? `Assessment: ${item.title}` :
                                   item.type === 'feedback' ? `Feedback Form: ${item.title}` :
                                   item.title}
                                </span>
                                {item.duration && (
                                  <span className="text-xs text-muted-foreground font-medium">
                                    {item.duration}
                                  </span>
                                )}
                              </>
                            );

                            return (
                              <div key={item.id} className="flex items-center gap-3">
                                {isClickable ? (
                                  <Link 
                                    to={`/course/${courseId}/module/${module.id}?item=${item.id}`}
                                    className="flex items-center gap-3 flex-1 hover:text-primary -mx-3 px-3 py-2 transition-colors"
                                  >
                                    {itemContent}
                                  </Link>
                                ) : (
                                  <div className="flex items-center gap-3 flex-1 opacity-60 cursor-not-allowed">
                                    {itemContent}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseSyllabusPage;
