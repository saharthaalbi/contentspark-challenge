import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { TaskCard } from '@/components/TaskCard';
import { SubmissionCard } from '@/components/SubmissionCard';
import { ProgressRing } from '@/components/ProgressRing';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { dailyTasks, aiSubmissions, leaderboardData } from '@/data/mockData';
import { ArrowRight, Trophy, Target, Flame, Users, Sparkles } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());

  const handleTaskSubmit = async (taskId: string, content: string) => {
    // Simulate AI evaluation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const baseScore = Math.floor(Math.random() * 30) + 60; // 60-90
    const points = Math.floor((baseScore / 100) * dailyTasks.find(t => t.id === taskId)!.maxPoints);
    
    setCompletedTasks(prev => new Set([...prev, taskId]));
    
    return {
      points,
      percentage: baseScore,
      feedback: getRandomFeedback(baseScore),
    };
  };

  const getRandomFeedback = (score: number) => {
    const feedbacks = {
      high: [
        'Excellent work! Your content is engaging and well-structured.',
        'Great creativity! This would definitely grab attention.',
        'Very polished submission with clear messaging.',
      ],
      medium: [
        'Good effort! Consider adding more specific details.',
        'Solid foundation. Try making the call-to-action stronger.',
        'Nice work! A bit more personality could make it stand out.',
      ],
      low: [
        'Good start! Focus on being more specific and actionable.',
        'Consider restructuring for better flow and engagement.',
        'Try adding more emotion or urgency to capture attention.',
      ],
    };

    const category = score >= 85 ? 'high' : score >= 70 ? 'medium' : 'low';
    const options = feedbacks[category];
    return options[Math.floor(Math.random() * options.length)];
  };

  const tasksLeft = dailyTasks.length - completedTasks.size;
  const progressPercentage = (completedTasks.size / dailyTasks.length) * 100;

  const topPerformers = useMemo(() => leaderboardData.slice(0, 3), []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, <span className="text-gradient-primary">{user?.username}</span>! 👋
          </h1>
          <p className="text-muted-foreground">
            Ready to boost your content skills today? You have {tasksLeft} tasks waiting.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Today's Progress</p>
                  <p className="text-2xl font-bold">{completedTasks.size}/{dailyTasks.length}</p>
                </div>
                <ProgressRing progress={progressPercentage} size={60} strokeWidth={6}>
                  <Target className="h-5 w-5 text-primary" />
                </ProgressRing>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Points</p>
                  <p className="text-2xl font-bold text-gradient-primary">{user?.totalPoints}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Current Streak</p>
                  <p className="text-2xl font-bold">{user?.streak} days</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-warning/10 flex items-center justify-center">
                  <Flame className="h-6 w-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tasks Completed</p>
                  <p className="text-2xl font-bold">{user?.tasksCompleted}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Tasks Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Today's Tasks
              </h2>
              <Link to="/tasks">
                <Button variant="ghost" className="gap-2">
                  View All <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
              {dailyTasks.slice(0, 2).map((task, index) => (
                <div
                  key={task.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${0.1 * index}s` }}
                >
                  <TaskCard
                    task={task}
                    onSubmit={handleTaskSubmit}
                    isCompleted={completedTasks.has(task.id)}
                  />
                </div>
              ))}
            </div>

            {/* Community Submissions */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Users className="h-5 w-5 text-secondary" />
                  Community Submissions
                </h2>
                <Badge variant="secondary" className="gap-1">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
                  </span>
                  Live
                </Badge>
              </div>

              <div className="space-y-4">
                {aiSubmissions.slice(0, 2).map((submission, index) => {
                  const task = dailyTasks.find(t => t.id === submission.taskId);
                  return (
                    <div
                      key={submission.id}
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${0.1 * index}s` }}
                    >
                      <SubmissionCard
                        submission={submission}
                        taskTitle={task?.title || 'Unknown Task'}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Leaderboard Preview */}
            <Card className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-warning" />
                    Top Performers
                  </CardTitle>
                  <Link to="/leaderboard">
                    <Button variant="ghost" size="sm">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {topPerformers.map((entry, index) => (
                  <div
                    key={entry.user.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <span className="text-lg font-bold text-muted-foreground w-6">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                    </span>
                    <img
                      src={entry.user.avatar}
                      alt={entry.user.username}
                      className="h-8 w-8 rounded-full ring-2 ring-border"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate text-sm">{entry.user.username}</p>
                      <p className="text-xs text-muted-foreground">{entry.dailyPoints} pts</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Badges */}
            {user?.badges && user.badges.length > 0 && (
              <Card className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <CardHeader>
                  <CardTitle className="text-lg">Your Badges</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {user.badges.map((badge) => (
                      <div
                        key={badge.id}
                        className="flex items-center gap-2 px-3 py-2 rounded-full bg-muted"
                        title={badge.description}
                      >
                        <span className="text-lg">{badge.icon}</span>
                        <span className="text-sm font-medium">{badge.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Tips */}
            <Card className="bg-gradient-card animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Quick Tip
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  💡 Consistency is key! Complete at least one task daily to maintain your streak and climb the leaderboard.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
