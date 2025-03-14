"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { BookOpen, FileText, CheckCircle2, BookCheck, GraduationCap } from "lucide-react"
import type { CourseData } from "@/lib/types"

interface CourseDisplayProps {
  courseData: CourseData
}

export function CourseDisplay({ courseData }: CourseDisplayProps) {
  const [activeModule, setActiveModule] = useState(0)
  const [activeLesson, setActiveLesson] = useState(0)
  const [teachingMode, setTeachingMode] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({})
  const [showQuizResults, setShowQuizResults] = useState<Record<string, boolean>>({})

  const handleLessonClick = (moduleIndex: number, lessonIndex: number) => {
    setActiveModule(moduleIndex)
    setActiveLesson(lessonIndex)
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

  const currentModule = courseData.modules[activeModule]
  const currentLesson = currentModule?.lessons[activeLesson]

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold">{courseData.title}</h2>
            <Button variant={teachingMode ? "default" : "outline"} onClick={() => setTeachingMode(!teachingMode)}>
              <GraduationCap className="mr-2 h-4 w-4" />
              {teachingMode ? "Exit Teaching Mode" : "Enter Teaching Mode"}
            </Button>
          </div>
          <p className="text-slate-600 dark:text-slate-300">{courseData.description}</p>
          <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
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
          </div>
        </div>
      </Card>

      {teachingMode ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card className="p-4">
              <h3 className="text-xl font-semibold mb-4">Course Outline</h3>
              <div className="space-y-2">
                {courseData.modules.map((module, moduleIndex) => (
                  <div key={moduleIndex} className="space-y-1">
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
                                ? "bg-slate-100 dark:bg-slate-800 font-medium"
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

          <div className="lg:col-span-2">
            <Card className="p-6">
              {currentLesson && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-1">{currentLesson.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Module {activeModule + 1}: {currentModule.title}
                    </p>
                  </div>

                  <div className="prose dark:prose-invert max-w-none">
                    {currentLesson.content.map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))}
                  </div>

                  {currentLesson.keyTakeaways && (
                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2 flex items-center">
                        <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                        Key Takeaways
                      </h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {currentLesson.keyTakeaways.map((takeaway, i) => (
                          <li key={i}>{takeaway}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {currentLesson.quiz && (
                    <div className="border rounded-lg p-4 mt-6">
                      <h4 className="font-semibold mb-4">Quiz: Test Your Knowledge</h4>
                      <div className="space-y-4">
                        <p className="font-medium">{currentLesson.quiz.question}</p>
                        <div className="space-y-2">
                          {currentLesson.quiz.options.map((option, i) => (
                            <div key={i} className="flex items-center">
                              <Button
                                variant={quizAnswers[currentLesson.quiz!.id] === i ? "default" : "outline"}
                                className="w-full justify-start text-left"
                                onClick={() => handleQuizAnswer(currentLesson.quiz!.id, i)}
                                disabled={showQuizResults[currentLesson.quiz!.id]}
                              >
                                {option}
                              </Button>
                              {showQuizResults[currentLesson.quiz!.id] && (
                                <div className="ml-2">
                                  {i === currentLesson.quiz!.correctAnswer ? (
                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                  ) : null}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        {!showQuizResults[currentLesson.quiz!.id] && (
                          <Button
                            onClick={() => checkQuizAnswers(currentLesson.quiz!.id)}
                            disabled={quizAnswers[currentLesson.quiz!.id] === undefined}
                          >
                            Check Answer
                          </Button>
                        )}
                        {showQuizResults[currentLesson.quiz!.id] && (
                          <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                            <p className="font-medium">
                              {quizAnswers[currentLesson.quiz!.id] === currentLesson.quiz!.correctAnswer
                                ? "Correct! 🎉"
                                : "Not quite right. Try reviewing the lesson again."}
                            </p>
                            <p className="mt-2">{currentLesson.quiz!.explanation}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {currentLesson.exercise && (
                    <div className="border rounded-lg p-4 mt-6">
                      <h4 className="font-semibold mb-2">Practice Exercise</h4>
                      <p>{currentLesson.exercise.description}</p>
                      {currentLesson.exercise.steps && (
                        <ol className="list-decimal pl-5 mt-2 space-y-1">
                          {currentLesson.exercise.steps.map((step, i) => (
                            <li key={i}>{step}</li>
                          ))}
                        </ol>
                      )}
                    </div>
                  )}

                  <div className="flex justify-between mt-8">
                    <Button
                      variant="outline"
                      onClick={() => {
                        if (activeLesson > 0) {
                          setActiveLesson(activeLesson - 1)
                        } else if (activeModule > 0) {
                          setActiveModule(activeModule - 1)
                          setActiveLesson(courseData.modules[activeModule - 1].lessons.length - 1)
                        }
                      }}
                      disabled={activeModule === 0 && activeLesson === 0}
                    >
                      Previous Lesson
                    </Button>
                    <Button
                      onClick={() => {
                        if (activeLesson < currentModule.lessons.length - 1) {
                          setActiveLesson(activeLesson + 1)
                        } else if (activeModule < courseData.modules.length - 1) {
                          setActiveModule(activeModule + 1)
                          setActiveLesson(0)
                        }
                      }}
                      disabled={
                        activeModule === courseData.modules.length - 1 &&
                        activeLesson === currentModule.lessons.length - 1
                      }
                    >
                      Next Lesson
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      ) : (
        <Tabs defaultValue="outline" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="outline">Course Outline</TabsTrigger>
            <TabsTrigger value="content">Full Content</TabsTrigger>
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
                      <div className="pl-4 space-y-2">
                        {module.description && (
                          <p className="text-slate-600 dark:text-slate-300 mb-2">{module.description}</p>
                        )}
                        <h4 className="font-medium">Lessons:</h4>
                        <ul className="space-y-1 pl-4">
                          {module.lessons.map((lesson, lessonIndex) => (
                            <li key={lessonIndex} className="list-disc list-inside">
                              {lesson.title}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            {courseData.modules.map((module, moduleIndex) => (
              <Card key={moduleIndex} className="p-6">
                <h3 className="text-2xl font-bold mb-2">
                  Module {moduleIndex + 1}: {module.title}
                </h3>
                {module.description && <p className="text-slate-600 dark:text-slate-300 mb-4">{module.description}</p>}

                <div className="space-y-8 mt-6">
                  {module.lessons.map((lesson, lessonIndex) => (
                    <div key={lessonIndex} className="border-t pt-6 first:border-t-0 first:pt-0">
                      <h4 className="text-xl font-semibold mb-3">
                        {moduleIndex + 1}.{lessonIndex + 1} {lesson.title}
                      </h4>
                      <div className="prose dark:prose-invert max-w-none">
                        {lesson.content.map((paragraph, i) => (
                          <p key={i}>{paragraph}</p>
                        ))}
                      </div>

                      {lesson.keyTakeaways && (
                        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg mt-4">
                          <h5 className="font-semibold mb-2 flex items-center">
                            <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                            Key Takeaways
                          </h5>
                          <ul className="list-disc pl-5 space-y-1">
                            {lesson.keyTakeaways.map((takeaway, i) => (
                              <li key={i}>{takeaway}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {lesson.quiz && (
                        <div className="border rounded-lg p-4 mt-4">
                          <h5 className="font-semibold mb-2">Quiz</h5>
                          <p className="font-medium">{lesson.quiz.question}</p>
                          <ul className="list-disc pl-5 mt-2">
                            {lesson.quiz.options.map((option, i) => (
                              <li key={i} className={i === lesson.quiz!.correctAnswer ? "font-medium" : ""}>
                                {option} {i === lesson.quiz!.correctAnswer && "(Correct Answer)"}
                              </li>
                            ))}
                          </ul>
                          <p className="mt-2 text-slate-600 dark:text-slate-300">
                            <span className="font-medium">Explanation:</span> {lesson.quiz.explanation}
                          </p>
                        </div>
                      )}

                      {lesson.exercise && (
                        <div className="border rounded-lg p-4 mt-4">
                          <h5 className="font-semibold mb-2">Practice Exercise</h5>
                          <p>{lesson.exercise.description}</p>
                          {lesson.exercise.steps && (
                            <ol className="list-decimal pl-5 mt-2 space-y-1">
                              {lesson.exercise.steps.map((step, i) => (
                                <li key={i}>{step}</li>
                              ))}
                            </ol>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

