
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { mockStudent, mockCourses } from "@/lib/mockData";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Filter enrolled courses
    const enrolledCourses = mockCourses.filter(course => course.status === 'enrolled');
    
    if (enrolledCourses.length === 1) {
      // If enrolled in single course, go directly to course page
      navigate(`/course/${enrolledCourses[0].id}`);
    } else if (enrolledCourses.length >= 2) {
      // If enrolled in multiple courses, go to student dashboard
      navigate('/dashboard');
    } else {
      // If no enrolled courses, go to dashboard anyway for demo
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center animate-fade-in">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
        <h1 className="text-2xl font-heading font-semibold mb-2">Neural Nexus</h1>
        <p className="text-muted-foreground">Loading your learning dashboard...</p>
      </div>
    </div>
  );
};

export default Index;
