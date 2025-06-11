
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
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
  ChevronRight,
  Check,
  List
} from "lucide-react";
import { mockCourses, Module, Topic, TopicItem } from "@/lib/mockData";
import Header from "@/components/Header";

const ModuleContentPage = () => {
  const { courseId, moduleId } = useParams();
  const course = mockCourses.find(c => c.id === courseId);
  const [selectedItem, setSelectedItem] = useState<string>("");
  const [expandedTopics, setExpandedTopics] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (course && moduleId) {
      const module = course.modules.find(m => m.id === moduleId);
      if (module && module.topics.length > 0) {
        setExpandedTopics([module.topics[0].id]);
        if (module.topics[0].items.length > 0) {
          setSelectedItem(module.topics[0].items[0].id);
        }
      }
    }
  }, [course, moduleId]);

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

  const currentModule = course.modules.find(m => m.id === moduleId);
  
  if (!currentModule) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-heading font-bold mb-2">Module Not Found</h1>
          <Button asChild>
            <Link to={`/course/${courseId}`}>Back to Course</Link>
          </Button>
        </div>
      </div>
    );
  }

  const getItemIcon = (type: string, status: string) => {
    const getIconComponent = () => {
      switch (type) {
        case 'live-class':
          return <Video className="w-6 h-6" />;
        case 'video':
          return <Play className="w-6 h-6" />;
        case 'article':
          return <FileText className="w-6 h-6" />;
        case 'assignment':
          return <FileText className="w-6 h-6" />;
        case 'assessment':
          return <BookOpen className="w-6 h-6" />;
        case 'quiz':
          return <BookOpen className="w-6 h-6" />;
        case 'feedback':
          return <User className="w-6 h-6" />;
        default:
          return <Circle className="w-6 h-6" />;
      }
    };

    const getIconColor = () => {
      switch (type) {
        case 'live-class':
        case 'video':
          return status === 'completed' ? 'text-success' : 'text-primary';
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

    return (
      <div className={getIconColor()}>
        {getIconComponent()}
      </div>
    );
  };

  const getItemDetails = (item: TopicItem) => {
    if (item.type === 'live-class' || item.type === 'video') {
      return item.duration || '45 mins';
    }
    if (item.type === 'article') {
      return '5 mins read';
    }
    if (item.type === 'assignment' || item.type === 'feedback') {
      return 'Due: Dec 15, 2024';
    }
    if (item.type === 'assessment') {
      return 'Starts: Dec 20, 2024 10:00 AM';
    }
    return '';
  };

  const toggleTopic = (topicId: string) => {
    setExpandedTopics(prev => 
      prev.includes(topicId) 
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    );
  };

  const handleItemSelect = (itemId: string) => {
    setSelectedItem(itemId);
    if (isMobile) {
      setIsSheetOpen(false);
    }
  };

  const getSelectedItem = () => {
    for (const topic of currentModule.topics) {
      const item = topic.items.find(item => item.id === selectedItem);
      if (item) return { item, topicId: topic.id };
    }
    return null;
  };

  const selectedItemData = getSelectedItem();

  const getAllItems = () => {
    const items: { item: TopicItem; topicId: string }[] = [];
    currentModule.topics.forEach(topic => {
      topic.items.forEach(item => {
        items.push({ item, topicId: topic.id });
      });
    });
    return items;
  };

  const allItems = getAllItems();
  const currentIndex = allItems.findIndex(({ item }) => item.id === selectedItem);
  const prevItem = currentIndex > 0 ? allItems[currentIndex - 1] : null;
  const nextItem = currentIndex < allItems.length - 1 ? allItems[currentIndex + 1] : null;

  const getTimeRemaining = (dateTime: Date) => {
    const now = new Date();
    const timeDiff = dateTime.getTime() - now.getTime();
    
    if (timeDiff <= 0) return "Starting now";
    
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  };

  const renderContent = () => {
    if (!selectedItemData) {
      return (
        <div className="text-center py-12">
          <h1 className="text-2xl font-heading font-bold mb-2">Module Content</h1>
          <p className="text-muted-foreground">Select a learning item from the sidebar to view its content</p>
        </div>
      );
    }

    const { item } = selectedItemData;

    if (item.type === 'live-class') {
      const isScheduled = item.scheduledDateTime && new Date() < item.scheduledDateTime;
      const isInProgress = item.scheduledDateTime && 
        new Date() >= new Date(item.scheduledDateTime.getTime() - 10 * 60 * 1000) &&
        new Date() < new Date(item.scheduledDateTime.getTime() + 60 * 60 * 1000);
      const isCompleted = item.status === 'completed';

      if (isScheduled) {
        return (
          <div className="max-w-4xl mx-auto p-8">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-heading font-bold">{item.title}</h1>
            </div>
            <p className="text-muted-foreground mb-6">{item.description || "Join this live interactive session with your instructor and fellow students."}</p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-muted-foreground">Scheduled Date & Time</p>
                <p className="font-medium">{item.scheduledDateTime?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="font-medium">{item.duration || '45 mins'}</p>
              </div>
            </div>
            <div className="bg-info-light p-4 rounded-lg mb-6">
              <p className="text-info">Class recording will be available after the class</p>
            </div>
            <div className="text-center">
              <Button disabled variant="outline" className="bg-transparent border-muted text-muted-foreground">
                Starts in {getTimeRemaining(item.scheduledDateTime!)}
              </Button>
            </div>
          </div>
        );
      }

      if (isInProgress) {
        return (
          <div className="max-w-4xl mx-auto p-8">
            <h1 className="text-3xl font-heading font-bold mb-4">{item.title}</h1>
            <p className="text-muted-foreground mb-6">{item.description || "Join this live interactive session with your instructor and fellow students."}</p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-muted-foreground">Scheduled Date & Time</p>
                <p className="font-medium">{item.scheduledDateTime?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="font-medium">{item.duration || '45 mins'}</p>
              </div>
            </div>
            <div className="text-center">
              <Button className="mb-6">Join Class</Button>
            </div>
          </div>
        );
      }

      if (isCompleted) {
        return (
          <div className="max-w-4xl mx-auto p-8">
            <h1 className="text-3xl font-heading font-bold mb-4">{item.title}</h1>
            <p className="text-muted-foreground mb-6">{item.description || "This live class has been completed."}</p>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div>
                <p className="text-sm text-muted-foreground">Date & Time</p>
                <p className="font-medium">{item.scheduledDateTime?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="font-medium">{item.duration || '45 mins'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Attendance</p>
                <p className="font-medium text-success">Present</p>
              </div>
            </div>
            <p className="text-success mb-6 flex items-center gap-2">
              <Check className="w-5 h-5" />
              Class completed
            </p>
            
            <div className="border-t border-border pt-6">
              <h2 className="text-xl font-heading font-semibold mb-4">Recording available for the live class</h2>
              <div className="bg-black rounded-lg aspect-video flex items-center justify-center">
                <div className="text-center text-white">
                  <Play className="w-16 h-16 mx-auto mb-4" />
                  <p>Class Recording</p>
                  <p className="text-sm opacity-75">{item.duration || '45 mins'}</p>
                </div>
              </div>
            </div>
          </div>
        );
      }
    }

    if (item.type === 'video') {
      return (
        <div className="max-w-4xl mx-auto p-8">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-3xl font-heading font-bold">{item.title}</h1>
            <Badge variant="outline" className={item.status === 'completed' ? "text-success border-success" : "text-muted-foreground"}>
              {item.status === 'completed' ? 'Watched' : 'Not Watched'}
            </Badge>
          </div>
          <p className="text-muted-foreground mb-6">Duration: {item.duration || '20 mins'}</p>
          <div className="bg-black rounded-lg aspect-video flex items-center justify-center">
            <div className="text-center text-white">
              <Play className="w-16 h-16 mx-auto mb-4" />
              <p>Video Content</p>
              <p className="text-sm opacity-75">{item.duration || '20 mins'}</p>
            </div>
          </div>
        </div>
      );
    }

    if (item.type === 'article') {
      return (
        <div className="max-w-2xl mx-auto p-8">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-3xl font-heading font-bold">{item.title}</h1>
            <Badge variant="outline" className={item.status === 'completed' ? "text-success border-success" : "text-muted-foreground"}>
              {item.status === 'completed' ? 'Read' : 'To be Read'}
            </Badge>
          </div>
          <p className="text-muted-foreground mb-6">Approximate read time: 5 mins</p>
          <div className="prose max-w-none mb-8">
            <p>This is a sample article content. In a real implementation, this would contain the actual article text with proper formatting, images, and other content elements.</p>
            <p>The article content would be comprehensive and educational, providing valuable insights and knowledge to the student.</p>
          </div>
          {item.status !== 'completed' && (
            <div className="flex justify-center">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                Mark as Read
              </Button>
            </div>
          )}
        </div>
      );
    }

    if (item.type === 'assignment') {
      return (
        <div className="max-w-2xl mx-auto p-8">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-3xl font-heading font-bold text-left">{item.title}</h1>
            <Badge variant="outline" className={item.status === 'completed' ? "text-success border-success" : "text-muted-foreground"}>
              {item.status === 'completed' ? 'Attempted' : 'Not Attempted'}
            </Badge>
          </div>
          <p className="text-muted-foreground mb-6 text-left">Due: December 15, 2024</p>
          <p className="text-muted-foreground mb-8 text-left">Complete this assignment to demonstrate your understanding of the concepts covered in this module.</p>
          <div className="text-center">
            <Button>Start Assignment</Button>
          </div>
        </div>
      );
    }

    if (item.type === 'assessment') {
      const startDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
      const endDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
      const canStart = new Date() >= startDate;
      
      return (
        <div className="max-w-2xl mx-auto p-8">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-3xl font-heading font-bold text-left">{item.title}</h1>
            <Badge variant="outline" className={item.status === 'completed' ? "text-success border-success" : "text-muted-foreground"}>
              {item.status === 'completed' ? 'Attempted' : 'Not Attempted'}
            </Badge>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-6 text-left">
            <div>
              <p className="text-sm text-muted-foreground">Start Date</p>
              <p className="font-medium">{startDate.toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">End Date</p>
              <p className="font-medium">{endDate.toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="font-medium">2 hours</p>
            </div>
          </div>
          <p className="text-muted-foreground mb-8 text-left">This assessment will test your knowledge and understanding of the module content.</p>
          <div className="text-center">
            <Button disabled={!canStart}>
              {canStart ? 'Start Assessment' : `Opens in ${getTimeRemaining(startDate)}`}
            </Button>
          </div>
        </div>
      );
    }

    return null;
  };

  const SidebarContent = () => (
    <ScrollArea className="h-[calc(100vh-200px)] lg:h-[calc(100vh-200px)]">
      <div className="p-4 space-y-4">
        {currentModule.topics.map((topic: Topic) => (
          <div key={topic.id} className="space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start text-left h-auto p-3 hover:bg-primary-light hover:text-charcoal"
              onClick={() => toggleTopic(topic.id)}
            >
              <div className="flex w-full justify-between items-start gap-2">
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm break-words leading-relaxed whitespace-normal">
                    {topic.name}
                  </div>
                </div>
                <div className="flex-shrink-0 mt-0.5">
                  {expandedTopics.includes(topic.id) ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </div>
              </div>
            </Button>
            
            {expandedTopics.includes(topic.id) && (
              <div className="space-y-1 pl-0">
                {topic.items.map((item: TopicItem, index) => {
                  // Make second topic's live class "in progress"
                  const isSecondTopicLiveClass = topic.id === currentModule.topics[1]?.id && item.type === 'live-class';
                  const adjustedItem = isSecondTopicLiveClass ? {
                    ...item,
                    scheduledDateTime: new Date(Date.now() - 5 * 60 * 1000) // 5 minutes ago (in progress)
                  } : item;

                  return (
                    <Button
                      key={item.id}
                      variant="ghost"
                      size="sm"
                      className={`w-full justify-start text-left h-auto p-3 text-sm break-words leading-relaxed whitespace-normal ${
                        selectedItem === item.id 
                          ? "bg-primary-light border-l-4 border-primary text-charcoal" 
                          : "hover:bg-primary-light hover:text-charcoal"
                      }`}
                      onClick={() => handleItemSelect(item.id)}
                    >
                      <div className="flex items-start gap-3 w-full">
                        <div className="flex-shrink-0 mt-1">
                          {getItemIcon(item.type, item.status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium break-words whitespace-normal text-left mb-1">
                            {item.type === 'live-class' ? `Live Class: ${item.title}` :
                             item.type === 'video' ? `Video: ${item.title}` :
                             item.type === 'article' ? `Article: ${item.title}` :
                             item.type === 'assignment' ? `Assignment: ${item.title}` :
                             item.type === 'assessment' ? `Assessment: ${item.title}` :
                             item.type === 'feedback' ? `Feedback Form: ${item.title}` :
                             item.title}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {getItemDetails(adjustedItem)}
                          </div>
                        </div>
                        {item.status === 'completed' && (
                          <div className="flex-shrink-0">
                            <Check className="w-4 h-4 text-success" />
                          </div>
                        )}
                      </div>
                    </Button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Mobile: Module name at top */}
      {isMobile && (
        <div className="lg:hidden px-4 py-4 border-b border-border">
          <h2 className="text-lg font-heading font-semibold">Module {moduleId}: {currentModule.name}</h2>
        </div>
      )}

      <div className="flex h-[calc(100vh-80px)] lg:h-[calc(100vh-80px)]">
        {/* Desktop Sidebar */}
        {!isMobile && (
          <div className="w-80 bg-card border-r border-border shadow-4dp fixed h-full">
            <div className="p-6 border-b border-border">
              <Button variant="link" size="sm" asChild className="mb-4 p-0 h-auto text-foreground hover:text-foreground hover:no-underline">
                <Link to={`/course/${courseId}`}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Course
                </Link>
              </Button>
              <h2 className="text-lg font-heading font-semibold">Module Content</h2>
              <p className="text-sm text-muted-foreground mt-1 break-words">Module {moduleId}: {currentModule.name}</p>
            </div>
            
            <div className="border-t border-border"></div>
            
            <SidebarContent />
          </div>
        )}

        {/* Main Content Area */}
        <div className={`flex-1 ${!isMobile ? 'ml-80' : ''} overflow-y-auto flex flex-col`}>
          <div className="flex-1">
            {renderContent()}
          </div>
          
          {/* Navigation buttons at bottom */}
          <div className="border-t border-border p-6">
            <div className="max-w-4xl mx-auto flex justify-between items-center">
              <Button
                variant="link"
                className="text-charcoal p-0 h-auto"
                disabled={!prevItem}
                onClick={() => prevItem && handleItemSelect(prevItem.item.id)}
              >
                Back
              </Button>
              <Button
                variant="link"
                className="text-primary p-0 h-auto"
                disabled={!nextItem}
                onClick={() => nextItem && handleItemSelect(nextItem.item.id)}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Bar */}
      {isMobile && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 flex items-center justify-between">
          <Button
            variant="link"
            className="text-charcoal p-0 h-auto"
            disabled={!prevItem}
            onClick={() => prevItem && handleItemSelect(prevItem.item.id)}
          >
            Back
          </Button>
          
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="border-primary text-primary">
                <List className="w-4 h-4 mr-2" />
                Module Content
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh]">
              <SheetHeader>
                <SheetTitle>Module Content</SheetTitle>
              </SheetHeader>
              <div className="mt-4">
                <SidebarContent />
              </div>
            </SheetContent>
          </Sheet>
          
          <Button
            variant="link"
            className="text-primary p-0 h-auto"
            disabled={!nextItem}
            onClick={() => nextItem && handleItemSelect(nextItem.item.id)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default ModuleContentPage;
