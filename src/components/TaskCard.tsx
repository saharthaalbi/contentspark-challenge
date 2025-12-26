import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Task } from '@/types';
import { categoryIcons, difficultyColors } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { Clock, Send, Sparkles, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface TaskCardProps {
  task: Task;
  onSubmit: (taskId: string, content: string) => Promise<{ points: number; percentage: number; feedback: string }>;
  isCompleted?: boolean;
}

export function TaskCard({ task, onSubmit, isCompleted = false }: TaskCardProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ points: number; percentage: number; feedback: string } | null>(null);
  const { updateUserPoints, incrementTasksCompleted } = useAuth();

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast.error('Please write something before submitting!');
      return;
    }

    setIsSubmitting(true);
    try {
      const submissionResult = await onSubmit(task.id, content);
      setResult(submissionResult);
      updateUserPoints(submissionResult.points);
      incrementTasksCompleted();
      toast.success(`Great job! You earned ${submissionResult.points} points!`);
    } catch (error) {
      toast.error('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const timeLeft = Math.max(0, Math.floor((new Date(task.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60)));

  return (
    <Card className={cn(
      'overflow-hidden transition-all duration-300',
      result && 'ring-2 ring-success/50',
      isCompleted && 'opacity-60'
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{categoryIcons[task.category]}</span>
            <div>
              <CardTitle className="text-lg">{task.title}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={cn('text-xs font-medium', difficultyColors[task.difficulty])}>
                  {task.difficulty}
                </Badge>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {timeLeft}h left
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-sm text-muted-foreground">Max Points</span>
            <span className="text-xl font-bold text-gradient-primary">{task.maxPoints}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{task.description}</p>

        {!result ? (
          <>
            <Textarea
              placeholder="Write your content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[120px] resize-none"
              disabled={isSubmitting || isCompleted}
            />
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !content.trim() || isCompleted}
              className="w-full gap-2"
              variant="success"
            >
              {isSubmitting ? (
                <>
                  <Sparkles className="h-4 w-4 animate-spin" />
                  AI is evaluating...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Submit for Points
                </>
              )}
            </Button>
          </>
        ) : (
          <div className="space-y-4 animate-fade-in">
            <div className="rounded-xl bg-gradient-card p-4 border border-success/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  <span className="font-semibold">Submission Complete!</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 rounded-lg bg-success/10">
                  <div className="text-3xl font-bold text-success animate-score-pop">{result.points}</div>
                  <div className="text-xs text-muted-foreground">Points Earned</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-primary/10">
                  <div className="text-3xl font-bold text-primary animate-score-pop" style={{ animationDelay: '0.1s' }}>
                    {result.percentage}%
                  </div>
                  <div className="text-xs text-muted-foreground">Score</div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  AI Feedback
                </h4>
                <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                  {result.feedback}
                </p>
              </div>
            </div>

            <div className="rounded-lg bg-muted/50 p-3">
              <h4 className="text-sm font-medium mb-2">Your Submission:</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{content}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
