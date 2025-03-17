"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Medal, Trophy, Award, BookOpen } from "lucide-react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface LeaderboardEntry {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  points: number; // Total points from all activities
}

interface UserStats {
  rank: number;
  stats: LeaderboardEntry | null;
}

const RankIcon = ({ rank }: { rank: number }) => {
  if (rank === 1) return <Trophy className="h-6 w-6 text-yellow-500" />;
  if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />;
  if (rank === 3) return <Medal className="h-6 w-6 text-amber-600" />;
  return <div className="h-6 w-6 flex items-center justify-center font-medium">{rank}</div>;
};

const StudentLeaderboardPage = () => {
  const { userId, isLoaded, isSignedIn } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        // Fetch global leaderboard
        const leaderboardResponse = await fetch("/api/leaderboard");
        if (!leaderboardResponse.ok) throw new Error("Failed to fetch leaderboard");
        const leaderboardData = await leaderboardResponse.json();

        // Sort leaderboard by points
        const sortedLeaderboard = leaderboardData.sort((a: LeaderboardEntry, b: LeaderboardEntry) => b.points - a.points);

        // Find user's stats
        const userEntry = sortedLeaderboard.find((entry: LeaderboardEntry) => entry.userId === userId);
        const userRank = userEntry ? sortedLeaderboard.findIndex((entry: LeaderboardEntry) => entry.userId === userId) + 1 : 0;

        setLeaderboard(sortedLeaderboard);
        setUserStats({
          rank: userRank,
          stats: userEntry || null,
        });
      } catch (err) {
        setError("Failed to load leaderboard. Please try again later.");
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (isLoaded && isSignedIn) {
      fetchLeaderboardData();
    }
  }, [isLoaded, isSignedIn, userId]);

  if (isLoaded && !isSignedIn) {
    redirect("/sign-in");
  }

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto flex-1 space-y-6 p-4 md:p-6">
        <Skeleton className="h-8 w-[200px] mb-6" />
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto flex-1 space-y-6 p-4 md:p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto flex-1 space-y-6 p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">Student Leaderboard</h1>

      {userStats &&
        (userStats.stats ? (
          <Card className="mb-6 bg-primary/5">
            <CardHeader>
              <CardTitle>Your Ranking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <RankIcon rank={userStats.rank} />
                <span className="font-semibold">#{userStats.rank} Place</span>
                {userStats.rank <= 3 && <Award className="h-5 w-5 text-primary" />}
                <span className="ml-auto font-semibold">{userStats.stats.points} Points</span>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-6 bg-primary/5">
            <CardHeader>
              <CardTitle>Your Ranking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <BookOpen className="h-6 w-6 text-muted-foreground" />
                <span className="text-muted-foreground">You don&apos;t have any completed courses or points yet.</span>
              </div>
            </CardContent>
          </Card>
        ))}

      <div className="space-y-4">
        {leaderboard.map((entry, index) => (
          <Card key={entry.id} className={`${entry.userId === userId ? "border-primary" : ""}`}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <RankIcon rank={index + 1} />
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{entry.firstName.charAt(0) + entry.lastName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {entry.firstName} {entry.lastName}
                    </p>
                  </div>
                </div>
                <div className="font-semibold text-lg">{entry.points} Points</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StudentLeaderboardPage;
