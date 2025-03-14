"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Loader2, ArrowRight, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import { generateCourseSyllabus } from "@/lib/course-generator"

export default function CreateCoursePage() {
  const router = useRouter()
  const [topic, setTopic] = useState("")
  const [description, setDescription] = useState("")
  const [knowledgeLevel, setKnowledgeLevel] = useState("beginner")
  const [learningStyle, setLearningStyle] = useState("visual")
  const [paceValue, setPaceValue] = useState([2]) // 1-3: Slow, Medium, Fast
  const [includeQuizzes, setIncludeQuizzes] = useState(true)
  const [includeExercises, setIncludeExercises] = useState(true)
  const [includeMultimedia, setIncludeMultimedia] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!topic) {
      setError("Please enter a course topic")
      return
    }

    setLoading(true)
    setError("")

    try {
      const courseId = await generateCourseSyllabus({
        topic,
        description,
        knowledgeLevel,
        learningStyle,
        pace: paceValue[0],
        includeQuizzes,
        includeExercises,
        includeMultimedia,
      })

      router.push(`/course/${courseId}`)
    } catch (err) {
      console.error("Error generating course:", err)
      setError("Failed to generate course. Please try again.")
      setLoading(false)
    }
  }

  const paceLabels = ["Slow", "Medium", "Fast"]

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white dark:from-slate-950 dark:to-slate-900 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-sm font-medium mb-2">
              <Sparkles className="h-4 w-4 mr-2" />
              Powered by Google Gemini API
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
              Create Your AI-Generated Course
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Tell us what you want to learn, and our AI will create a personalized course just for you.
            </p>
          </div>

          <Card className="p-6 shadow-lg border-slate-200 dark:border-slate-700">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="topic" className="text-base">
                  Course Topic
                </Label>
                <Input
                  id="topic"
                  placeholder="e.g., Introduction to Machine Learning, Web Development with React"
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
                  placeholder="Specific areas to focus on, goals you want to achieve, or any other details"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[100px] text-base"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-base mb-2 block">Prior Knowledge Level</Label>
                    <RadioGroup
                      value={knowledgeLevel}
                      onValueChange={setKnowledgeLevel}
                      className="flex flex-col space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="beginner" id="beginner" />
                        <Label htmlFor="beginner" className="cursor-pointer">
                          Beginner
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="intermediate" id="intermediate" />
                        <Label htmlFor="intermediate" className="cursor-pointer">
                          Intermediate
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="advanced" id="advanced" />
                        <Label htmlFor="advanced" className="cursor-pointer">
                          Advanced
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="text-base mb-2 block">Preferred Learning Style</Label>
                    <RadioGroup
                      value={learningStyle}
                      onValueChange={setLearningStyle}
                      className="flex flex-col space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="visual" id="visual" />
                        <Label htmlFor="visual" className="cursor-pointer">
                          Visual (diagrams, images)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="textual" id="textual" />
                        <Label htmlFor="textual" className="cursor-pointer">
                          Textual (detailed explanations)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="practical" id="practical" />
                        <Label htmlFor="practical" className="cursor-pointer">
                          Practical (examples, exercises)
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-base">Learning Pace</Label>
                    <div className="pt-4 pb-2">
                      <Slider value={paceValue} onValueChange={setPaceValue} max={3} min={1} step={1} />
                    </div>
                    <div className="flex justify-between text-sm text-slate-500">
                      {paceLabels.map((label, index) => (
                        <span
                          key={label}
                          className={
                            paceValue[0] === index + 1 ? "font-medium text-purple-600 dark:text-purple-400" : ""
                          }
                        >
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

                    <div className="flex items-center justify-between">
                      <Label htmlFor="multimedia" className="text-base cursor-pointer">
                        Include Multimedia Content
                      </Label>
                      <Switch id="multimedia" checked={includeMultimedia} onCheckedChange={setIncludeMultimedia} />
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full text-base bg-purple-600 hover:bg-purple-700 text-white"
                size="lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Your Course...
                  </>
                ) : (
                  <>
                    Generate Course
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </Card>

          <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
            <p>
              Our AI uses Google Gemini to generate educational content. Course generation typically takes 15-30
              seconds.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

