import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { LeaderboardEntry } from '@/types';
import { cn } from '@/lib/utils';
import { Trophy, Medal, Award, Bot } from 'lucide-react';

interface LeaderboardItemProps {
  entry: LeaderboardEntry;
  isCurrentUser?: boolean;
}

const rankIcons: Record<number, { icon: React.ElementType; color: string }> = {
  1: { icon: Trophy, color: 'text-yellow-500' },
  2: { icon: Medal, color: 'text-gray-400' },
  3: { icon: Award, color: 'text-amber-600' },
};

export function LeaderboardItem({ entry, isCurrentUser = false }: LeaderboardItemProps) {
  const RankIcon = rankIcons[entry.rank]?.icon;
  const rankColor = rankIcons[entry.rank]?.color;

  return (
    <div
      className={cn(
        'flex items-center gap-4 rounded-xl p-4 transition-all duration-300',
        isCurrentUser && 'bg-primary/10 ring-2 ring-primary/30',
        !isCurrentUser && 'bg-card hover:bg-muted/50',
        entry.rank <= 3 && 'shadow-md'
      )}
    >
      <div className="flex items-center justify-center w-10">
        {RankIcon ? (
          <RankIcon className={cn('h-6 w-6', rankColor)} />
        ) : (
          <span className="text-lg font-bold text-muted-foreground">#{entry.rank}</span>
        )}
      </div>

      <div className="relative">
        <Avatar className={cn(
          'h-12 w-12 ring-2',
          entry.rank === 1 && 'ring-yellow-500',
          entry.rank === 2 && 'ring-gray-400',
          entry.rank === 3 && 'ring-amber-600',
          entry.rank > 3 && 'ring-border'
        )}>
          <AvatarImage src={entry.user.avatar} alt={entry.user.username} />
          <AvatarFallback>{entry.user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        {entry.user.isAI && (
          <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-secondary flex items-center justify-center">
            <Bot className="h-3 w-3 text-secondary-foreground" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold truncate">{entry.user.username}</span>
          {entry.user.isAI && (
            <Badge variant="secondary" className="text-xs shrink-0">AI</Badge>
          )}
          {isCurrentUser && (
            <Badge className="bg-gradient-primary text-primary-foreground text-xs shrink-0">You</Badge>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{entry.tasksCompleted} tasks</span>
          <span>•</span>
          <span>🔥 {entry.user.streak} day streak</span>
        </div>
      </div>

      <div className="text-right">
        <div className="text-2xl font-bold text-gradient-primary">{entry.dailyPoints}</div>
        <div className="text-xs text-muted-foreground">{entry.dailyPercentage}% avg</div>
      </div>
    </div>
  );
}
