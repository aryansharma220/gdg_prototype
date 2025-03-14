"use server"

import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"
import type { CourseGenerationParams, CourseData } from "@/lib/types"
import { v4 as uuidv4 } from "uuid"

// Define the schema for the course data
const quizSchema = z.object({
  question: z.string(),
  options: z.array(z.string()),
  correctAnswer: z.number(),
  explanation: z.string(),
})

const exerciseSchema = z.object({
  description: z.string(),
  steps: z.array(z.string()).optional(),
})

const lessonSchema = z.object({
  title: z.string(),
  content: z.array(z.string()),
  keyTakeaways: z.array(z.string()).optional(),
  quiz: quizSchema.optional(),
  exercise: exerciseSchema.optional(),
})

const moduleSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  lessons: z.array(lessonSchema),
})

const courseSchema = z.object({
  title: z.string(),
  description: z.string(),
  difficulty: z.string(),
  modules: z.array(moduleSchema),
})

export async function generateCourse(params: CourseGenerationParams): Promise<CourseData> {
  const { topic, description, difficulty, includeQuizzes, includeExercises } = params

  const difficultyLabels = ["Beginner", "Intermediate", "Advanced"]
  const difficultyLabel = difficultyLabels[difficulty - 1]

  const prompt = `
    Create a comprehensive course on "${topic}".
    ${description ? `Additional details: ${description}` : ""}
    
    The course should be at a ${difficultyLabel} level.
    ${includeQuizzes ? "Include quizzes for each lesson." : "Do not include quizzes."}
    ${includeExercises ? "Include practical exercises for each lesson." : "Do not include exercises."}
    
    The course should have 3-5 modules, each with 2-4 lessons.
    Each lesson should have:
    - A clear title
    - Detailed content split into paragraphs
    - Key takeaways
    ${includeQuizzes ? "- A quiz with a question, 4 options, the correct answer index (0-3), and an explanation" : ""}
    ${includeExercises ? "- A practical exercise with a description and steps" : ""}
    
    Make the content educational, engaging, and accurate.
  `

  try {
    const { object } = await generateObject({
      model: openai("gpt-4o"),
      prompt,
      schema: courseSchema,
    })

    // Add unique IDs to quizzes
    const processedCourse = {
      ...object,
      modules: object.modules.map((module) => ({
        ...module,
        lessons: module.lessons.map((lesson) => ({
          ...lesson,
          quiz: lesson.quiz ? { ...lesson.quiz, id: uuidv4() } : undefined,
        })),
      })),
    }

    return processedCourse
  } catch (error) {
    console.error("Error generating course:", error)
    throw new Error("Failed to generate course. Please try again.")
  }
}

