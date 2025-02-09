"use client";

import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import DiscussionComponent from "./discussion";
import { Discussion, Reply } from "@/lib/types";

interface ClientDiscussionsProps {
  initialDiscussions: Discussion[];
  userId: string;
  chapterId: string;
}

const ClientDiscussions = ({ initialDiscussions, userId, chapterId }: ClientDiscussionsProps) => {
  const [discussions, setDiscussions] = useState<Discussion[]>(
    initialDiscussions.map((discussion) => ({
      ...discussion,
      replies: discussion.replies || [],
      likes: discussion.likes || [],
    }))
  );
  const [newDiscussion, setNewDiscussion] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReply = async (discussionId: string, content: string) => {
    try {
      const response = await fetch("/api/discussions/reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          discussionId,
          content,
          chapterId,
        }),
      });

      if (!response.ok) throw new Error("Failed to add reply");

      const newReply: Reply = await response.json();

      setDiscussions((current) =>
        current.map((discussion) => {
          if (discussion.id === discussionId) {
            return {
              ...discussion,
              replies: [...(discussion.replies || []), newReply],
            };
          }
          return discussion;
        })
      );
    } catch (error) {
      console.error("Error adding reply:", error);
      // You might want to add toast notification here
    }
  };

  const handleLike = async (discussionId: string) => {
    try {
      const response = await fetch("/api/discussions/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          discussionId,
          chapterId,
        }),
      });

      if (!response.ok) throw new Error("Failed to like discussion");

      const updatedDiscussion: Discussion = await response.json();

      setDiscussions((current) => current.map((discussion) => (discussion.id === discussionId ? { ...updatedDiscussion, replies: updatedDiscussion.replies || [] } : discussion)));
    } catch (error) {
      console.error("Error liking discussion:", error);
    }
  };

  const handleLikeReply = async (replyId: string) => {
    try {
      const response = await fetch("/api/discussions/reply/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          replyId,
          chapterId,
        }),
      });

      if (!response.ok) throw new Error("Failed to like reply");

      const { discussionId, updatedReply }: { discussionId: string; updatedReply: Reply } = await response.json();

      setDiscussions((current) =>
        current.map((discussion) => {
          if (discussion.id === discussionId) {
            return {
              ...discussion,
              replies: (discussion.replies || []).map((reply) => (reply.id === replyId ? updatedReply : reply)),
            };
          }
          return discussion;
        })
      );
    } catch (error) {
      console.error("Error liking reply:", error);
    }
  };

  const handleAddDiscussion = async () => {
    if (!newDiscussion.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/discussions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newDiscussion,
          chapterId,
        }),
      });

      if (!response.ok) throw new Error("Failed to add discussion");

      const newDiscussionData: Discussion = await response.json();
      setDiscussions((current) => [...current, { ...newDiscussionData, replies: [], likes: [] }]);
      setNewDiscussion(""); // Clear the input after successful submission
    } catch (error) {
      console.error("Error adding discussion:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Separator className="my-8" />
      <div className="flex flex-col gap-y-4">
        <h3 className="text-xl font-semibold">Discussion</h3>
        <div className="mb-4">
          <textarea className="w-full p-2 border rounded-md" placeholder="Start a new discussion..." rows={3} value={newDiscussion} onChange={(e) => setNewDiscussion(e.target.value)} />
          <button className="mt-2 px-4 py-2 bg-primary text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed" onClick={handleAddDiscussion} disabled={isSubmitting || !newDiscussion.trim()}>
            {isSubmitting ? "Posting..." : "Post Discussion"}
          </button>
        </div>
        <DiscussionComponent discussions={discussions} userId={userId} onReply={handleReply} onLike={handleLike} onLikeReply={handleLikeReply} />
      </div>
    </>
  );
};

export default ClientDiscussions;
