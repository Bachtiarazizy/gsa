import React from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, DollarSign, BarChart2 } from "lucide-react";

const AdminDashboard = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/dashboard/admin/courses" className="block">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Courses</CardTitle>
                <BookOpen className="h-6 w-6 text-blue-500" />
              </div>
              <CardDescription>Manage your course catalog</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-sm text-muted-foreground">Active Courses</p>
                </div>
                <div className="flex items-center text-green-500">
                  <span className="text-sm font-medium">+2 this month</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Students</CardTitle>
              <Users className="h-6 w-6 text-purple-500" />
            </div>
            <CardDescription>Student enrollment analytics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-2xl font-bold">1,234</p>
                <p className="text-sm text-muted-foreground">Total Students</p>
              </div>
              <div className="flex items-center text-green-500">
                <span className="text-sm font-medium">+15% growth</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Revenue</CardTitle>
              <DollarSign className="h-6 w-6 text-green-500" />
            </div>
            <CardDescription>Financial overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-2xl font-bold">$12,345</p>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
              </div>
              <div className="flex items-center text-green-500">
                <span className="text-sm font-medium">+8% this month</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Analytics</CardTitle>
              <BarChart2 className="h-6 w-6 text-orange-500" />
            </div>
            <CardDescription>Performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-2xl font-bold">89%</p>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
              </div>
              <div className="flex items-center text-green-500">
                <span className="text-sm font-medium">+5% improvement</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
