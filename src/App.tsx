
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import StudentDashboard from "./pages/StudentDashboard";
import CourseDashboard from "./pages/CourseDashboard";
import CourseSyllabusPage from "./pages/CourseSyllabusPage";
import ModuleContentPage from "./pages/ModuleContentPage";
import ProjectPage from "./pages/ProjectPage";
import AssessmentPage from "./pages/AssessmentPage";
import SolutionViewerPage from "./pages/SolutionViewerPage";
import CodingProblemPage from "./pages/CodingProblemPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Index />} />
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/course/:courseId" element={<CourseDashboard />} />
          <Route path="/course/:courseId/syllabus" element={<CourseSyllabusPage />} />
          <Route path="/course/:courseId/module/:moduleId" element={<ModuleContentPage />} />
          <Route path="/course/:courseId/project/:projectId" element={<ProjectPage />} />
          <Route path="/assessment/:courseId/:moduleId/:assessmentId" element={<AssessmentPage />} />
          <Route path="/assessment/:assessmentId" element={<AssessmentPage />} />
          <Route path="/solution-viewer/:itemId" element={<SolutionViewerPage />} />
          <Route path="/coding-problem/:itemId" element={<CodingProblemPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
