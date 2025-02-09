// lib/types.ts

export enum Role {
  STUDENT = "STUDENT",
  ADMIN = "ADMIN",
}

export interface Category {
  id: string;
  name: string;
  courses: Course[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Course {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  duration: string | null;
  enrollmentCount: number;
  imageUrl: string | null;
  attachmentUrl: string | null;
  attachmentOriginalName: string | null;
  price: number;
  isPublished: boolean;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;

  category?: Category;
  chapters?: Chapter[];
  enrollments?: CourseEnrollment[];
  discussions?: Discussion[];
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

  course?: Course;
  progress?: ChapterProgress[];
  assessment?: Assessment | null;
  discussions?: Discussion[];
}

export interface Discussion {
  id: string;
  userId: string;
  content: string;
  courseId: string | null;
  chapterId: string | null;
  createdAt: Date;
  updatedAt: Date;

  course?: Course | null;
  chapter?: Chapter | null;
  replies?: Reply[];
  likes?: DiscussionLike[];
}

export interface Reply {
  id: string;
  userId: string;
  content: string;
  discussionId: string;
  createdAt: Date;
  updatedAt: Date;

  discussion?: Discussion;
  likes?: ReplyLike[];
}

export interface DiscussionLike {
  id: string;
  userId: string;
  discussionId: string;
  createdAt: Date;

  discussion?: Discussion;
}

export interface ReplyLike {
  id: string;
  userId: string;
  replyId: string;
  createdAt: Date;

  reply?: Reply;
}

export interface Assessment {
  id: string;
  chapterId: string;
  createdAt: Date;
  updatedAt: Date;

  chapter?: Chapter;
  questions?: Question[];
  results?: AssessmentResult[];
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  assessmentId: string;
  createdAt: Date;
  updatedAt: Date;

  assessment?: Assessment;
}

export interface CourseEnrollment {
  id: string;
  userId: string;
  courseId: string;
  createdAt: Date;
  updatedAt: Date;
  role: Role;

  course?: Course;
}

export interface ChapterProgress {
  id: string;
  userId: string;
  chapterId: string;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;

  chapter?: Chapter;
}

export interface AssessmentResult {
  id: string;
  userId: string;
  assessmentId: string;
  score: number;
  isPassed: boolean;
  createdAt: Date;
  updatedAt: Date;

  assessment?: Assessment;
}

// Helper types for API responses
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
}

// Common query params
export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface CourseQueryParams extends PaginationParams {
  categoryId?: string;
  userId?: string;
  isPublished?: boolean;
  searchQuery?: string;
}

export interface ChapterQueryParams {
  courseId: string;
  isPublished?: boolean;
}

export interface DiscussionQueryParams extends PaginationParams {
  courseId?: string;
  chapterId?: string;
  userId?: string;
}
