import React, { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { HeartIcon, MessageCircle, Send } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Discussion } from "@/lib/types";

interface DiscussionProps {
  discussions: Discussion[];
  userId: string;
  onReply: (discussionId: string, content: string) => Promise<void>;
  onLike: (discussionId: string) => Promise<void>;
  onLikeReply: (replyId: string) => Promise<void>;
}

const DiscussionComponent = ({ discussions, userId, onReply, onLike, onLikeReply }: DiscussionProps) => {
  const [replyContents, setReplyContents] = useState<Record<string, string>>({});
  const [expandedDiscussions, setExpandedDiscussions] = useState<Record<string, boolean>>({});

  const handleReplySubmit = async (discussionId: string) => {
    const content = replyContents[discussionId];
    if (!content?.trim()) return;

    await onReply(discussionId, content);
    setReplyContents((prev) => ({ ...prev, [discussionId]: "" }));
  };

  const toggleDiscussion = (discussionId: string) => {
    setExpandedDiscussions((prev) => ({
      ...prev,
      [discussionId]: !prev[discussionId],
    }));
  };

  const isLikedByUser = (likes: { userId: string }[] | undefined, userId: string) => {
    return likes?.some((like) => like.userId === userId) ?? false;
  };

  return (
    <div className="space-y-6">
      {discussions.map((discussion) => (
        <Card key={discussion.id} className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <div className="flex items-center space-x-4">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{discussion.userId.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">User-{discussion.userId.slice(0, 4)}</p>
                <p className="text-sm text-muted-foreground">{formatDistanceToNow(new Date(discussion.createdAt), { addSuffix: true })}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="flex items-center gap-1" onClick={() => onLike(discussion.id)}>
              <HeartIcon className={`h-4 w-4 ${isLikedByUser(discussion.likes, userId) ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
              <span className="text-xs">{discussion.likes?.length ?? 0}</span>
            </Button>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{discussion.content}</p>

            <div className="mt-4">
              <Button variant="ghost" size="sm" className="flex items-center gap-2" onClick={() => toggleDiscussion(discussion.id)}>
                <MessageCircle className="h-4 w-4" />
                <span className="text-xs">{discussion.replies?.length ?? 0} replies</span>
              </Button>
            </div>

            {expandedDiscussions[discussion.id] && discussion.replies && (
              <div className="mt-4 space-y-4">
                {discussion.replies.map((reply) => (
                  <div key={reply.id} className="ml-8 border-l-2 pl-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>{reply.userId.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <p className="text-sm font-medium">User-{reply.userId.slice(0, 4)}</p>
                        <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="flex items-center gap-1" onClick={() => onLikeReply(reply.id)}>
                        <HeartIcon className={`h-3 w-3 ${isLikedByUser(reply.likes, userId) ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
                        <span className="text-xs">{reply.likes?.length ?? 0}</span>
                      </Button>
                    </div>
                    <p className="mt-2 text-sm">{reply.content}</p>
                  </div>
                ))}

                <div className="ml-8 mt-4">
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Write a reply..."
                      value={replyContents[discussion.id] || ""}
                      onChange={(e) =>
                        setReplyContents((prev) => ({
                          ...prev,
                          [discussion.id]: e.target.value,
                        }))
                      }
                      className="min-h-[60px] flex-1"
                    />
                    <Button size="icon" onClick={() => handleReplySubmit(discussion.id)} disabled={!replyContents[discussion.id]?.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DiscussionComponent;
