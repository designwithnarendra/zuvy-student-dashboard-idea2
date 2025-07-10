import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, useParams } from "react-router-dom";
import { Project } from "@/lib/mockData";

interface ProjectCardProps {
  project: Project;
  isCurrentFocus?: boolean;
}

const ProjectCard = ({ project, isCurrentFocus = false }: ProjectCardProps) => {
  const { courseId } = useParams();

  return (
    <Card className="w-full shadow-4dp hover:shadow-8dp transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1">
            <Badge 
              className={`mb-2 pointer-events-none ${
                project.status === 'submitted' 
                  ? 'bg-success-light text-success border-success/20' 
                  : 'bg-muted-light text-muted-foreground border-muted-foreground/20'
              }`}
            >
              {project.status === 'submitted' ? 'Submitted' : 'Not Submitted'}
            </Badge>
            <h3 className="text-xl font-heading font-semibold mb-2">Project: {project.title}</h3>
            <p className="text-muted-foreground mb-3 line-clamp-2 text-sm">{project.description}</p>
            <p className="text-sm text-muted-foreground mb-2">Due: {project.dueDate}</p>
          </div>
          <div className="flex-shrink-0">
            <Button variant="link" asChild>
              <Link to={`/course/${courseId}/project/${project.id}`}>
                {project.status === 'submitted' ? 'View Solution' : 'View Project'}
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard; 