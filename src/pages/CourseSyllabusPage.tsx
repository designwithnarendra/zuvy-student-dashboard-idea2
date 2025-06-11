
import { useParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Video, BookOpen, FileText, Clock, Users } from "lucide-react";
import { mockCourses } from "@/lib/mockData";
import Header from "@/components/Header";

const CourseSyllabusPage = () => {
  const { courseId } = useParams();
  const course = mockCourses.find(c => c.id === courseId);

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
        {/* Course Information */}
        <Card className="mb-8 shadow-4dp">
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-start gap-6 mb-6">
              <div className="flex-shrink-0">
                <img
                  src={course.image}
                  alt={course.name}
                  className="w-full md:w-32 h-32 rounded-lg object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <h1 className="text-2xl md:text-3xl font-heading font-bold mb-2">{course.name}</h1>
                    <p className="text-base md:text-lg text-muted-foreground mb-4">{course.description}</p>
                    <div className="flex items-center gap-2 mb-4">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={course.instructor.avatar} />
                        <AvatarFallback>{course.instructor.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{course.instructor.name}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-muted-foreground">In Collaboration With</p>
                    <img
                      src="/lovable-uploads/09118b9e-00df-4356-a333-707d5733862f.png"
                      alt="AFE Brand"
                      className="h-12"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Course Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Batch</p>
                  <p className="font-medium">{course.batchName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-medium">{course.duration}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Students</p>
                  <p className="font-medium">{course.studentsEnrolled} enrolled</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Course Modules */}
        <div>
          <h2 className="text-2xl font-heading font-semibold mb-6">Course Syllabus</h2>
          <div className="space-y-6">
            {course.modules.map((module, moduleIndex) => (
              <Card key={module.id} className="shadow-4dp">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-heading font-semibold mb-2">
                      Module {module.id}: {module.name}
                    </h3>
                    <p className="text-muted-foreground">
                      {getModuleDescription(module.id)}
                    </p>
                  </div>

                  <div className="space-y-4">
                    {module.topics.map((topic, topicIndex) => (
                      <div key={topic.id} className="border-l-2 border-border pl-4">
                        <h4 className="font-medium mb-3">{topic.name}</h4>
                        <div className="space-y-2">
                          {topic.items.map((item, itemIndex) => (
                            <div key={item.id} className="flex items-center gap-3 py-1">
                              <div className="flex-shrink-0">
                                {getItemIcon(item.type)}
                              </div>
                              <span className="text-sm flex-1">
                                {item.type === 'live-class' ? `Live Class: ${item.title}` :
                                 item.type === 'video' ? `Video: ${item.title}` :
                                 item.type === 'article' ? `Article: ${item.title}` :
                                 item.type === 'assignment' ? `Assignment: ${item.title}` :
                                 item.type === 'assessment' ? `Assessment: ${item.title}` :
                                 item.type === 'feedback' ? `Feedback Form: ${item.title}` :
                                 item.title}
                              </span>
                              {item.duration && (
                                <span className="text-xs text-muted-foreground">
                                  {item.duration}
                                </span>
                              )}
                            </div>
                          ))}
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
