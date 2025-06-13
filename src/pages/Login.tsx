
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

interface StudentProfile {
  name: string;
  role: string;
  avatar: string;
}

interface Metric {
  number: string;
  description: string;
}

interface StudentCard {
  type: 'student';
  data: StudentProfile;
}

interface MetricCard {
  type: 'metric';
  data: Metric;
}

type CardItem = StudentCard | MetricCard;

const Login = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    // For now, just navigate to dashboard
    navigate('/dashboard');
  };

  const studentProfiles: StudentProfile[] = [
    { name: "Priya Sharma", role: "SDE Intern at Google", avatar: "PS" },
    { name: "Arjun Patel", role: "Frontend Dev at Microsoft", avatar: "AP" },
    { name: "Sneha Kumar", role: "Data Scientist at Meta", avatar: "SK" },
    { name: "Rahul Singh", role: "Backend Dev at Amazon", avatar: "RS" },
  ];

  const metrics: Metric[] = [
    { number: "2000+", description: "Learners across 18 states" },
    { number: "95%", description: "Job placement rate" },
    { number: "500+", description: "Companies hiring our graduates" },
    { number: "₹12L", description: "Average salary package" },
  ];

  const allCards: CardItem[] = [
    { type: 'student', data: studentProfiles[0] },
    { type: 'metric', data: metrics[0] },
    { type: 'student', data: studentProfiles[1] },
    { type: 'metric', data: metrics[1] },
    { type: 'student', data: studentProfiles[2] },
    { type: 'metric', data: metrics[2] },
    { type: 'student', data: studentProfiles[3] },
    { type: 'metric', data: metrics[3] },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8">
      {/* Main Content Container */}
      <div className="flex flex-col items-center w-full max-w-4xl">
        
        {/* Login Panel */}
        <Card className="w-full max-w-md p-12 text-center shadow-lg">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img 
              src="/lovable-uploads/e9f9f8b0-7112-47b9-8664-85f7a8319bb5.png" 
              alt="Zuvy" 
              className="h-16 w-16"
            />
          </div>

          {/* Headline */}
          <h1 className="text-3xl font-heading font-bold text-foreground mb-4">
            Build Skills of Future in Tech
          </h1>

          {/* Tagline */}
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Master in-demand programming skills and step into a world of opportunities. Start learning today!
          </p>

          {/* Google Login Button */}
          <Button 
            onClick={handleGoogleLogin}
            className="w-full h-12 text-base font-medium"
            size="lg"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Login with Google
          </Button>
        </Card>

        {/* Metrics Section */}
        <div className="mt-20 w-full">
          {/* Desktop Grid Layout */}
          <div className="hidden md:block">
            {/* First Row - 5 cards */}
            <div className="flex justify-center gap-4 mb-4">
              {allCards.slice(0, 5).map((card, index) => (
                <div key={index}>
                  {card.type === 'student' ? (
                    <Card className="p-4 bg-secondary/20 border-secondary/30 min-w-[180px]">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback className="bg-secondary text-secondary-foreground">
                            {card.data.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-left">
                          <p className="font-semibold text-secondary-foreground text-sm">
                            {card.data.name}
                          </p>
                          <p className="text-xs text-secondary-foreground/80">
                            {card.data.role}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ) : (
                    <Card className="p-4 bg-accent/20 border-accent/30 min-w-[180px]">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-accent-foreground mb-1">
                          {card.data.number}
                        </p>
                        <p className="text-xs text-accent-foreground/80">
                          {card.data.description}
                        </p>
                      </div>
                    </Card>
                  )}
                </div>
              ))}
            </div>

            {/* Second Row - 3 cards centered */}
            <div className="flex justify-center gap-4">
              {allCards.slice(5, 8).map((card, index) => (
                <div key={index + 5}>
                  {card.type === 'student' ? (
                    <Card className="p-4 bg-secondary/20 border-secondary/30 min-w-[180px]">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback className="bg-secondary text-secondary-foreground">
                            {card.data.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-left">
                          <p className="font-semibold text-secondary-foreground text-sm">
                            {card.data.name}
                          </p>
                          <p className="text-xs text-secondary-foreground/80">
                            {card.data.role}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ) : (
                    <Card className="p-4 bg-accent/20 border-accent/30 min-w-[180px]">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-accent-foreground mb-1">
                          {card.data.number}
                        </p>
                        <p className="text-xs text-accent-foreground/80">
                          {card.data.description}
                        </p>
                      </div>
                    </Card>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Scrollable Layout */}
          <div className="md:hidden relative">
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4" style={{
              maskImage: 'linear-gradient(to right, black 80%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to right, black 80%, transparent 100%)'
            }}>
              {allCards.map((card, index) => (
                <div key={index} className="flex-shrink-0">
                  {card.type === 'student' ? (
                    <Card className="p-4 bg-secondary/20 border-secondary/30 w-[160px]">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback className="bg-secondary text-secondary-foreground">
                            {card.data.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-left">
                          <p className="font-semibold text-secondary-foreground text-sm">
                            {card.data.name}
                          </p>
                          <p className="text-xs text-secondary-foreground/80">
                            {card.data.role}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ) : (
                    <Card className="p-4 bg-accent/20 border-accent/30 w-[160px]">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-accent-foreground mb-1">
                          {card.data.number}
                        </p>
                        <p className="text-xs text-accent-foreground/80">
                          {card.data.description}
                        </p>
                      </div>
                    </Card>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
