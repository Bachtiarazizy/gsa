"use cient";

import React, { useState, useEffect } from "react";
import Link from "next/link";

const StudentDiscussionPage = () => {
  // Sample discussions data - replace with your actual data fetching logic
  const [discussions, setDiscussions] = useState<{ id: number; title: string; date: string; replies: number; author: string; excerpt: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating API call to fetch discussions
    const fetchDiscussions = async () => {
      try {
        // Replace with your actual API endpoint
        // const response = await fetch('/api/student/discussions');
        // const data = await response.json();
        // setDiscussions(data);

        // Sample data for demonstration
        setDiscussions([
          { id: 1, title: "Assignment Help - Math 101", date: "2025-02-15", replies: 12, author: "John Doe", excerpt: "Can anyone explain the calculus problem on page 45?" },
          { id: 2, title: "Study Group for Biology Final", date: "2025-02-16", replies: 8, author: "Jane Smith", excerpt: "I'm organizing a study group for the upcoming biology final. Anyone interested?" },
          { id: 3, title: "Computer Science Project Partners", date: "2025-02-17", replies: 5, author: "Alex Johnson", excerpt: "Looking for a partner for the CS400 final project. I'm thinking of building a mobile app." },
        ]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching discussions:", error);
        setLoading(false);
      }
    };

    fetchDiscussions();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Student Discussions</h1>
          <p className="mt-4 text-lg text-gray-500">Join conversations, ask questions, and connect with your peers.</p>
          <button className="mt-6 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Start New Discussion
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <p className="text-gray-500">Loading discussions...</p>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {discussions.map((discussion) => (
                <li key={discussion.id}>
                  <Link href={`/student/discussion/${discussion.id}`}>
                    <div className="block hover:bg-gray-50 transition duration-150 ease-in-out">
                      <div className="px-4 py-6 sm:px-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium text-indigo-600 truncate">{discussion.title}</h3>
                          <div className="ml-2 flex-shrink-0 flex">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">{discussion.replies} replies</span>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <p className="text-sm text-gray-700 line-clamp-2">{discussion.excerpt}</p>
                        </div>
                        <div className="mt-3 flex justify-between items-center text-sm text-gray-500">
                          <div>
                            <span className="font-medium">{discussion.author}</span>
                          </div>
                          <div>Posted on {new Date(discussion.date).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex justify-center mt-8">
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              <span className="sr-only">Previous</span>← Previous
            </a>
            <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
              1
            </a>
            <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
              2
            </a>
            <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
              3
            </a>
            <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              Next →<span className="sr-only">Next</span>
            </a>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default StudentDiscussionPage;
