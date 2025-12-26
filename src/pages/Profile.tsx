import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { ProgressRing } from '@/components/ProgressRing';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Trophy, Target, Flame, Edit, Sparkles, Calendar, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

export default function Profile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    username: user?.username || '',
    email: user?.email || '',
  });

  const handleSave = () => {
    toast.success('Profile updated successfully!');
    setIsEditing(false);
  };

  if (!user) return null;

  const levelProgress = (user.totalPoints % 500) / 5; // Progress to next level (every 500 points)
  const currentLevel = Math.floor(user.totalPoints / 500) + 1;

  const stats = [
    { label: 'Total Points', value: user.totalPoints, icon: Sparkles, color: 'text-primary' },
    { label: 'Tasks Completed', value: user.tasksCompleted, icon: Target, color: 'text-success' },
    { label: 'Current Streak', value: `${user.streak} days`, icon: Flame, color: 'text-warning' },
    { label: 'Current Level', value: currentLevel, icon: Trophy, color: 'text-secondary' },
  ];

  const recentActivity = [
    { task: 'Instagram Caption', points: 88, date: '2 hours ago' },
    { task: 'LinkedIn Post', points: 142, date: '5 hours ago' },
    { task: 'Tweet Ideas', points: 95, date: 'Yesterday' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container py-8">
        {/* Profile Header */}
        <Card className="mb-8 overflow-hidden animate-fade-in">
          <div className="h-32 bg-gradient-hero" />
          <CardContent className="relative pt-0">
            <div className="flex flex-col md:flex-row gap-6 -mt-16">
              <div className="relative">
                <Avatar className="h-32 w-32 ring-4 ring-background shadow-lg">
                  <AvatarImage src={user.avatar} alt={user.username} />
                  <AvatarFallback className="text-3xl bg-gradient-primary text-primary-foreground">
                    {user.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {currentLevel >= 3 && (
                  <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full bg-gradient-hero flex items-center justify-center shadow-lg">
                    <span className="text-lg">⭐</span>
                  </div>
                )}
              </div>

              <div className="flex-1 pt-4 md:pt-8">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold">{user.username}</h1>
                    <p className="text-muted-foreground">{user.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary">Level {currentLevel}</Badge>
                      <Badge className="bg-gradient-success text-success-foreground">
                        {user.streak} Day Streak 🔥
                      </Badge>
                    </div>
                  </div>

                  <Dialog open={isEditing} onOpenChange={setIsEditing}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        <Edit className="h-4 w-4" />
                        Edit Profile
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Profile</DialogTitle>
                        <DialogDescription>
                          Update your profile information
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <Label htmlFor="username">Username</Label>
                          <Input
                            id="username"
                            value={editData.username}
                            onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={editData.email}
                            onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                          />
                        </div>
                        <div className="flex gap-3 pt-4">
                          <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1">
                            Cancel
                          </Button>
                          <Button onClick={handleSave} className="flex-1">
                            Save Changes
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Stats Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card
                    key={stat.label}
                    className="animate-fade-in"
                    style={{ animationDelay: `${0.1 * index}s` }}
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-4">
                        <div className={`h-12 w-12 rounded-xl bg-muted flex items-center justify-center`}>
                          <Icon className={`h-6 w-6 ${stat.color}`} />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">{stat.label}</p>
                          <p className="text-2xl font-bold">{stat.value}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Recent Activity */}
            <Card className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Target className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{activity.task}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {activity.date}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-success">+{activity.points}</span>
                        <p className="text-xs text-muted-foreground">points</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Level Progress */}
            <Card className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <CardHeader>
                <CardTitle className="text-lg">Level Progress</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <ProgressRing progress={levelProgress} size={140} strokeWidth={10}>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gradient-primary">{currentLevel}</div>
                    <div className="text-xs text-muted-foreground">Level</div>
                  </div>
                </ProgressRing>
                <p className="text-sm text-muted-foreground mt-4 text-center">
                  {500 - (user.totalPoints % 500)} points to Level {currentLevel + 1}
                </p>
              </CardContent>
            </Card>

            {/* Badges */}
            <Card className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-warning" />
                  Badges Earned
                </CardTitle>
              </CardHeader>
              <CardContent>
                {user.badges && user.badges.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {user.badges.map((badge) => (
                      <div
                        key={badge.id}
                        className="flex flex-col items-center p-3 rounded-xl bg-muted/50 text-center"
                        title={badge.description}
                      >
                        <span className="text-3xl mb-2">{badge.icon}</span>
                        <span className="text-sm font-medium">{badge.name}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Complete tasks to earn badges!
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-gradient-card animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Account Info</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Member since</span>
                    <span className="font-medium">Dec 2024</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Account type</span>
                    <Badge variant="secondary">Free</Badge>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rank</span>
                    <span className="font-medium">#12</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
