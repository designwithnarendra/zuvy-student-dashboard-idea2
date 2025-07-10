import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { GraduationCap, Video } from "lucide-react";
import { Link } from "react-router-dom";
import { getStatusBadgeStyles } from "@/lib/utils";

interface RecentClass {
  id: string;
  name: string;
  status: 'attended' | 'absent';
  date: Date;
  instructor: string;
}

interface AttendanceStats {
  percentage: number;
  attended: number;
  total: number;
  recentClasses: RecentClass[];
}

interface AttendanceCardProps {
  attendanceStats: AttendanceStats;
  courseId: string;
}

const AttendanceCard = ({ attendanceStats, courseId }: AttendanceCardProps) => {
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

  // Helper function to get live class link based on class name
  const getLiveClassLink = (className: string) => {
    // This is a simplified mapping - in a real app, you'd have proper class ID to learning item mapping
    // For demo purposes, linking to curriculum page where they can find the specific live class
    return `/course/${courseId}/curriculum`;
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
          <DialogContent className="max-w-2xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="text-xl">Full Attendance Record</DialogTitle>
            </DialogHeader>
            <div className="space-y-1 overflow-y-auto max-h-[60vh] scrollbar-hide">
              {[...classes, 
                { id: "4", name: "JavaScript Fundamentals", status: 'attended' as const, date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), instructor: "Dr. Sarah Chen" },
                { id: "5", name: "HTML & CSS Basics", status: 'attended' as const, date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), instructor: "Dr. Sarah Chen" },
                { id: "6", name: "Web Development Intro", status: 'absent' as const, date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), instructor: "Dr. Sarah Chen" }
              ].map((classItem, index, array) => (
                <div key={classItem.id}>
                  <div className="flex items-center justify-between py-4">
                    <div className="flex-1">
                      <h4 className="text-lg font-bold font-sans">{classItem.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(classItem.date)} • {classItem.instructor}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={classItem.status === 'attended' ? "text-success border-success" : "text-destructive border-destructive"}>
                        {classItem.status === 'attended' ? 'Present' : 'Absent'}
                      </Badge>
                      <Link 
                        to={getLiveClassLink(classItem.name)}
                        className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-primary-light transition-colors"
                        title="View Class Recording"
                      >
                        <Video className="w-4 h-4 text-primary" />
                      </Link>
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
            <SheetHeader className="border-b pb-4">
              <SheetTitle className="text-xl">Full Attendance Record</SheetTitle>
            </SheetHeader>
            <div className="space-y-1 mt-4 overflow-y-auto flex-1 scrollbar-hide">
              {[...classes, 
                { id: "4", name: "JavaScript Fundamentals", status: 'attended' as const, date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), instructor: "Dr. Sarah Chen" },
                { id: "5", name: "HTML & CSS Basics", status: 'attended' as const, date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), instructor: "Dr. Sarah Chen" },
                { id: "6", name: "Web Development Intro", status: 'absent' as const, date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), instructor: "Dr. Sarah Chen" }
              ].map((classItem, index, array) => (
                <div key={classItem.id}>
                  <div className="flex items-center justify-between py-4">
                    <div className="flex-1">
                      <h4 className="text-lg font-bold font-sans">{classItem.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(classItem.date)} • {classItem.instructor}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={classItem.status === 'attended' ? "text-success border-success" : "text-destructive border-destructive"}>
                        {classItem.status === 'attended' ? 'Present' : 'Absent'}
                      </Badge>
                      <Link 
                        to={getLiveClassLink(classItem.name)}
                        className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-primary-light transition-colors"
                        title="View Class Recording"
                      >
                        <Video className="w-4 h-4 text-primary" />
                      </Link>
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

  return (
    <Card className="shadow-4dp">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl">Attendance</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-center mb-6">
          <div className="text-3xl font-bold text-primary mb-2">
            {attendanceStats.percentage}%
          </div>
          <p className="text-sm text-muted-foreground">
            {attendanceStats.attended} of {attendanceStats.total} classes attended
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <h4 className="font-medium text-sm">Recent Classes</h4>
          {attendanceStats.recentClasses.length > 0 ? (
            attendanceStats.recentClasses.slice(0, 3).map((classItem) => (
              <div key={classItem.id} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-sm">{classItem.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(classItem.date)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={classItem.status === 'attended' ? "text-success border-success" : "text-destructive border-destructive"}>
                    {classItem.status === 'attended' ? 'Present' : 'Absent'}
                  </Badge>
                  <Link 
                    to={getLiveClassLink(classItem.name)}
                    className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-primary-light transition-colors"
                    title="View Class Recording"
                  >
                    <Video className="w-4 h-4 text-primary" />
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4">
              <GraduationCap className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground text-sm">No Classes</p>
            </div>
          )}
        </div>

        {attendanceStats.recentClasses.length > 0 && (
          <div className="flex justify-center">
            <AttendanceModal classes={attendanceStats.recentClasses} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AttendanceCard;
