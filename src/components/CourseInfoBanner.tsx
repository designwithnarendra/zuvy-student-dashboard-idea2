
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Users } from "lucide-react";
import { Course } from "@/lib/mockData";

interface CourseInfoBannerProps {
  course: Course;
}

const CourseInfoBanner = ({ course }: CourseInfoBannerProps) => {
  return (
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
          <div className="relative bg-primary-light rounded-full h-2 w-full">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300 relative"
              style={{ width: `${course.progress}%` }}
            >
              <div 
                className="absolute top-1/2 transform -translate-y-1/2 progress-label-bg progress-label px-2 py-0.5 rounded shadow-sm border text-xs font-medium whitespace-nowrap"
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
  );
};

export default CourseInfoBanner;
