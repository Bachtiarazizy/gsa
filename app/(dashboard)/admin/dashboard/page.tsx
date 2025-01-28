import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, DollarSign, Clock } from "lucide-react";
import Link from "next/link";
import { getDashboardData } from "@/lib/actions/course";
import { formatDistance } from "date-fns";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

async function AdminPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const { totalCourses, totalStudents, totalRevenue, recentActivities, growth } = await getDashboardData();

  // Parse growth values as numbers
  const courseGrowth = parseFloat(growth.courses);
  const studentGrowth = parseFloat(growth.students);

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <div className="ml-auto flex items-center space-x-4"></div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Here&apos;s an overview of your courses and performance.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/admin/courses" className="block">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Your Courses</CardTitle>
                  <BookOpen className="h-6 w-6 text-blue-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-2xl font-bold">{totalCourses}</p>
                    <p className="text-sm text-muted-foreground">Published Courses</p>
                  </div>
                  {courseGrowth > 0 && (
                    <div className="flex items-center text-green-500">
                      <span className="text-sm font-medium">+{growth.courses}% this month</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Students</CardTitle>
                <Users className="h-6 w-6 text-purple-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-2xl font-bold">{totalStudents}</p>
                  <p className="text-sm text-muted-foreground">Total Enrolled</p>
                </div>
                {studentGrowth > 0 && (
                  <div className="flex items-center text-green-500">
                    <span className="text-sm font-medium">+{growth.students}% growth</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Revenue</CardTitle>
                <DollarSign className="h-6 w-6 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Recent Activity</CardTitle>
                <Clock className="h-6 w-6 text-orange-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No recent activity</p>
                ) : (
                  recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center">
                      <div className="ml-4">
                        <p className="text-sm font-medium">{activity.isPublished ? "Course Published" : "Course Created"}</p>
                        <p className="text-sm text-muted-foreground">{activity.title}</p>
                      </div>
                      <div className="ml-auto text-sm text-muted-foreground">{formatDistance(new Date(activity.createdAt), new Date(), { addSuffix: true })}</div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
