import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { TaskCard } from '@/components/TaskCard';
import { SubmissionCard } from '@/components/SubmissionCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { dailyTasks, aiSubmissions, categoryIcons } from '@/data/mockData';
import { ListTodo, Users, Filter } from 'lucide-react';

export default function Tasks() {
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleTaskSubmit = async (taskId: string, content: string) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const baseScore = Math.floor(Math.random() * 30) + 60;
    const task = dailyTasks.find(t => t.id === taskId)!;
    const points = Math.floor((baseScore / 100) * task.maxPoints);
    
    setCompletedTasks(prev => new Set([...prev, taskId]));
    
    const feedbacks = [
      'Great work! Your content shows creativity and clear messaging.',
      'Well done! Consider adding more emotional appeal next time.',
      'Solid submission! The structure is good, try varying sentence lengths.',
      'Nice effort! Adding specific numbers or data could strengthen this.',
    ];
    
    return {
      points,
      percentage: baseScore,
      feedback: feedbacks[Math.floor(Math.random() * feedbacks.length)],
    };
  };

  const categories = [...new Set(dailyTasks.map(t => t.category))];
  
  const filteredTasks = selectedCategory
    ? dailyTasks.filter(t => t.category === selectedCategory)
    : dailyTasks;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold mb-2">Daily Tasks</h1>
          <p className="text-muted-foreground">
            Complete tasks to earn points and improve your content skills
          </p>
        </div>

        <Tabs defaultValue="tasks" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="tasks" className="gap-2">
              <ListTodo className="h-4 w-4" />
              Tasks
            </TabsTrigger>
            <TabsTrigger value="submissions" className="gap-2">
              <Users className="h-4 w-4" />
              Community
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-6 animate-fade-in">
            {/* Category Filter */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Filter className="h-4 w-4" />
                Filter:
              </div>
              <Button
                variant={selectedCategory === null ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(null)}
              >
                All
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="gap-2"
                >
                  <span>{categoryIcons[category]}</span>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </div>

            {/* Task Stats */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gradient-primary">
                  {completedTasks.size}
                </span>
                <span className="text-sm text-muted-foreground">/ {dailyTasks.length} completed</span>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {dailyTasks.reduce((acc, t) => acc + t.maxPoints, 0)} max points available
                </Badge>
              </div>
            </div>

            {/* Tasks Grid */}
            <div className="grid gap-6 md:grid-cols-2">
              {filteredTasks.map((task, index) => (
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
          </TabsContent>

          <TabsContent value="submissions" className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Community Submissions</h2>
                <p className="text-sm text-muted-foreground">
                  See what others are creating and leave feedback
                </p>
              </div>
              <Badge variant="secondary" className="gap-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
                </span>
                Live Feed
              </Badge>
            </div>

            <div className="space-y-4">
              {aiSubmissions.map((submission, index) => {
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
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
