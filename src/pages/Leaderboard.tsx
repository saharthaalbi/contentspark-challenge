import { useMemo } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { LeaderboardItem } from '@/components/LeaderboardItem';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { leaderboardData, aiUsers } from '@/data/mockData';
import { Trophy, Medal, TrendingUp, Calendar, Users } from 'lucide-react';

export default function Leaderboard() {
  const { user } = useAuth();

  // Add current user to leaderboard if they have points
  const fullLeaderboard = useMemo(() => {
    if (!user || user.totalPoints === 0) return leaderboardData;

    const userEntry = {
      rank: 0,
      user: user,
      dailyPoints: user.totalPoints,
      dailyPercentage: 75,
      tasksCompleted: user.tasksCompleted,
    };

    const combined = [...leaderboardData, userEntry];
    return combined
      .sort((a, b) => b.dailyPoints - a.dailyPoints)
      .map((entry, index) => ({ ...entry, rank: index + 1 }));
  }, [user, leaderboardData]);

  const topThree = fullLeaderboard.slice(0, 3);
  const restOfLeaderboard = fullLeaderboard.slice(3);

  const stats = {
    totalParticipants: fullLeaderboard.length,
    totalPoints: fullLeaderboard.reduce((acc, e) => acc + e.dailyPoints, 0),
    averageScore: Math.round(
      fullLeaderboard.reduce((acc, e) => acc + e.dailyPercentage, 0) / fullLeaderboard.length
    ),
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container py-8">
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="h-8 w-8 text-warning" />
            <h1 className="text-3xl font-bold">Leaderboard</h1>
          </div>
          <p className="text-muted-foreground">
            See who's crushing it today! Rankings reset daily at midnight.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Participants Today</p>
                  <p className="text-2xl font-bold">{stats.totalParticipants}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Points Earned</p>
                  <p className="text-2xl font-bold text-gradient-primary">{stats.totalPoints}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center">
                  <Medal className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Average Score</p>
                  <p className="text-2xl font-bold">{stats.averageScore}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top 3 Podium */}
        <Card className="mb-8 overflow-hidden animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <CardHeader className="bg-gradient-hero text-primary-foreground">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Today's Champions
              </CardTitle>
              <Badge className="bg-white/20 text-white hover:bg-white/30">
                <Calendar className="h-3 w-3 mr-1" />
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-8 pb-6">
            <div className="flex justify-center items-end gap-4 md:gap-8">
              {/* 2nd Place */}
              {topThree[1] && (
                <div className="flex flex-col items-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  <div className="relative mb-3">
                    <img
                      src={topThree[1].user.avatar}
                      alt={topThree[1].user.username}
                      className="h-20 w-20 rounded-full ring-4 ring-gray-400"
                    />
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-8 w-8 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold">
                      2
                    </div>
                  </div>
                  <p className="font-semibold text-sm mt-2 text-center">{topThree[1].user.username}</p>
                  <p className="text-lg font-bold text-gradient-primary">{topThree[1].dailyPoints}</p>
                  <div className="h-20 w-24 bg-gray-400/20 rounded-t-lg mt-2" />
                </div>
              )}

              {/* 1st Place */}
              {topThree[0] && (
                <div className="flex flex-col items-center animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                  <div className="text-4xl mb-2 animate-bounce-subtle">👑</div>
                  <div className="relative mb-3">
                    <img
                      src={topThree[0].user.avatar}
                      alt={topThree[0].user.username}
                      className="h-24 w-24 rounded-full ring-4 ring-yellow-500 shadow-lg"
                    />
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-8 w-8 rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold">
                      1
                    </div>
                  </div>
                  <p className="font-bold text-center mt-2">{topThree[0].user.username}</p>
                  <p className="text-2xl font-bold text-gradient-primary">{topThree[0].dailyPoints}</p>
                  <div className="h-28 w-28 bg-yellow-500/20 rounded-t-lg mt-2" />
                </div>
              )}

              {/* 3rd Place */}
              {topThree[2] && (
                <div className="flex flex-col items-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                  <div className="relative mb-3">
                    <img
                      src={topThree[2].user.avatar}
                      alt={topThree[2].user.username}
                      className="h-16 w-16 rounded-full ring-4 ring-amber-600"
                    />
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-8 w-8 rounded-full bg-amber-600 flex items-center justify-center text-white font-bold">
                      3
                    </div>
                  </div>
                  <p className="font-semibold text-sm mt-2 text-center">{topThree[2].user.username}</p>
                  <p className="text-lg font-bold text-gradient-primary">{topThree[2].dailyPoints}</p>
                  <div className="h-14 w-20 bg-amber-600/20 rounded-t-lg mt-2" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Full Leaderboard */}
        <Card className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <CardHeader>
            <CardTitle>Full Rankings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {fullLeaderboard.map((entry, index) => (
              <div
                key={entry.user.id}
                className="animate-fade-in"
                style={{ animationDelay: `${0.05 * index}s` }}
              >
                <LeaderboardItem
                  entry={entry}
                  isCurrentUser={entry.user.id === user?.id}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
