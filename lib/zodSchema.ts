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
  attachmentUrl: z.string().optional().nullable(), // Added this field
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
  attachmentUrl: z.string().optional().nullable(), // Added this field
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
  question: z.string().min(1),
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

// Type exports for TypeScript usage
export type Category = z.infer<typeof categorySchema>;
export type Course = z.infer<typeof courseSchema>;
export type Chapter = z.infer<typeof chapterSchema>;
export type CreateCourseInput = z.infer<typeof createCourseSchema>;
export type CreateChapterInput = z.infer<typeof createChapterSchema>;
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>;
export type UpdateChapterInput = z.infer<typeof updateChapterSchema>;
