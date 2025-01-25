import { z } from "zod";

// Course Schema
export const courseSchema = z.object({
  id: z.string().cuid(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  imageUrl: z.string().min(1, "Image is required"),
  price: z.coerce.number().min(0, "Price must be 0 or greater"),
  userId: z.string().min(1, "User ID is required"),
  isPublished: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Chapter Schema
export const chapterSchema = z.object({
  id: z.string().cuid(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  videoUrl: z.string().min(1, "Video URL is required").url("Invalid video URL"),
  position: z.number().int().min(0),
  isPublished: z.boolean().default(false),
  courseId: z.string().cuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Assessment Schema
export const assessmentSchema = z.object({
  id: z.string().cuid(),
  chapterId: z.string().cuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Question Schema
export const questionSchema = z.object({
  id: z.string().cuid(),
  question: z.string().min(1),
  options: z.array(z.string()).min(1),
  correctAnswer: z.string(),
  assessmentId: z.string().cuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createChapterSchema = chapterSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  position: true,
  courseId: true,
});

// Course Enrollment Schema
export const courseEnrollmentSchema = z.object({
  id: z.string().cuid(),
  userId: z.string(),
  courseId: z.string().cuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Chapter Progress Schema
export const chapterProgressSchema = z.object({
  id: z.string().cuid(),
  userId: z.string(),
  chapterId: z.string().cuid(),
  isCompleted: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Assessment Result Schema
export const assessmentResultSchema = z.object({
  id: z.string().cuid(),
  userId: z.string(),
  assessmentId: z.string().cuid(),
  score: z.number().int().min(0),
  isPassed: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Schema for creating a new course (without id, createdAt, updatedAt)
export const createCourseSchema = courseSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Schema for updating a course
export const updateCourseSchema = createCourseSchema.partial();

// Schema for updating a chapter
export const updateChapterSchema = createChapterSchema.partial();

// Schema for creating a new assessment
export const createAssessmentSchema = assessmentSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Schema for creating a new question
export const createQuestionSchema = questionSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Schema for creating a course enrollment
export const createCourseEnrollmentSchema = courseEnrollmentSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Schema for creating chapter progress
export const createChapterProgressSchema = chapterProgressSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Schema for creating assessment result
export const createAssessmentResultSchema = assessmentResultSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
