export interface CourseData {
  id: string
  title: string
  description: string
  difficulty: string
  learningStyle: string
  modules: Module[]
}

export interface Module {
  title: string
  description?: string
  lessons: Lesson[]
}

export interface Lesson {
  title: string
  description?: string
  sections: Section[]
}

export interface Section {
  title: string
  content?: ContentItem[]
  keyTakeaways?: string[]
  quiz?: Quiz
  exercise?: Exercise
}

export interface ContentItem {
  type: "text" | "heading" | "code" | "image" | "list" | "note"
  content?: string
  language?: string
  items?: string[]
}

export interface Quiz {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

export interface Exercise {
  description: string
  steps?: string[]
}

export interface CourseGenerationParams {
  topic: string
  description?: string
  knowledgeLevel: string
  learningStyle: string
  pace: number
  includeQuizzes: boolean
  includeExercises: boolean
  includeMultimedia: boolean
}

export interface SectionGenerationParams {
  courseId: string
  moduleIndex: number
  lessonIndex: number
  sectionIndex: number
}

export interface QuestionParams {
  courseId: string
  moduleIndex: number
  lessonIndex: number
  sectionIndex: number
  question: string
}

