
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Video, BookOpen, FileText, Clock, Calendar, Users, Play, CheckCircle2, XCircle, Check } from "lucide-react";
import { mockCourses, RecentClass } from "@/lib/mockData";
import Header from "@/components/Header";

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

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  const formatDateRange = () => {
    const today = new Date();
    const seventhDay = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    const formatOptions: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric'
    };
    
    return `From ${today.toLocaleDateString('en-US', formatOptions)} to ${seventhDay.toLocaleDateString('en-US', formatOptions)}`;
  };

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'class': return <Video className="w-5 h-5 text-primary" />;
      case 'assessment': return <BookOpen className="w-5 h-5 text-warning" />;
      case 'assignment': return <FileText className="w-5 h-5 text-info" />;
      default: return <Clock className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getItemIconWithBackground = (type: string) => {
    switch (type) {
      case 'class':
        return (
          <div className="w-10 h-10 rounded-full bg-secondary-light flex items-center justify-center">
            <Video className="w-5 h-5 text-secondary" />
          </div>
        );
      case 'assessment':
        return (
          <div className="w-10 h-10 rounded-full bg-warning-light flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-warning" />
          </div>
        );
      case 'assignment':
        return (
          <div className="w-10 h-10 rounded-full bg-info-light flex items-center justify-center">
            <FileText className="w-5 h-5 text-info" />
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 rounded-full bg-muted-light flex items-center justify-center">
            <Clock className="w-5 h-5 text-muted-foreground" />
          </div>
        );
    }
  };

  const getTimeRemaining = (dateTime: Date) => {
    const now = new Date();
    const timeDiff = dateTime.getTime() - now.getTime();
    
    if (timeDiff <= 0) return "Time passed";
    
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `Starts in ${days} day${days > 1 ? 's' : ''}`;
    if (hours > 0) return `Starts in ${hours} hour${hours > 1 ? 's' : ''}`;
    if (minutes > 0) return `Starts in ${minutes} minute${minutes > 1 ? 's' : ''}`;
    
    return "Starting soon";
  };

  const getModuleCTA = (moduleId: string, progress: number) => {
    if (moduleId === course.currentModule.id) {
      return "Continue Learning";
    } else if (progress === 0) {
      return "Start Learning";
    } else if (progress === 100) {
      return "Review Module";
    } else {
      return "Continue Learning";
    }
  };

  const getModuleProgress = (moduleId: string) => {
    // Mock progress for different modules
    const progressMap: { [key: string]: number } = {
      '1': 100,
      '2': 65,
      '3': 0,
      '4': 0,
    };
    return progressMap[moduleId] || 0;
  };

  const AttendanceModal = ({ classes }: { classes: RecentClass[] }) => (
    <>
      {/* Desktop Dialog */}
      <div className="hidden lg:block">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="link" className="p-0 h-auto text-primary mx-auto">
              View Full Attendance
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">Full Attendance Record</DialogTitle>
            </DialogHeader>
            <div className="space-y-1">
              {[...classes, 
                { id: "4", name: "JavaScript Fundamentals", status: 'attended' as const, date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), instructor: "Dr. Sarah Chen" },
                { id: "5", name: "HTML & CSS Basics", status: 'attended' as const, date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), instructor: "Dr. Sarah Chen" },
                { id: "6", name: "Web Development Intro", status: 'absent' as const, date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), instructor: "Dr. Sarah Chen" }
              ].map((classItem, index, array) => (
                <div key={classItem.id}>
                  <div className="flex items-center justify-between py-4">
                    <div className="flex-1">
                      <h4 className="text-lg font-bold">{classItem.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(classItem.date)} • {classItem.instructor}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={classItem.status === 'attended' ? "text-success border-success" : "text-destructive border-destructive"}>
                        {classItem.status === 'attended' ? 'Present' : 'Absent'}
                      </Badge>
                    </div>
                  </div>
                  {index < array.length - 1 && <div className="border-t border-border"></div>}
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Mobile Sheet */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="link" className="p-0 h-auto text-primary mx-auto">
              View Full Attendance
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh]">
            <SheetHeader>
              <SheetTitle className="text-xl">Full Attendance Record</SheetTitle>
            </SheetHeader>
            <div className="space-y-1 mt-4 overflow-y-auto">
              {[...classes, 
                { id: "4", name: "JavaScript Fundamentals", status: 'attended' as const, date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), instructor: "Dr. Sarah Chen" },
                { id: "5", name: "HTML & CSS Basics", status: 'attended' as const, date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), instructor: "Dr. Sarah Chen" },
                { id: "6", name: "Web Development Intro", status: 'absent' as const, date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), instructor: "Dr. Sarah Chen" }
              ].map((classItem, index, array) => (
                <div key={classItem.id}>
                  <div className="flex items-center justify-between py-4">
                    <div className="flex-1">
                      <h4 className="text-lg font-bold">{classItem.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(classItem.date)} • {classItem.instructor}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={classItem.status === 'attended' ? "text-success border-success" : "text-destructive border-destructive"}>
                        {classItem.status === 'attended' ? 'Present' : 'Absent'}
                      </Badge>
                    </div>
                  </div>
                  {index < array.length - 1 && <div className="border-t border-border"></div>}
                </div>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );

  const modulesToShow = showAllModules ? course.modules : course.modules.slice(0, 7);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="w-full">
        {/* Course Information Banner - Full Width */}
        <div className="w-full rounded-b-lg shadow-8dp bg-gradient-to-br from-primary/8 via-background to-accent/8 border-b border-border/50">
          <div className="max-w-7xl mx-auto p-6 md:p-8">
            {/* Desktop Layout */}
            <div className="hidden md:flex flex-col md:flex-row items-start gap-6 mb-6">
              <div className="flex-shrink-0">
                <img
                  src={course.image}
                  alt={course.name}
                  className="w-32 h-32 rounded-lg object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-4">
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

            {/* Mobile Layout */}
            <div className="md:hidden mb-6">
              <img
                src={course.image}
                alt={course.name}
                className="w-full h-40 rounded-lg object-cover mb-4"
              />
              <h1 className="text-2xl font-heading font-bold mb-2">{course.name}</h1>
              <p className="text-base text-muted-foreground mb-4">{course.description}</p>
              <div className="flex items-center gap-2 mb-4">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={course.instructor.avatar} />
                  <AvatarFallback>{course.instructor.name[0]}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{course.instructor.name}</span>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <p className="text-sm font-bold text-muted-foreground">In Collaboration With</p>
                <img
                  src="/lovable-uploads/09118b9e-00df-4356-a333-707d5733862f.png"
                  alt="AFE Brand"
                  className="h-12"
                />
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="relative progress-bg rounded-full h-6">
                <div 
                  className="progress-fill h-6 rounded-full transition-all duration-300"
                  style={{ width: `${course.progress}%` }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-medium bg-white px-2 py-0.5 rounded shadow-sm border">
                    {course.progress}%
                  </span>
                </div>
              </div>
            </div>

            {/* Batch Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="p-2">
                  <BookOpen className="w-4 h-4" />
                </Badge>
                <div>
                  <p className="text-sm text-muted-foreground">Batch</p>
                  <p className="font-medium">{course.batchName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="p-2">
                  <Clock className="w-4 h-4" />
                </Badge>
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-medium">{course.duration}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="p-2">
                  <Users className="w-4 h-4" />
                </Badge>
                <div>
                  <p className="text-sm text-muted-foreground">Students</p>
                  <p className="font-medium">{course.studentsEnrolled} enrolled</p>
                </div>
              </div>
            </div>
          </div>
        </div>

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
                    const isCurrentModule = module.id === course.currentModule.id;
                    const isCompleted = moduleProgress === 100;
                    
                    return (
                      <Card key={module.id} className={`shadow-4dp ${isCurrentModule ? 'border-2 border-primary' : ''}`}>
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              {isCurrentModule && (
                                <Badge className="mb-2 bg-primary text-primary-foreground">Current Module</Badge>
                              )}
                              <h3 className="text-xl font-heading font-semibold mb-2">
                                Module {module.id}: {module.name}
                              </h3>
                              <p className="text-muted-foreground mb-3">
                                {module.description || "Learn the fundamentals and build a strong foundation."}
                              </p>
                              {isCurrentModule && (
                                <p className="text-sm text-muted-foreground mb-3">
                                  Continue with: {course.currentModule.nextItem.name}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              {isCompleted && <Check className="w-5 h-5 text-success" />}
                              <Button className="px-6" asChild>
                                <Link to={`/course/${courseId}/module/${module.id}`}>
                                  {getModuleCTA(module.id, moduleProgress)}
                                </Link>
                              </Button>
                            </div>
                          </div>
                          
                          {/* Module Progress */}
                          <div className="mb-4">
                            <div className="relative progress-bg rounded-full h-3">
                              <div 
                                className="progress-fill h-3 rounded-full transition-all duration-300"
                                style={{ width: `${moduleProgress}%` }}
                              />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-xs font-medium bg-white px-2 py-0.5 rounded shadow-sm border">
                                  {moduleProgress}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
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
              {/* What's Next Section */}
              <Card className="shadow-4dp">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">What's Next?</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {formatDateRange()}
                  </p>
                </CardHeader>
                <CardContent className="pt-0">
                  {course.upcomingItems.length > 0 ? (
                    <div className="space-y-4">
                      {course.upcomingItems.map((item, index) => (
                        <div key={item.id}>
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 mt-1">
                              {getItemIconWithBackground(item.type)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between gap-4 mb-2">
                                <h4 className="font-medium text-base">{item.title}</h4>
                              </div>
                              <div className="flex items-center justify-between mb-3">
                                <p className="text-sm font-medium">
                                  {item.type === 'class' && `Scheduled on ${formatDate(item.dateTime)}`}
                                  {item.type === 'assessment' && `Starts on ${formatDate(item.dateTime)}`}
                                  {item.type === 'assignment' && `Due on ${formatDate(item.dateTime)}`}
                                </p>
                              </div>
                              {/* CTA - Bottom right */}
                              <div className="flex justify-end">
                                <Button 
                                  size="sm" 
                                  variant="link"
                                  disabled={!item.canStart}
                                  className="text-primary p-0 h-auto"
                                >
                                  {item.canStart ? item.actionText : getTimeRemaining(item.dateTime)}
                                </Button>
                              </div>
                            </div>
                          </div>
                          {index < course.upcomingItems.length - 1 && (
                            <div className="border-t border-border mt-4"></div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No upcoming items</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Attendance */}
              <Card className="shadow-4dp">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">Attendance</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {course.attendanceStats.percentage}%
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {course.attendanceStats.attended} of {course.attendanceStats.total} classes attended
                    </p>
                  </div>

                  <div className="space-y-4 mb-6">
                    <h4 className="font-medium text-sm">Recent Classes</h4>
                    {course.attendanceStats.recentClasses.map((classItem) => (
                      <div key={classItem.id} className="p-3 rounded-lg bg-muted/30">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{classItem.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(classItem.date)}
                            </p>
                          </div>
                          <Badge variant="outline" className={classItem.status === 'attended' ? "text-success border-success" : "text-destructive border-destructive"}>
                            {classItem.status === 'attended' ? 'Present' : 'Absent'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-center">
                    <AttendanceModal classes={course.attendanceStats.recentClasses} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDashboard;
