"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
  BookOpen,
  FileText,
  CheckCircle2,
  BookCheck,
  GraduationCap,
  MessageCircle,
  Download,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Brain,
  Lightbulb,
  Code,
  ImageIcon,
} from "lucide-react"
import type { CourseData } from "@/lib/types"
import { getCourse, generateSectionContent, askQuestion } from "@/lib/course-generator"
import { useToast } from "@/hooks/use-toast"

export default function CoursePage({ params }: { params: { id: string } }) {
  const { toast } = useToast()
  const [courseData, setCourseData] = useState<CourseData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeModule, setActiveModule] = useState(0)
  const [activeLesson, setActiveLesson] = useState(0)
  const [activeSection, setActiveSection] = useState(0)
  const [teachingMode, setTeachingMode] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({})
  const [showQuizResults, setShowQuizResults] = useState<Record<string, boolean>>({})
  const [question, setQuestion] = useState("")
  const [askingQuestion, setAskingQuestion] = useState(false)
  const [answer, setAnswer] = useState("")
  const [loadingSection, setLoadingSection] = useState(false)

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await getCourse(params.id)
        setCourseData(data)
      } catch (error) {
        console.error("Error fetching course:", error)
        toast({
          title: "Error",
          description: "Failed to load course data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchCourse()
  }, [params.id, toast])

  const handleLessonClick = (moduleIndex: number, lessonIndex: number) => {
    setActiveModule(moduleIndex)
    setActiveLesson(lessonIndex)
    setActiveSection(0)
  }

  const handleSectionClick = async (sectionIndex: number) => {
    if (!courseData) return

    const currentModule = courseData.modules[activeModule]
    const currentLesson = currentModule.lessons[activeLesson]
    const targetSection = currentLesson.sections[sectionIndex]

    // If content is already loaded, just switch to it
    if (targetSection.content) {
      setActiveSection(sectionIndex)
      return
    }

    // Otherwise, load the content
    setLoadingSection(true)
    setActiveSection(sectionIndex)

    try {
      const sectionContent = await generateSectionContent({
        courseId: params.id,
        moduleIndex: activeModule,
        lessonIndex: activeLesson,
        sectionIndex: sectionIndex,
      })

      // Update the course data with the new section content
      const updatedCourse = { ...courseData }
      updatedCourse.modules[activeModule].lessons[activeLesson].sections[sectionIndex] = {
        ...targetSection,
        ...sectionContent,
      }

      setCourseData(updatedCourse)
    } catch (error) {
      console.error("Error loading section content:", error)
      toast({
        title: "Error",
        description: "Failed to load section content. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoadingSection(false)
    }
  }

  const handleQuizAnswer = (quizId: string, answerIndex: number) => {
    setQuizAnswers({
      ...quizAnswers,
      [quizId]: answerIndex,
    })
  }

  const checkQuizAnswers = (quizId: string) => {
    setShowQuizResults({
      ...showQuizResults,
      [quizId]: true,
    })
  }

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim() || !courseData) return

    setAskingQuestion(true)
    setAnswer("")

    try {
      const currentModule = courseData.modules[activeModule]
      const currentLesson = currentModule.lessons[activeLesson]
      const currentSection = currentLesson.sections[activeSection]

      const response = await askQuestion({
        courseId: params.id,
        moduleIndex: activeModule,
        lessonIndex: activeLesson,
        sectionIndex: activeSection,
        question: question,
      })

      setAnswer(response)
    } catch (error) {
      console.error("Error asking question:", error)
      toast({
        title: "Error",
        description: "Failed to get an answer. Please try again.",
        variant: "destructive",
      })
    } finally {
      setAskingQuestion(false)
    }
  }

  const handleExportPDF = () => {
    toast({
      title: "Export Started",
      description: "Your course is being prepared for download as PDF.",
    })
    // Implementation for PDF export would go here
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-purple-600 dark:text-purple-400" />
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">Loading your course...</p>
        </div>
      </div>
    )
  }

  if (!courseData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Course Not Found</h2>
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            We couldn't find the course you're looking for. It may have been deleted or the link is incorrect.
          </p>
          <Button onClick={() => (window.location.href = "/create")}>Create New Course</Button>
        </div>
      </div>
    )
  }

  const currentModule = courseData.modules[activeModule]
  const currentLesson = currentModule?.lessons[activeLesson]
  const currentSection = currentLesson?.sections[activeSection]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">{courseData.title}</h1>
                  <p className="text-slate-600 dark:text-slate-300 mt-1">{courseData.description}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={teachingMode ? "default" : "outline"}
                    onClick={() => setTeachingMode(!teachingMode)}
                    className={teachingMode ? "bg-purple-600 hover:bg-purple-700 text-white" : ""}
                  >
                    <GraduationCap className="mr-2 h-4 w-4" />
                    {teachingMode ? "Exit Teaching Mode" : "Enter Teaching Mode"}
                  </Button>
                  <Button variant="outline" onClick={handleExportPDF}>
                    <Download className="mr-2 h-4 w-4" />
                    Export PDF
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center">
                  <BookOpen className="mr-1 h-4 w-4" />
                  <span>{courseData.modules.length} Modules</span>
                </div>
                <div className="flex items-center">
                  <FileText className="mr-1 h-4 w-4" />
                  <span>{courseData.modules.reduce((acc, module) => acc + module.lessons.length, 0)} Lessons</span>
                </div>
                <div className="flex items-center">
                  <BookCheck className="mr-1 h-4 w-4" />
                  <span>{courseData.difficulty} Level</span>
                </div>
                <div className="flex items-center">
                  <Brain className="mr-1 h-4 w-4" />
                  <span>Generated by Gemini</span>
                </div>
              </div>
            </div>
          </Card>

          {teachingMode ? (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1">
                <Card className="p-4 h-full overflow-auto">
                  <h3 className="text-lg font-semibold mb-4">Course Outline</h3>
                  <div className="space-y-4">
                    {courseData.modules.map((module, moduleIndex) => (
                      <div key={moduleIndex} className="space-y-2">
                        <div className="font-medium text-slate-900 dark:text-slate-100">
                          Module {moduleIndex + 1}: {module.title}
                        </div>
                        <ul className="pl-4 space-y-1">
                          {module.lessons.map((lesson, lessonIndex) => (
                            <li key={lessonIndex}>
                              <Button
                                variant="ghost"
                                className={`text-left justify-start w-full ${
                                  activeModule === moduleIndex && activeLesson === lessonIndex
                                    ? "bg-slate-100 dark:bg-slate-800 font-medium text-purple-600 dark:text-purple-400"
                                    : ""
                                }`}
                                onClick={() => handleLessonClick(moduleIndex, lessonIndex)}
                              >
                                {lesson.title}
                              </Button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              <div className="lg:col-span-3">
                <Card className="p-6">
                  {currentLesson && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold mb-1 text-slate-900 dark:text-white">
                          {currentLesson.title}
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Module {activeModule + 1}: {currentModule.title}
                        </p>
                      </div>

                      <div className="flex overflow-x-auto pb-2 space-x-2">
                        {currentLesson.sections.map((section, idx) => (
                          <Button
                            key={idx}
                            variant={activeSection === idx ? "default" : "outline"}
                            size="sm"
                            className={activeSection === idx ? "bg-purple-600 hover:bg-purple-700 text-white" : ""}
                            onClick={() => handleSectionClick(idx)}
                          >
                            {section.title}
                          </Button>
                        ))}
                      </div>

                      <Separator />

                      {loadingSection ? (
                        <div className="py-12 text-center">
                          <Loader2 className="h-8 w-8 animate-spin mx-auto text-purple-600 dark:text-purple-400 mb-4" />
                          <p className="text-slate-600 dark:text-slate-300">Loading section content...</p>
                        </div>
                      ) : currentSection && currentSection.content ? (
                        <div className="space-y-6">
                          <div className="prose dark:prose-invert max-w-none">
                            {currentSection.content.map((item, i) => {
                              if (item.type === "text") {
                                return <p key={i}>{item.content}</p>
                              } else if (item.type === "heading") {
                                return (
                                  <h3 key={i} className="text-xl font-semibold mt-6 mb-3">
                                    {item.content}
                                  </h3>
                                )
                              } else if (item.type === "code") {
                                return (
                                  <div
                                    key={i}
                                    className="bg-slate-100 dark:bg-slate-800 p-4 rounded-md my-4 overflow-x-auto"
                                  >
                                    <div className="flex items-center mb-2">
                                      <Code className="h-4 w-4 text-slate-500 dark:text-slate-400 mr-2" />
                                      <span className="text-sm font-medium">{item.language || "Code"}</span>
                                    </div>
                                    <pre className="text-sm font-mono">{item.content}</pre>
                                  </div>
                                )
                              } else if (item.type === "image") {
                                return (
                                  <div key={i} className="my-4">
                                    <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-md text-center">
                                      <div className="flex items-center justify-center mb-2">
                                        <ImageIcon className="h-4 w-4 text-slate-500 dark:text-slate-400 mr-2" />
                                        <span className="text-sm font-medium">Image</span>
                                      </div>
                                      <p className="text-sm text-slate-500 dark:text-slate-400 italic">
                                        [AI-generated image would appear here in a production environment]
                                      </p>
                                    </div>
                                  </div>
                                )
                              } else if (item.type === "list") {
                                return (
                                  <ul key={i} className="list-disc pl-5 space-y-1 my-4">
                                    {item.items.map((listItem, j) => (
                                      <li key={j}>{listItem}</li>
                                    ))}
                                  </ul>
                                )
                              } else if (item.type === "note") {
                                return (
                                  <div
                                    key={i}
                                    className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg my-4 border-l-4 border-blue-500 dark:border-blue-400"
                                  >
                                    <div className="flex items-center mb-2">
                                      <Lightbulb className="h-4 w-4 text-blue-500 dark:text-blue-400 mr-2" />
                                      <span className="font-medium">Note</span>
                                    </div>
                                    <p>{item.content}</p>
                                  </div>
                                )
                              }
                              return null
                            })}
                          </div>

                          {currentSection.keyTakeaways && currentSection.keyTakeaways.length > 0 && (
                            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                              <h4 className="font-semibold mb-2 flex items-center">
                                <CheckCircle2 className="mr-2 h-4 w-4 text-purple-600 dark:text-purple-400" />
                                Key Takeaways
                              </h4>
                              <ul className="list-disc pl-5 space-y-1">
                                {currentSection.keyTakeaways.map((takeaway, i) => (
                                  <li key={i}>{takeaway}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {currentSection.quiz && (
                            <div className="border rounded-lg p-4 mt-6">
                              <h4 className="font-semibold mb-4">Quiz: Test Your Knowledge</h4>
                              <div className="space-y-4">
                                <p className="font-medium">{currentSection.quiz.question}</p>
                                <div className="space-y-2">
                                  {currentSection.quiz.options.map((option, i) => (
                                    <div key={i} className="flex items-center">
                                      <Button
                                        variant={quizAnswers[currentSection.quiz!.id] === i ? "default" : "outline"}
                                        className="w-full justify-start text-left"
                                        onClick={() => handleQuizAnswer(currentSection.quiz!.id, i)}
                                        disabled={showQuizResults[currentSection.quiz!.id]}
                                      >
                                        {option}
                                      </Button>
                                      {showQuizResults[currentSection.quiz!.id] && (
                                        <div className="ml-2">
                                          {i === currentSection.quiz!.correctAnswer ? (
                                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                                          ) : null}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                                {!showQuizResults[currentSection.quiz!.id] && (
                                  <Button
                                    onClick={() => checkQuizAnswers(currentSection.quiz!.id)}
                                    disabled={quizAnswers[currentSection.quiz!.id] === undefined}
                                    className="bg-purple-600 hover:bg-purple-700 text-white"
                                  >
                                    Check Answer
                                  </Button>
                                )}
                                {showQuizResults[currentSection.quiz!.id] && (
                                  <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                    <p className="font-medium">
                                      {quizAnswers[currentSection.quiz!.id] === currentSection.quiz!.correctAnswer
                                        ? "Correct! 🎉"
                                        : "Not quite right. Try reviewing the section again."}
                                    </p>
                                    <p className="mt-2">{currentSection.quiz!.explanation}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {currentSection.exercise && (
                            <div className="border rounded-lg p-4 mt-6">
                              <h4 className="font-semibold mb-2">Practice Exercise</h4>
                              <p>{currentSection.exercise.description}</p>
                              {currentSection.exercise.steps && (
                                <ol className="list-decimal pl-5 mt-2 space-y-1">
                                  {currentSection.exercise.steps.map((step, i) => (
                                    <li key={i}>{step}</li>
                                  ))}
                                </ol>
                              )}
                            </div>
                          )}

                          <div className="mt-8 space-y-6">
                            <Separator />

                            <div>
                              <h4 className="font-semibold mb-4 flex items-center">
                                <MessageCircle className="mr-2 h-4 w-4 text-purple-600 dark:text-purple-400" />
                                Ask a Question About This Section
                              </h4>
                              <form onSubmit={handleAskQuestion} className="space-y-4">
                                <Textarea
                                  placeholder="What would you like to know about this topic?"
                                  value={question}
                                  onChange={(e) => setQuestion(e.target.value)}
                                  className="min-h-[80px]"
                                />
                                <Button
                                  type="submit"
                                  disabled={askingQuestion || !question.trim()}
                                  className="bg-purple-600 hover:bg-purple-700 text-white"
                                >
                                  {askingQuestion ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Getting Answer...
                                    </>
                                  ) : (
                                    "Ask Question"
                                  )}
                                </Button>
                              </form>

                              {answer && (
                                <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800">
                                  <div className="flex items-center mb-2">
                                    <Brain className="h-4 w-4 text-purple-600 dark:text-purple-400 mr-2" />
                                    <span className="font-medium">AI Answer</span>
                                  </div>
                                  <div className="prose dark:prose-invert max-w-none">
                                    <p>{answer}</p>
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="flex justify-between mt-8">
                              <Button
                                variant="outline"
                                onClick={() => {
                                  if (activeSection > 0) {
                                    handleSectionClick(activeSection - 1)
                                  } else if (activeLesson > 0) {
                                    handleLessonClick(activeModule, activeLesson - 1)
                                    // Set to the last section of the previous lesson
                                    const prevLesson = currentModule.lessons[activeLesson - 1]
                                    if (prevLesson) {
                                      setTimeout(() => {
                                        handleSectionClick(prevLesson.sections.length - 1)
                                      }, 0)
                                    }
                                  } else if (activeModule > 0) {
                                    const prevModule = courseData.modules[activeModule - 1]
                                    const lastLessonIndex = prevModule.lessons.length - 1
                                    handleLessonClick(activeModule - 1, lastLessonIndex)
                                    // Set to the last section of the last lesson of the previous module
                                    const lastLesson = prevModule.lessons[lastLessonIndex]
                                    if (lastLesson) {
                                      setTimeout(() => {
                                        handleSectionClick(lastLesson.sections.length - 1)
                                      }, 0)
                                    }
                                  }
                                }}
                                disabled={activeModule === 0 && activeLesson === 0 && activeSection === 0}
                              >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Previous Section
                              </Button>
                              <Button
                                onClick={() => {
                                  if (activeSection < currentLesson.sections.length - 1) {
                                    handleSectionClick(activeSection + 1)
                                  } else if (activeLesson < currentModule.lessons.length - 1) {
                                    handleLessonClick(activeModule, activeLesson + 1)
                                    // Set to the first section of the next lesson
                                    setTimeout(() => {
                                      handleSectionClick(0)
                                    }, 0)
                                  } else if (activeModule < courseData.modules.length - 1) {
                                    handleLessonClick(activeModule + 1, 0)
                                    // Set to the first section of the first lesson of the next module
                                    setTimeout(() => {
                                      handleSectionClick(0)
                                    }, 0)
                                  }
                                }}
                                disabled={
                                  activeModule === courseData.modules.length - 1 &&
                                  activeLesson === currentModule.lessons.length - 1 &&
                                  activeSection === currentLesson.sections.length - 1
                                }
                                className="bg-purple-600 hover:bg-purple-700 text-white"
                              >
                                Next Section
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="py-12 text-center">
                          <p className="text-slate-600 dark:text-slate-300 mb-4">
                            Click on a section above to load its content.
                          </p>
                          <Button
                            onClick={() => handleSectionClick(0)}
                            className="bg-purple-600 hover:bg-purple-700 text-white"
                          >
                            Load First Section
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              </div>
            </div>
          ) : (
            <Tabs defaultValue="outline" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="outline">Course Outline</TabsTrigger>
                <TabsTrigger value="content">Course Content</TabsTrigger>
              </TabsList>

              <TabsContent value="outline" className="space-y-4">
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Course Structure</h3>
                  <Accordion type="single" collapsible className="w-full">
                    {courseData.modules.map((module, moduleIndex) => (
                      <AccordionItem key={moduleIndex} value={`module-${moduleIndex}`}>
                        <AccordionTrigger className="text-lg">
                          Module {moduleIndex + 1}: {module.title}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="pl-4 space-y-4">
                            {module.description && (
                              <p className="text-slate-600 dark:text-slate-300 mb-2">{module.description}</p>
                            )}

                            {module.lessons.map((lesson, lessonIndex) => (
                              <div key={lessonIndex} className="space-y-2">
                                <h4 className="font-medium">
                                  Lesson {moduleIndex + 1}.{lessonIndex + 1}: {lesson.title}
                                </h4>
                                <ul className="space-y-1 pl-4">
                                  {lesson.sections.map((section, sectionIndex) => (
                                    <li key={sectionIndex} className="list-disc list-inside">
                                      {section.title}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </Card>

                <div className="text-center mt-8">
                  <Button
                    onClick={() => setTeachingMode(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <GraduationCap className="mr-2 h-4 w-4" />
                    Start Learning in Teaching Mode
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="content" className="space-y-6">
                <Card className="p-6">
                  <div className="space-y-2 mb-6">
                    <h3 className="text-xl font-semibold">Course Content</h3>
                    <p className="text-slate-600 dark:text-slate-300">
                      This course is designed to be interactive. For the best learning experience, we recommend using
                      the Teaching Mode where content is generated section-by-section as you progress.
                    </p>
                  </div>

                  <Button
                    onClick={() => setTeachingMode(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <GraduationCap className="mr-2 h-4 w-4" />
                    Enter Teaching Mode
                  </Button>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  )
}

