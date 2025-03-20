import { z } from "zod";

export const roleEnum = z.enum(["STUDENT", "ADMIN"]);

// Base schemas
export const categorySchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(1, "Category name is required"),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const courseSchema = z.object({
  id: z.string().cuid(),
  userId: z.string().min(1, "User ID is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional().nullable(),
  duration: z.string().optional().nullable(),
  enrollmentCount: z.number().int().default(0),
  imageUrl: z.string().optional().nullable(),
  attachmentUrl: z.string().optional().nullable(),
  attachmentOriginalName: z.string().optional().nullable(), // Added field
  price: z.number().min(0, "Price must be 0 or greater").default(0),
  isPublished: z.boolean().default(false),
  categoryId: z.string().cuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const chapterSchema = z.object({
  id: z.string().cuid(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional().nullable(),
  videoUrl: z.string().min(1, "Video URL is required"),
  attachmentUrl: z.string().optional().nullable(),
  attachmentOriginalName: z.string().optional().nullable(), // Added field
  position: z.number().int().min(0),
  isPublished: z.boolean().default(false),
  courseId: z.string().cuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const discussionSchema = z.object({
  id: z.string().cuid(),
  userId: z.string().min(1, "User ID is required"),
  content: z.string().min(1, "Content is required"),
  courseId: z.string().cuid().optional().nullable(),
  chapterId: z.string().cuid().optional().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const replySchema = z.object({
  id: z.string().cuid(),
  userId: z.string().min(1, "User ID is required"),
  content: z.string().min(1, "Content is required"),
  discussionId: z.string().cuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const discussionLikeSchema = z.object({
  id: z.string().cuid(),
  userId: z.string().min(1, "User ID is required"),
  discussionId: z.string().cuid(),
  createdAt: z.date(),
});

export const replyLikeSchema = z.object({
  id: z.string().cuid(),
  userId: z.string().min(1, "User ID is required"),
  replyId: z.string().cuid(),
  createdAt: z.date(),
});

export const assessmentSchema = z.object({
  id: z.string().cuid(),
  chapterId: z.string().cuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const questionSchema = z.object({
  id: z.string().cuid(),
  question: z.string().min(1, "Question is required"),
  options: z.array(z.string()),
  correctAnswer: z.string(),
  assessmentId: z.string().cuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const courseEnrollmentSchema = z.object({
  id: z.string().cuid(),
  userId: z.string(),
  courseId: z.string().cuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  role: roleEnum.default("STUDENT"),
});

export const chapterProgressSchema = z.object({
  id: z.string().cuid(),
  userId: z.string(),
  chapterId: z.string().cuid(),
  isCompleted: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const assessmentResultSchema = z.object({
  id: z.string().cuid(),
  userId: z.string(),
  assessmentId: z.string().cuid(),
  score: z.number().int(),
  isPassed: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Creation input schemas
export const createCategorySchema = categorySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const createCourseSchema = courseSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  enrollmentCount: true,
});

export const createChapterSchema = chapterSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const createDiscussionSchema = discussionSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const createReplySchema = replySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const createDiscussionLikeSchema = discussionLikeSchema.omit({
  id: true,
  createdAt: true,
});

export const createReplyLikeSchema = replyLikeSchema.omit({
  id: true,
  createdAt: true,
});

export const createAssessmentSchema = assessmentSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const createQuestionSchema = questionSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const createCourseEnrollmentSchema = courseEnrollmentSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const createChapterProgressSchema = chapterProgressSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const createAssessmentResultSchema = assessmentResultSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Update schemas with proper partials
export const updateCategorySchema = createCategorySchema.partial();
export const updateCourseSchema = createCourseSchema.partial();
export const updateChapterSchema = createChapterSchema.partial();
export const updateDiscussionSchema = createDiscussionSchema.partial();
export const updateReplySchema = createReplySchema.partial();
export const updateAssessmentSchema = createAssessmentSchema.partial();
export const updateQuestionSchema = createQuestionSchema.partial();

// Type exports
export type Category = z.infer<typeof categorySchema>;
export type Course = z.infer<typeof courseSchema>;
export type Chapter = z.infer<typeof chapterSchema>;
export type Discussion = z.infer<typeof discussionSchema>;
export type Reply = z.infer<typeof replySchema>;
export type DiscussionLike = z.infer<typeof discussionLikeSchema>;
export type ReplyLike = z.infer<typeof replyLikeSchema>;
export type Assessment = z.infer<typeof assessmentSchema>;
export type Question = z.infer<typeof questionSchema>;
export type CourseEnrollment = z.infer<typeof courseEnrollmentSchema>;
export type ChapterProgress = z.infer<typeof chapterProgressSchema>;
export type AssessmentResult = z.infer<typeof assessmentResultSchema>;

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type CreateCourseInput = z.infer<typeof createCourseSchema>;
export type CreateChapterInput = z.infer<typeof createChapterSchema>;
export type CreateDiscussionInput = z.infer<typeof createDiscussionSchema>;
export type CreateReplyInput = z.infer<typeof createReplySchema>;
export type CreateAssessmentInput = z.infer<typeof createAssessmentSchema>;
export type CreateQuestionInput = z.infer<typeof createQuestionSchema>;
export type CreateCourseEnrollmentInput = z.infer<typeof createCourseEnrollmentSchema>;
export type CreateChapterProgressInput = z.infer<typeof createChapterProgressSchema>;
export type CreateAssessmentResultInput = z.infer<typeof createAssessmentResultSchema>;

export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>;
export type UpdateChapterInput = z.infer<typeof updateChapterSchema>;
export type UpdateDiscussionInput = z.infer<typeof updateDiscussionSchema>;
export type UpdateReplyInput = z.infer<typeof updateReplySchema>;
export type UpdateAssessmentInput = z.infer<typeof updateAssessmentSchema>;
export type UpdateQuestionInput = z.infer<typeof updateQuestionSchema>;
