
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Play, RotateCcw, CheckCircle, Video, FileText, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { mockStudent, mockCourses, Course } from "@/lib/mockData";
import Header from "@/components/Header";

const StudentDashboard = () => {
  const [filter, setFilter] = useState<'enrolled' | 'completed'>('enrolled');

  const filteredCourses = mockCourses.filter(course => course.status === filter);

  const getActionButton = (course: Course) => {
    if (course.status === 'completed') {
      return (
        <div className="flex items-center gap-3 w-full">
          <div className="hidden md:flex items-center gap-3 w-full">
            <Button variant="outline" className="flex-1 border-success text-success hover:bg-success hover:text-success-foreground" asChild>
              <Link to={`/course/${course.id}`}>
                View Course
              </Link>
            </Button>
            <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
          </div>
          <div className="md:hidden flex flex-col gap-3 w-full">
            <Button variant="outline" className="w-full border-success text-success hover:bg-success hover:text-success-foreground" asChild>
              <Link to={`/course/${course.id}`}>
                View Course
              </Link>
            </Button>
            <CheckCircle className="w-5 h-5 text-success mx-auto" />
          </div>
        </div>
      );
    }
    
    if (course.progress === 0) {
      return (
        <Button className="w-full md:w-auto" asChild>
          <Link to={`/course/${course.id}`}>
            <Play className="w-4 h-4 mr-2" />
            Start Learning
          </Link>
        </Button>
      );
    }
    
    return (
      <Button className="w-full md:w-auto" asChild>
        <Link to={`/course/${course.id}`}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Resume Learning
        </Link>
      </Button>
    );
  };

  const formatUpcomingItem = (item: any) => {
    const now = new Date();
    const itemDate = new Date(item.dateTime);
    const diffTime = itemDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));

    if (diffHours < 24) {
      return `${diffHours} hours`;
    } else {
      return `${diffDays} days`;
    }
  };

  return (
    <div className="min-h-screen bg-background mb-12">
      <Header />
      <div className="container mx-auto px-4 md:px-6 py-8 max-w-6xl">
        {/* Welcome Message */}
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold mb-2">
            Welcome back, {mockStudent.name}!
          </h1>
          <p className="text-lg text-muted-foreground">
            What will you be learning today?
          </p>
        </div>

        {/* My Courses Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-heading font-semibold mb-6">My Courses</h2>
          
          {/* Filter Chips */}
          <div className="flex gap-3 mb-6">
            <Button
              variant={filter === 'enrolled' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('enrolled')}
              className="rounded-full hover:bg-primary-light hover:text-foreground"
            >
              Enrolled
            </Button>
            <Button
              variant={filter === 'completed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('completed')}
              className="rounded-full hover:bg-primary-light hover:text-foreground"
            >
              Completed
            </Button>
          </div>
        </div>

        {/* Course Cards */}
        <div className="space-y-6 mb-12">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="w-full shadow-4dp hover:shadow-8dp transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Course Image */}
                  <div className="flex-shrink-0 md:w-20 md:h-20">
                    <img
                      src={course.image}
                      alt={course.name}
                      className="w-full h-20 md:w-20 md:h-20 rounded-lg object-cover"
                    />
                  </div>
                  
                  {/* Course Info */}
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-heading font-semibold mb-2">
                          {course.name}
                        </h3>
                        <p className="text-muted-foreground mb-3 line-clamp-2">
                          {course.description}
                        </p>
                        <div className="flex items-center gap-2 mb-4">
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={course.instructor.avatar} />
                            <AvatarFallback>{course.instructor.name[0]}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-muted-foreground">
                            {course.instructor.name}
                          </span>
                        </div>

                        {/* Progress Bar - Full Width with thin height */}
                        <div className="mb-4 md:mb-0">
                          <div className="relative bg-muted rounded-full h-2 w-full">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all duration-300 relative"
                              style={{ width: `${course.progress}%` }}
                            >
                              <div 
                                className="absolute top-1/2 transform -translate-y-1/2 bg-white px-2 py-0.5 rounded shadow-sm border text-xs font-medium whitespace-nowrap"
                                style={{ 
                                  right: course.progress === 100 ? '0' : course.progress === 0 ? 'auto' : '-12px',
                                  left: course.progress === 0 ? '0' : 'auto'
                                }}
                              >
                                {course.progress}%
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Button - Desktop: top right */}
                      <div className="hidden md:flex flex-shrink-0">
                        {getActionButton(course)}
                      </div>
                    </div>

                    {/* Action Button - Mobile: below progress */}
                    <div className="md:hidden mt-4">
                      {getActionButton(course)}
                    </div>
                  </div>
                </div>

                {/* Separator and Upcoming Items - Only for enrolled courses */}
                {course.status === 'enrolled' && course.upcomingItems.length > 0 && (
                  <>
                    {/* Separator with margin */}
                    <div className="border-t border-border mt-6 mb-6"></div>

                    {/* Upcoming Items */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {course.upcomingItems.slice(0, 3).map((item) => (
                        <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg">
                          <div className="flex-shrink-0 mt-1">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              item.type === 'class' 
                                ? 'bg-secondary-light' 
                                : item.type === 'assessment'
                                ? 'bg-warning-light'
                                : 'bg-info-light'
                            }`}>
                              {item.type === 'class' && <Video className="w-4 h-4 text-secondary" />}
                              {item.type === 'assessment' && <FileText className="w-4 h-4 text-warning" />}
                              {item.type === 'assignment' && <FileText className="w-4 h-4 text-info" />}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h4 className="text-sm font-medium line-clamp-1">
                                {item.title.replace(/^(Live Class|Assessment|Assignment): /, '')}
                              </h4>
                              <Badge 
                                variant="outline" 
                                className={`text-xs px-2 py-0.5 whitespace-nowrap ${
                                  item.type === 'class' 
                                    ? 'bg-secondary-light text-foreground border-secondary-light' 
                                    : item.type === 'assessment'
                                    ? 'bg-warning-light text-foreground border-warning-light'
                                    : 'bg-info-light text-foreground border-info-light'
                                }`}
                              >
                                {item.type === 'class' && 'Live Class'}
                                {item.type === 'assessment' && 'Assessment'}
                                {item.type === 'assignment' && 'Assignment'}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mb-2">
                              {item.type === 'assignment' ? 'Due' : 'Starts'} in {formatUpcomingItem(item)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <Card className="text-center py-12 shadow-4dp">
            <CardContent>
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-heading font-semibold mb-2">
                No {filter} courses found
              </h3>
              <p className="text-muted-foreground">
                {filter === 'enrolled' 
                  ? "You haven't enrolled in any courses yet." 
                  : "You haven't completed any courses yet."
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
