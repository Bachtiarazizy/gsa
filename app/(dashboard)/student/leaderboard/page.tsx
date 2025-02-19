"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Medal, Trophy, Award } from "lucide-react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface LeaderboardEntry {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  university: string;
  completedCourses: number;
  completedChapters: number;
  assessmentsPassed: number;
  totalScore: number;
}

interface UserStats {
  rank: number;
  stats: LeaderboardEntry;
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

        // Fetch current user's stats
        const userStatsResponse = await fetch(`/api/users/${userId}/stats`);
        if (!userStatsResponse.ok) throw new Error("Failed to fetch user stats");
        const userStatsData = await userStatsResponse.json();

        // Sort leaderboard by total score
        const sortedLeaderboard = leaderboardData.sort((a: LeaderboardEntry, b: LeaderboardEntry) => b.totalScore - a.totalScore);

        // Find user's rank
        const userRank = sortedLeaderboard.findIndex((entry: LeaderboardEntry) => entry.userId === userId) + 1;

        setLeaderboard(sortedLeaderboard);
        setUserStats({
          rank: userRank,
          stats: userStatsData,
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

      {userStats && (
        <Card className="mb-6 bg-primary/5">
          <CardHeader>
            <CardTitle>Your Ranking</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <RankIcon rank={userStats.rank} />
              <span className="font-semibold">#{userStats.rank} Place</span>
              {userStats.rank <= 3 && <Award className="h-5 w-5 text-primary" />}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {leaderboard.map((entry, index) => (
          <Card key={entry.id} className={`${entry.userId === userId ? "border-primary" : ""}`}>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <RankIcon rank={index + 1} />
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{entry.firstName.charAt(0) + entry.lastName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {entry.firstName} {entry.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">{entry.university}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:flex items-center gap-4 md:gap-8 pl-14 md:pl-0">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Courses</p>
                    <p className="font-medium">{entry.completedCourses}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Chapters</p>
                    <p className="font-medium">{entry.completedChapters}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Assessments</p>
                    <p className="font-medium">{entry.assessmentsPassed}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Score</p>
                    <p className="font-medium">{entry.totalScore}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StudentLeaderboardPage;
