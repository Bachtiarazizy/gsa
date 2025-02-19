"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import { MessageCircle, ThumbsUp, BookOpen, Layout } from "lucide-react";

interface Discussion {
  id: string;
  userId: string;
  content: string;
  courseId: string | null;
  chapterId: string | null;
  createdAt: string;
  updatedAt: string;
  course: {
    title: string;
  } | null;
  chapter: {
    title: string;
  } | null;
  replies: {
    id: string;
    content: string;
    userId: string;
    createdAt: string;
    userProfile?: {
      firstName: string;
      lastName: string;
    } | null;
  }[];
  likes: {
    userId: string;
  }[];
  userProfile?: {
    firstName: string;
    lastName: string;
  } | null;
}

interface CourseChaptersPageProps {
  params: {
    courseId: string;
    chapterId?: string;
  };
}

const StudentDiscussionPage = ({ params }: CourseChaptersPageProps) => {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    const fetchDiscussions = async () => {
      try {
        const url = `/api/courses/${params.courseId}/chapters/${params.chapterId}/discussions`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch discussions");
        }
        const data = await response.json();
        setDiscussions(data);
      } catch (error) {
        setError("Failed to load discussions");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.courseId && params.chapterId) {
      fetchDiscussions();
    }
  }, [params.courseId, params.chapterId]);

  const handleNewDiscussion = () => {
    router.push(`/student/courses/${params.courseId}/chapters/${params.chapterId}/discussions/new`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getUserDisplayName = (discussion: Discussion) => {
    if (user?.id === discussion.userId) return "You";
    if (discussion.userProfile) {
      return `${discussion.userProfile.firstName} ${discussion.userProfile.lastName}`;
    }
    return "Anonymous User";
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex flex-col">
            <h1 className="text-3xl font-extrabold text-gray-900">Chapter Discussions</h1>
            {discussions[0]?.course && (
              <div className="flex items-center gap-2 mt-2 text-gray-600">
                <BookOpen size={16} />
                <span>{discussions[0].course.title}</span>
                {discussions[0]?.chapter && (
                  <>
                    <span>→</span>
                    <Layout size={16} />
                    <span>{discussions[0].chapter.title}</span>
                  </>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>

        <div className="text-center mb-12">
          <p className="mt-4 text-lg text-gray-500">Join the discussion about this chapter, ask questions, and connect with your peers.</p>
          <button
            onClick={handleNewDiscussion}
            className="mt-6 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Start New Discussion
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <p className="text-gray-500">Loading discussions...</p>
          </div>
        ) : discussions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">No discussions yet. Be the first to start a discussion!</p>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {discussions.map((discussion) => (
                <li key={discussion.id}>
                  <Link href={`/student/courses/${params.courseId}/chapters/${params.chapterId}/discussions/${discussion.id}`}>
                    <div className="block hover:bg-gray-50 transition duration-150 ease-in-out">
                      <div className="px-4 py-6 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="text-sm text-gray-700 line-clamp-2">{discussion.content}</p>
                          </div>
                          <div className="ml-2 flex items-center gap-4">
                            <span className="flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                              <MessageCircle size={14} />
                              {discussion.replies.length}
                            </span>
                            <span className="flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                              <ThumbsUp size={14} />
                              {discussion.likes.length}
                            </span>
                          </div>
                        </div>
                        <div className="mt-3 flex justify-between items-center text-sm text-gray-500">
                          <div>
                            <span className="font-medium">{getUserDisplayName(discussion)}</span>
                          </div>
                          <div>Posted on {formatDate(discussion.createdAt)}</div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDiscussionPage;
