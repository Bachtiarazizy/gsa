// types/chapter.ts

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  assessmentId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Assessment {
  id: string;
  chapterId: string;
  createdAt: Date;
  updatedAt: Date;
  questions: Question[];
}

export interface Reply {
  id: string;
  userId: string;
  content: string;
  discussionId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DiscussionLike {
  id: string;
  userId: string;
  discussionId: string;
  createdAt: Date;
}

export interface Discussion {
  id: string;
  userId: string;
  content: string;
  courseId: string | null;
  chapterId: string | null;
  createdAt: Date;
  updatedAt: Date;
  replies: Reply[];
  likes: DiscussionLike[];
}

export interface Chapter {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string;
  attachmentUrl: string | null;
  attachmentOriginalName: string | null;
  position: number;
  isPublished: boolean;
  courseId: string;
  createdAt: Date;
  updatedAt: Date;
  assessment: Assessment | null;
  discussions: Discussion[];
}

export interface Course {
  id: string;
  title: string;
}

export interface ChapterProgress {
  id: string;
  userId: string;
  chapterId: string;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetChapterResponse {
  chapter: Chapter | null;
  course: Course | null;
  nextChapter: Chapter | null;
  userProgress: ChapterProgress | null;
  isEnrolled: boolean;
}
