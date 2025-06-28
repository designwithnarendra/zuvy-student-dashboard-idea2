
import AssessmentView from "./AssessmentView";
import QuizRenderer from "./content-renderers/QuizRenderer";
import FeedbackRenderer from "./content-renderers/FeedbackRenderer";
import AssignmentRenderer from "./content-renderers/AssignmentRenderer";
import LiveClassRenderer from "./content-renderers/LiveClassRenderer";
import CodingProblemRenderer from "./content-renderers/CodingProblemRenderer";
import VideoRenderer from "./content-renderers/VideoRenderer";
import ArticleRenderer from "./content-renderers/ArticleRenderer";

interface ModuleContentRendererProps {
  selectedItemData: { item: any; topicId: string } | null;
  getAssessmentData: (itemId: string) => any;
}

const ModuleContentRenderer = ({ selectedItemData, getAssessmentData }: ModuleContentRendererProps) => {
  if (!selectedItemData) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-heading font-bold mb-2">Module Content</h1>
        <p className="text-muted-foreground">Select a learning item from the sidebar to view its content</p>
      </div>
    );
  }

  const { item } = selectedItemData;

  // Handle assessment rendering
  if (item.type === 'assessment') {
    const assessmentData = getAssessmentData(item.id);
    if (assessmentData) {
      return <AssessmentView assessment={assessmentData} />;
    }
  }

  // Handle different content types
  switch (item.type) {
    case 'quiz':
      return <QuizRenderer item={item} />;
    case 'feedback':
      return <FeedbackRenderer item={item} />;
    case 'assignment':
      return <AssignmentRenderer item={item} />;
    case 'live-class':
      return <LiveClassRenderer item={item} />;
    case 'coding-problem':
      return <CodingProblemRenderer item={item} />;
    case 'video':
      return <VideoRenderer item={item} />;
    case 'article':
      return <ArticleRenderer item={item} />;
    default:
      return null;
  }
};

export default ModuleContentRenderer;
