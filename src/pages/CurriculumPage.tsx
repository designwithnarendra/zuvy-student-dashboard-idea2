import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Video, 
  BookOpen, 
  FileText, 
  Clock, 
  Play, 
  CheckCircle2, 
  Circle,
  ArrowLeft,
  Calendar,
  User,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { mockCourses, Module, Topic, TopicItem } from "@/lib/mockData";
import { getStatusBadgeStyles } from "@/lib/utils";
import Header from "@/components/Header";
import ModuleSheet from "@/components/ModuleSheet";

const CurriculumPage = () => {
  const { courseId, moduleId, topicId } = useParams();
  const course = mockCourses.find(c => c.id === courseId);
  const [selectedModule, setSelectedModule] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (course) {
      const initialModule = moduleId || course.currentModule.id;
      const moduleExists = course.modules.find(m => m.id === initialModule);
      
      if (moduleExists) {
        setSelectedModule(initialModule);
        setExpandedModules([initialModule]);
        
        const initialTopic = topicId || moduleExists.topics[0]?.id || "";
        setSelectedTopic(initialTopic);
      }
    }
  }, [course, moduleId, topicId]);

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

  const getItemIcon = (type: string, status: string) => {
    const getIconComponent = () => {
      switch (type) {
        case 'live-class':
          return <Video className="w-4 h-4" />;
        case 'recording':
          return <Video className="w-4 h-4" />;
        case 'video':
          return <Play className="w-4 h-4" />;
        case 'article':
          return <FileText className="w-4 h-4" />;
        case 'assignment':
          return <FileText className="w-4 h-4" />;
        case 'assessment':
          return <BookOpen className="w-4 h-4" />;
        case 'quiz':
          return <BookOpen className="w-4 h-4" />;
        case 'feedback':
          return <User className="w-4 h-4" />;
        default:
          return <Circle className="w-4 h-4" />;
      }
    };

    const getIconColor = () => {
      switch (type) {
        case 'live-class':
        case 'video':
          return status === 'completed' ? 'text-success' : 'text-primary';
        case 'recording':
          return status === 'completed' ? 'text-success' : 'text-muted-foreground';
        case 'article':
        case 'assessment':
          return status === 'completed' ? 'text-success' : 'text-accent';
        case 'assignment':
          return status === 'completed' ? 'text-success' : 'text-secondary';
        case 'quiz':
          return status === 'completed' ? 'text-success' : 'text-warning';
        case 'feedback':
          return status === 'completed' ? 'text-success' : 'text-info';
        default:
          return 'text-muted-foreground';
      }
    };

    const getBgColor = () => {
      switch (type) {
        case 'live-class':
        case 'video':
          return 'bg-primary-light';
        case 'recording':
          return 'bg-muted/20';
        case 'article':
        case 'assessment':
          return 'bg-accent-light';
        case 'assignment':
          return 'bg-secondary-light';
        case 'quiz':
          return 'bg-warning-light';
        case 'feedback':
          return 'bg-info-light';
        default:
          return 'bg-muted-light';
      }
    };

    return (
      <div className={`w-10 h-10 rounded-full ${getBgColor()} flex items-center justify-center flex-shrink-0`}>
        <div className={getIconColor()}>
          {getIconComponent()}
        </div>
      </div>
    );
  };

  const getStatusBadge = (status: string, type: string, item: TopicItem) => {
    if (type === 'live-class') {
      if (item.scheduledDateTime && new Date() < item.scheduledDateTime) {
        const timeRemaining = getTimeRemaining(item.scheduledDateTime);
        return <Badge variant="outline" className={getStatusBadgeStyles('scheduled')}>{timeRemaining}</Badge>;
      } else if (status === 'completed') {
        return (
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-success" />
            <Badge variant="outline" className={getStatusBadgeStyles('completed')}>Completed</Badge>
            {item.attendanceStatus && (
              <Badge variant="outline" className={item.attendanceStatus === 'present' ? getStatusBadgeStyles('completed') : "bg-destructive-light text-destructive border border-destructive"}>
                {item.attendanceStatus === 'present' ? 'Present' : 'Absent'}
              </Badge>
            )}
          </div>
        );
      }
    }

    if (type === 'video') {
      if (status === 'completed') {
        return <Badge variant="outline" className={getStatusBadgeStyles('watched')}>Watched</Badge>;
      } else {
        return <Badge variant="outline" className={getStatusBadgeStyles('not watched')}>Not Watched</Badge>;
      }
    }

    if (type === 'article') {
      if (status === 'completed') {
        return <Badge variant="outline" className={getStatusBadgeStyles('read')}>Read</Badge>;
      } else {
        return <Badge variant="outline" className={getStatusBadgeStyles('to be read')}>To be Read</Badge>;
      }
    }

    if (type === 'feedback') {
      if (status === 'completed') {
        return <Badge variant="outline" className={getStatusBadgeStyles('submitted')}>Feedback Shared</Badge>;
      } else {
        return <Badge variant="outline" className={getStatusBadgeStyles('not submitted')}>Not Started</Badge>;
      }
    }

    switch (status) {
      case 'completed':
        return <Badge variant="outline" className={getStatusBadgeStyles('completed')}>Completed</Badge>;
      case 'in-progress':
        return <Badge variant="outline" className="bg-warning-light text-warning border border-warning">In Progress</Badge>;
      case 'not-started':
        return <Badge variant="outline" className={getStatusBadgeStyles('not started')}>Not Started</Badge>;
      default:
        return <Badge variant="outline" className={getStatusBadgeStyles('not started')}>Not Started</Badge>;
    }
  };

  const getTimeRemaining = (scheduledDate: Date) => {
    const now = new Date();
    const timeDiff = scheduledDate.getTime() - now.getTime();
    
    if (timeDiff <= 0) return "Time passed";
    
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `Starts in ${days} day${days > 1 ? 's' : ''}`;
    if (hours > 0) return `Starts in ${hours} hour${hours > 1 ? 's' : ''}`;
    if (minutes > 0) return `Starts in ${minutes} minute${minutes > 1 ? 's' : ''}`;
    
    return "Starting soon";
  };

  const formatScheduledDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const handleTopicSelect = (moduleId: string, topicId: string) => {
    setSelectedModule(moduleId);
    setSelectedTopic(topicId);
    if (!expandedModules.includes(moduleId)) {
      setExpandedModules(prev => [...prev, moduleId]);
    }
  };

  const getEnhancedItems = (topic: Topic, moduleId: string): TopicItem[] => {
    const baseItems = [...topic.items];
    
    // Add recordings after completed live classes
    const enhancedItems: TopicItem[] = [];
    baseItems.forEach(item => {
      enhancedItems.push(item);
      if (item.type === 'live-class' && item.status === 'completed') {
        enhancedItems.push({
          id: `${item.id}-recording`,
          title: item.title,
          type: 'recording' as const,
          status: 'completed' as const,
          duration: item.duration
        });
      }
    });

    return enhancedItems;
  };

  const currentModule = course.modules.find(m => m.id === selectedModule);
  const currentTopic = currentModule?.topics.find(t => t.id === selectedTopic);

  const getActionButton = (item: TopicItem) => {
    const isLiveClass = item.type === 'live-class';
    const isRecording = item.type === 'recording';
    const isVideo = item.type === 'video';
    const isArticle = item.type === 'article';
    const isAssignment = item.type === 'assignment';
    const isAssessment = item.type === 'assessment';
    const isFeedback = item.type === 'feedback';

    if (isLiveClass) {
      if (item.scheduledDateTime && new Date() < item.scheduledDateTime) {
        const tenMinutesBefore = new Date(item.scheduledDateTime.getTime() - 10 * 60 * 1000);
        const canJoin = new Date() >= tenMinutesBefore;
        
        return (
          <Button 
            size="sm" 
            disabled={!canJoin} 
            className={canJoin ? "" : "opacity-50 cursor-not-allowed"}
          >
            Join Class
          </Button>
        );
      } else if (item.status === 'completed') {
        return null; // No button for completed live classes
      }
    }

    if (isRecording) {
      if (item.status === 'completed') {
        return (
          <Button size="sm" variant="outline" className="bg-primary-light text-primary border-primary hover:bg-primary hover:text-primary-foreground" asChild>
            <Link to={`/content/${item.type}/${item.id}`}>
              Watch Recording
            </Link>
          </Button>
        );
      } else {
        return (
          <span className="text-sm text-muted-foreground">
            Live class recording will be available after the live class
          </span>
        );
      }
    }

    if (isVideo) {
      return (
        <Button size="sm" variant="outline" className="bg-primary-light text-primary border-primary hover:bg-primary hover:text-primary-foreground" asChild>
          <Link to={`/content/${item.type}/${item.id}`}>
            {item.status === 'completed' ? 'Watch Again' : 'Watch Video'}
          </Link>
        </Button>
      );
    }

    if (isArticle) {
      return (
        <Button size="sm" variant="outline" className="bg-accent-light text-accent border-accent hover:bg-accent hover:text-accent-foreground" asChild>
          <Link to={`/content/${item.type}/${item.id}`}>
            {item.status === 'completed' ? 'Read Again' : 'Read Article'}
          </Link>
        </Button>
      );
    }

    if (isAssignment) {
      return (
        <Button size="sm" className="bg-secondary-light text-secondary border-secondary hover:bg-secondary hover:text-secondary-foreground" variant="outline">
          {item.status === 'completed' ? 'View Submission' : 'Start Assignment'}
        </Button>
      );
    }

    if (isAssessment) {
      const canStart = item.scheduledDateTime ? new Date() >= item.scheduledDateTime : true;
      
      if (!canStart) {
        return null; // No button until scheduled date
      }
      
      return (
        <Button size="sm" className="bg-accent-light text-accent border-accent hover:bg-accent hover:text-accent-foreground" variant="outline">
          {item.status === 'completed' ? 'View Results' : 'Start Assessment'}
        </Button>
      );
    }

    if (isFeedback) {
      const canGiveFeedback = true; // Simplified logic for demo
      
      if (!canGiveFeedback) {
        return null;
      }
      
      return (
        <Button size="sm" className="bg-info-light text-info border-info hover:bg-info hover:text-info-foreground" variant="outline">
          {item.status === 'completed' ? 'View Feedback' : 'Share Feedback'}
        </Button>
      );
    }

    return null;
  };

  const renderLearningItem = (item: TopicItem, index: number) => (
    <Card key={`${item.id}-${index}`} className="hover:shadow-md transition-shadow shadow-4dp">
      <CardContent className="p-4 md:p-6">
        <div className="flex items-start gap-4">
          {getItemIcon(item.type, item.status)}
          
          <div className="flex-1 min-w-0">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 md:gap-4 mb-3">
              <h3 className="text-base md:text-lg font-medium break-words leading-relaxed">
                {item.type === 'live-class' ? `Live Class: ${item.title}` :
                 item.type === 'recording' ? `Recording: ${item.title}` :
                 item.type === 'video' ? `Video: ${item.title}` :
                 item.type === 'article' ? `Article: ${item.title}` :
                 item.type === 'assignment' ? `Assignment: ${item.title}` :
                 item.type === 'assessment' ? `Assessment: ${item.title}` :
                 item.type === 'feedback' ? `Feedback Form: ${item.title}` :
                 item.title}
              </h3>
              <div className="flex-shrink-0">
                {getStatusBadge(item.status, item.type, item)}
              </div>
            </div>
            
            {item.description && (
              <p className="text-sm text-muted-foreground mb-3 break-words leading-relaxed">
                {item.description}
              </p>
            )}
            
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-sm text-muted-foreground mb-4">
              {item.duration && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 flex-shrink-0" />
                  <span>Duration: {item.duration}</span>
                </div>
              )}
              {item.scheduledDateTime && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 flex-shrink-0" />
                  <span>Start Date: {formatScheduledDate(item.scheduledDateTime)}</span>
                </div>
              )}
              {item.type === 'assessment' && item.endDateTime && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 flex-shrink-0" />
                  <span>End Date: {formatScheduledDate(item.endDateTime)}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end">
              <div className="flex gap-2">
                {getActionButton(item)}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex h-[calc(100vh-80px)]">
        {/* Desktop Left Panel - Module Navigation */}
        {!isMobile && (
          <div className="w-80 bg-card border-r border-border shadow-4dp fixed h-full">
            <div className="p-6 border-b border-border">
              <Button variant="link" size="sm" asChild className="mb-4 p-0 h-auto text-foreground hover:text-foreground hover:no-underline">
                <Link to={`/course/${courseId}`}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Course
                </Link>
              </Button>
              <h2 className="text-lg font-heading font-semibold">Course Curriculum</h2>
              <p className="text-sm text-muted-foreground mt-1 break-words">{course.name}</p>
            </div>
            
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="p-4 space-y-4">
                {course.modules.map((module: Module) => (
                  <div key={module.id} className="space-y-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-left h-auto p-3 hover:bg-primary-light hover:text-charcoal"
                      onClick={() => toggleModule(module.id)}
                    >
                      <div className="flex w-full justify-between items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-sm break-words leading-relaxed whitespace-normal">
                            Module {module.id}: {module.name}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {module.topics.length} topics
                          </div>
                        </div>
                        <div className="flex-shrink-0 mt-0.5">
                          {expandedModules.includes(module.id) ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </div>
                      </div>
                    </Button>
                    
                    {expandedModules.includes(module.id) && (
                      <div className="space-y-1 pl-0">
                        {module.topics.map((topic: Topic) => (
                          <Button
                            key={topic.id}
                            variant="ghost"
                            size="sm"
                            className={`w-full justify-start text-left h-auto p-2 text-sm break-words leading-relaxed whitespace-normal ${
                              selectedModule === module.id && selectedTopic === topic.id 
                                ? "bg-primary-light border-l-4 border-primary text-charcoal" 
                                : "hover:bg-primary-light hover:text-charcoal"
                            }`}
                            onClick={() => handleTopicSelect(module.id, topic.id)}
                          >
                            <span className="break-words whitespace-normal text-left">{topic.name}</span>
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Main Content Area */}
        <div className={`flex-1 p-4 md:p-8 overflow-y-auto ${!isMobile ? 'ml-80' : ''}`}>
          <div className="max-w-4xl mx-auto">
            {currentTopic ? (
              <div>
                <div className="mb-6 md:mb-8">
                  <h1 className="text-2xl md:text-3xl font-heading font-bold mb-2 break-words leading-relaxed">
                    {currentTopic.name}
                  </h1>
                  <p className="text-muted-foreground mb-2">
                    Module {selectedModule}: {currentModule?.name}
                  </p>
                  <p className="text-sm text-muted-foreground break-words leading-relaxed">
                    {currentTopic.description}
                  </p>
                </div>

                <div className="space-y-4">
                  {getEnhancedItems(currentTopic, selectedModule).map((item: TopicItem, index) => 
                    renderLearningItem(item, index)
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <h1 className="text-2xl md:text-3xl font-heading font-bold mb-2">Course Curriculum</h1>
                <p className="text-muted-foreground mb-8">
                  {isMobile ? "Select a topic from the module list below" : "Select a module from the left panel to get started"}
                </p>
              </div>
            )}

            {/* Mobile Bottom Navigation */}
            {isMobile && (
              <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border">
                <ModuleSheet
                  modules={course.modules}
                  selectedModule={selectedModule}
                  selectedTopic={selectedTopic}
                  onTopicSelect={(moduleId, topicId) => {
                    handleTopicSelect(moduleId, topicId);
                  }}
                  courseName={course.name}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurriculumPage;
