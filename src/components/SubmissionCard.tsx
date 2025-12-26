import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Submission, Comment } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { MessageCircle, Send, Bot, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface SubmissionCardProps {
  submission: Submission;
  taskTitle: string;
}

export function SubmissionCard({ submission, taskTitle }: SubmissionCardProps) {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>(submission.comments);

  const handleAddComment = () => {
    if (!newComment.trim() || !user) return;

    const comment: Comment = {
      id: `comment-${Date.now()}`,
      submissionId: submission.id,
      userId: user.id,
      user: user,
      content: newComment,
      createdAt: new Date(),
    };

    setComments([...comments, comment]);
    setNewComment('');
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-10 w-10 ring-2 ring-border">
                <AvatarImage src={submission.user.avatar} alt={submission.user.username} />
                <AvatarFallback>{submission.user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              {submission.user.isAI && (
                <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-secondary flex items-center justify-center">
                  <Bot className="h-3 w-3 text-secondary-foreground" />
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{submission.user.username}</span>
                {submission.user.isAI && (
                  <Badge variant="secondary" className="text-xs">AI Demo</Badge>
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(submission.createdAt), { addSuffix: true })}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="flex items-center gap-1">
                <span className="text-xl font-bold text-success">{submission.points}</span>
                <span className="text-xs text-muted-foreground">pts</span>
              </div>
              <div className="text-xs text-muted-foreground">{submission.percentage}% score</div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
          Task: {taskTitle}
        </div>

        <div className="rounded-lg bg-muted/50 p-4">
          <p className="text-sm whitespace-pre-wrap">{submission.content}</p>
        </div>

        {submission.feedback && (
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
            <div className="flex items-center gap-2 text-xs font-medium text-primary mb-2">
              <Sparkles className="h-3 w-3" />
              AI Feedback
            </div>
            <p className="text-sm text-muted-foreground">{submission.feedback}</p>
          </div>
        )}

        <div className="pt-2 border-t border-border/50">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="gap-2 text-muted-foreground"
          >
            <MessageCircle className="h-4 w-4" />
            {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
          </Button>

          {showComments && (
            <div className="mt-4 space-y-4 animate-fade-in">
              {comments.length > 0 ? (
                <div className="space-y-3">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.user.avatar} alt={comment.user.username} />
                        <AvatarFallback>{comment.user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{comment.user.username}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No comments yet. Be the first to comment!
                </p>
              )}

              <div className="flex gap-2">
                <Input
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                />
                <Button size="icon" onClick={handleAddComment} disabled={!newComment.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
