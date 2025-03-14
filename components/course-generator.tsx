"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Loader2, Download } from "lucide-react"
import { CourseDisplay } from "@/components/course-display"
import { generateCourse } from "@/lib/generate-course"
import type { CourseData } from "@/lib/types"

export function CourseGenerator() {
  const [topic, setTopic] = useState("")
  const [description, setDescription] = useState("")
  const [difficulty, setDifficulty] = useState([2]) // 1-3: Beginner, Intermediate, Advanced
  const [includeQuizzes, setIncludeQuizzes] = useState(true)
  const [includeExercises, setIncludeExercises] = useState(true)
  const [loading, setLoading] = useState(false)
  const [courseData, setCourseData] = useState<CourseData | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!topic) return

    setLoading(true)
    try {
      const data = await generateCourse({
        topic,
        description,
        difficulty: difficulty[0],
        includeQuizzes,
        includeExercises,
      })
      setCourseData(data)
    } catch (error) {
      console.error("Error generating course:", error)
    } finally {
      setLoading(false)
    }
  }

  const difficultyLabels = ["Beginner", "Intermediate", "Advanced"]

  return (
    <div className="space-y-8">
      {!courseData ? (
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="topic" className="text-base">
                Course Topic
              </Label>
              <Input
                id="topic"
                placeholder="e.g., Introduction to Machine Learning"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="text-base"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-base">
                Additional Details (Optional)
              </Label>
              <Textarea
                id="description"
                placeholder="Specific areas to focus on, target audience, etc."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[100px] text-base"
              />
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base">Difficulty Level</Label>
                <div className="pt-4 pb-2">
                  <Slider value={difficulty} onValueChange={setDifficulty} max={3} min={1} step={1} />
                </div>
                <div className="flex justify-between text-sm text-slate-500">
                  {difficultyLabels.map((label, index) => (
                    <span key={label} className={difficulty[0] === index + 1 ? "font-medium text-primary" : ""}>
                      {label}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="quizzes" className="text-base cursor-pointer">
                    Include Quizzes
                  </Label>
                  <Switch id="quizzes" checked={includeQuizzes} onCheckedChange={setIncludeQuizzes} />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="exercises" className="text-base cursor-pointer">
                    Include Exercises
                  </Label>
                  <Switch id="exercises" checked={includeExercises} onCheckedChange={setIncludeExercises} />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full text-base" size="lg" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Course...
                </>
              ) : (
                "Generate Course"
              )}
            </Button>
          </form>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={() => setCourseData(null)}>
              Create New Course
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => window.print()}>
                <Download className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
            </div>
          </div>

          <CourseDisplay courseData={courseData} />
        </div>
      )}
    </div>
  )
}

