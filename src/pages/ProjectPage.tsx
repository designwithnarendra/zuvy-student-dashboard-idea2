import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { 
  X, 
  Calendar, 
  Clock, 
  FileText, 
  ExternalLink,
  Download,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { mockCourses } from "@/lib/mockData";

interface ProjectState {
  submissionLink: string;
  isSubmitted: boolean;
  submittedAt?: Date;
  validationError?: string;
}

const ProjectPage = () => {
  const { courseId, projectId } = useParams();
  const navigate = useNavigate();
  
  const [projectState, setProjectState] = useState<ProjectState>({
    submissionLink: '',
    isSubmitted: false
  });
  
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Find the project data
  const course = mockCourses.find(c => c.id === courseId);
  const project = course?.projects.find(p => p.id === projectId);

  useEffect(() => {
    if (project) {
      // Initialize state based on project status
      setProjectState({
        submissionLink: project.submissionLink || '',
        isSubmitted: project.status === 'submitted',
        submittedAt: project.status === 'submitted' ? new Date() : undefined
      });
    }
  }, [project]);

  if (!course || !project) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-heading font-bold mb-4">Project Not Found</h1>
            <p className="text-muted-foreground mb-6">The requested project could not be found.</p>
            <Button onClick={() => navigate('/dashboard')}>
              <X className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isDescriptionLong = project.description.split('\n').length > 15 || project.description.length > 800;
  const displayDescription = showFullDescription || !isDescriptionLong 
    ? project.description 
    : project.description.slice(0, 400) + '...';

  const handleSubmissionChange = (value: string) => {
    setProjectState(prev => ({
      ...prev,
      submissionLink: value,
      validationError: undefined
    }));
  };

  const handleSubmit = () => {
    if (!projectState.submissionLink.trim()) {
      setProjectState(prev => ({
        ...prev,
        validationError: 'Please provide a submission link'
      }));
      return;
    }

    // Validate URL format
    try {
      const url = new URL(projectState.submissionLink);
      const isGitHub = url.hostname.includes('github.com');
      const isGoogleDrive = url.hostname.includes('drive.google.com');
      
      if (!isGitHub && !isGoogleDrive) {
        setProjectState(prev => ({
          ...prev,
          validationError: 'Please provide a valid GitHub or Google Drive link'
        }));
        return;
      }
    } catch {
      setProjectState(prev => ({
        ...prev,
        validationError: 'Please provide a valid URL'
      }));
      return;
    }

    setProjectState(prev => ({
      ...prev,
      isSubmitted: true,
      submittedAt: new Date(),
      validationError: undefined
    }));
  };

  const handleResubmit = () => {
    setProjectState(prev => ({
      ...prev,
      isSubmitted: false,
      submittedAt: undefined,
      validationError: undefined
    }));
  };

  const isDueDatePassed = new Date() > new Date(project.dueDate);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate(`/course/${courseId}`)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          {/* Title */}
          <div>
            <h1 className="text-3xl font-heading font-bold">{project.title}</h1>
          </div>

          {/* Due Date and Time/Submission Info */}
          <div className="space-y-12">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Due Date</p>
                  <p className="font-medium">{formatDate(project.dueDate)}</p>
                </div>
              </div>
              {!projectState.isSubmitted ? (
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Time Remaining</p>
                    <p className="font-medium text-success">5 days remaining</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <div>
                    <p className="text-sm text-muted-foreground">Submitted on</p>
                    <p className="font-medium">{projectState.submittedAt?.toLocaleDateString()}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Project Description */}
          <div className="space-y-4">
            <h2 className="text-xl font-heading font-semibold">Project Description</h2>
            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                {displayDescription}
              </p>
            </div>
            {isDescriptionLong && (
              <Button
                variant="link"
                className="p-0 h-auto text-primary"
                onClick={() => setShowFullDescription(!showFullDescription)}
              >
                {showFullDescription ? (
                  <>
                    <ChevronUp className="w-4 h-4 mr-1" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4 mr-1" />
                    Show Full Description
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Project Resources */}
          {project.attachments && project.attachments.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-heading font-semibold">Project Resources</h2>
              <div className="space-y-3">
                {project.attachments.map((attachment, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-muted-foreground" />
                      <span className="font-medium">{attachment}</span>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Project Submission */}
          <div className="space-y-6">
            <h2 className="text-xl font-heading font-semibold">Project Submission</h2>
            <div className="space-y-6">
              {!projectState.isSubmitted ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="submission-link">Submission Link</Label>
                    <Input
                      id="submission-link"
                      type="url"
                      placeholder="https://github.com/your-username/project-repo or https://drive.google.com/..."
                      value={projectState.submissionLink}
                      onChange={(e) => handleSubmissionChange(e.target.value)}
                      className={projectState.validationError ? "border-destructive" : ""}
                    />
                    {projectState.validationError && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{projectState.validationError}</AlertDescription>
                      </Alert>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Provide a link to your project repository (GitHub, GitLab, etc.) or Google Drive link.
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <Button 
                      onClick={handleSubmit}
                      className="w-auto"
                    >
                      Submit Project
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Alert className="bg-success-light border-success">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <AlertDescription className="text-success">
                      Your project has been submitted successfully!
                    </AlertDescription>
                  </Alert>
                  
                  <div className="space-y-2">
                    <Label>Your Submission</Label>
                    <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                      <ExternalLink className="w-4 h-4 text-muted-foreground" />
                      <a
                        href={projectState.submissionLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline font-medium flex-1"
                      >
                        {projectState.submissionLink}
                      </a>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Need to make changes? You can resubmit your project before the deadline.
                    </p>
                    <Button variant="outline" onClick={handleResubmit}>
                      Resubmit Project
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectPage; 