export interface Course {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  isPublished: boolean;
  chapters: Chapter[];
}

export interface Chapter {
  id: string;
  title: string;
  description?: string;
  videoUrl: string;
  position: number;
  isPublished: boolean;
  courseId: string;
}

export interface Assessment {
  id: string;
  chapterId: string;
  questions: Question[];
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  assessmentId: string;
}
