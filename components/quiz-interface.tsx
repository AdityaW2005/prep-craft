"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Navigation } from "@/components/navigation"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { Brain, CheckCircle, XCircle, ArrowLeft, ArrowRight, RotateCcw, Home, Trophy, Target } from "lucide-react"
import { cn } from "@/lib/utils"

interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: "easy" | "medium" | "hard"
}

interface QuizData {
  id: string
  title: string
  subject: string
  description: string
  timeLimit: number // in minutes
  questions: Question[]
}

// Mock quiz data
const mockQuizData: QuizData = {
  id: "1",
  title: "Introduction to Computer Science - Chapter 1",
  subject: "Computer Science",
  description: "Test your understanding of basic computer science concepts, algorithms, and data structures.",
  timeLimit: 20,
  questions: [
    {
      id: "q1",
      question: "What is the time complexity of binary search in a sorted array?",
      options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
      correctAnswer: 1,
      explanation:
        "Binary search divides the search space in half with each comparison, resulting in O(log n) time complexity.",
      difficulty: "medium",
    },
    {
      id: "q2",
      question: "Which data structure follows the Last In, First Out (LIFO) principle?",
      options: ["Queue", "Stack", "Array", "Linked List"],
      correctAnswer: 1,
      explanation: "A stack follows the LIFO principle where the last element added is the first one to be removed.",
      difficulty: "easy",
    },
    {
      id: "q3",
      question: "What is the primary purpose of a hash function in a hash table?",
      options: ["To sort the data", "To encrypt the data", "To map keys to array indices", "To compress the data"],
      correctAnswer: 2,
      explanation:
        "Hash functions map keys to array indices, enabling fast insertion, deletion, and lookup operations.",
      difficulty: "medium",
    },
    {
      id: "q4",
      question: "Which sorting algorithm has the best average-case time complexity?",
      options: ["Bubble Sort", "Selection Sort", "Merge Sort", "Insertion Sort"],
      correctAnswer: 2,
      explanation:
        "Merge Sort has O(n log n) average-case time complexity, which is optimal for comparison-based sorting.",
      difficulty: "hard",
    },
    {
      id: "q5",
      question: "What does CPU stand for?",
      options: ["Central Processing Unit", "Computer Processing Unit", "Central Program Unit", "Computer Program Unit"],
      correctAnswer: 0,
      explanation:
        "CPU stands for Central Processing Unit, the main component that executes instructions in a computer.",
      difficulty: "easy",
    },
  ],
}

interface QuizInterfaceProps {
  quizId: string
}

export function QuizInterface({ quizId }: QuizInterfaceProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({})
  const [timeRemaining, setTimeRemaining] = useState(mockQuizData.timeLimit * 60) // Convert to seconds
  const [quizState, setQuizState] = useState<"taking" | "completed" | "review">("taking")
  const [showExplanation, setShowExplanation] = useState(false)

  const quiz = mockQuizData
  const totalQuestions = quiz.questions.length
  const progress = ((currentQuestion + 1) / totalQuestions) * 100

  // Timer effect
  useEffect(() => {
    if (quizState === "taking" && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setQuizState("completed")
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [quizState, timeRemaining])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion]: answerIndex,
    }))
  }

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setShowExplanation(false)
    } else {
      setQuizState("completed")
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setShowExplanation(false)
    }
  }

  const handleSubmit = () => {
    setQuizState("completed")
  }

  const calculateScore = () => {
    let correct = 0
    quiz.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++
      }
    })
    return {
      correct,
      total: totalQuestions,
      percentage: Math.round((correct / totalQuestions) * 100),
    }
  }

  const startReview = () => {
    setQuizState("review")
    setCurrentQuestion(0)
    setShowExplanation(true)
  }

  const restartQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswers({})
    setTimeRemaining(quiz.timeLimit * 60)
    setQuizState("taking")
    setShowExplanation(false)
  }

  if (quizState === "completed") {
    const score = calculateScore()
    return (
      <div className="min-h-screen bg-background">
        <Navigation />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="bg-card/60 backdrop-blur-sm border-border/50">
            <CardContent className="p-12 text-center">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                  <Trophy className="w-10 h-10 text-primary" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-4">Quiz Completed!</h1>
              <p className="text-xl text-muted-foreground mb-8">Great job on completing the quiz.</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">{score.percentage}%</div>
                  <div className="text-muted-foreground">Overall Score</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent mb-2">
                    {score.correct}/{score.total}
                  </div>
                  <div className="text-muted-foreground">Correct Answers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {formatTime(quiz.timeLimit * 60 - timeRemaining)}
                  </div>
                  <div className="text-muted-foreground">Time Taken</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={startReview} className="bg-primary hover:bg-primary/90">
                  <Target className="w-4 h-4 mr-2" />
                  Review Answers
                </Button>
                <Button onClick={restartQuiz} variant="outline" className="bg-transparent">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Retake Quiz
                </Button>
                <Button variant="outline" asChild className="bg-transparent">
                  <a href="/dashboard">
                    <Home className="w-4 h-4 mr-2" />
                    Back to Dashboard
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const currentQ = quiz.questions[currentQuestion]
  const selectedAnswer = selectedAnswers[currentQuestion]
  const isReviewMode = quizState === "review"

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BreadcrumbNav
          items={[
            { label: "Quiz", href: "/dashboard" },
            { label: quiz.title, current: true },
          ]}
          className="mb-6"
        />

        {/* Quiz Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">{quiz.title}</h1>
          <p className="text-muted-foreground">{quiz.description}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-foreground">Progress</span>
            <span className="text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {totalQuestions}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="bg-card/60 backdrop-blur-sm border-border/50 mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Question {currentQuestion + 1}</CardTitle>
              <Badge
                variant={
                  currentQ.difficulty === "easy"
                    ? "secondary"
                    : currentQ.difficulty === "medium"
                      ? "default"
                      : "destructive"
                }
              >
                {currentQ.difficulty}
              </Badge>
            </div>
            <CardDescription className="text-lg text-foreground mt-4">{currentQ.question}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentQ.options.map((option, index) => {
              const isSelected = selectedAnswer === index
              const isCorrect = index === currentQ.correctAnswer
              const showResult = isReviewMode || showExplanation

              return (
                <button
                  key={index}
                  onClick={() => !isReviewMode && handleAnswerSelect(index)}
                  disabled={isReviewMode}
                  className={cn(
                    "w-full p-4 text-left border rounded-lg transition-all duration-200",
                    "hover:bg-accent/5 focus:outline-none focus:ring-2 focus:ring-primary/50",
                    isSelected && !showResult && "border-primary bg-primary/5",
                    showResult && isCorrect && "border-green-500 bg-green-50 text-green-800",
                    showResult && isSelected && !isCorrect && "border-red-500 bg-red-50 text-red-800",
                    showResult && !isSelected && !isCorrect && "border-border bg-muted/20",
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={cn(
                        "w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium",
                        isSelected && !showResult && "border-primary bg-primary text-primary-foreground",
                        showResult && isCorrect && "border-green-500 bg-green-500 text-white",
                        showResult && isSelected && !isCorrect && "border-red-500 bg-red-500 text-white",
                        !isSelected && !showResult && "border-border",
                      )}
                    >
                      {showResult && isCorrect ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : showResult && isSelected && !isCorrect ? (
                        <XCircle className="w-4 h-4" />
                      ) : (
                        String.fromCharCode(65 + index)
                      )}
                    </div>
                    <span className="flex-1">{option}</span>
                  </div>
                </button>
              )
            })}

            {/* Explanation */}
            {showExplanation && (
              <Alert className="mt-6 bg-accent/10 border-accent/20">
                <Brain className="h-4 w-4" />
                <AlertDescription className="text-accent-foreground">
                  <strong>Explanation:</strong> {currentQ.explanation}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="bg-transparent"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex space-x-4">
            {!isReviewMode && selectedAnswer !== undefined && !showExplanation && (
              <Button variant="outline" onClick={() => setShowExplanation(true)} className="bg-transparent">
                Show Explanation
              </Button>
            )}

            {currentQuestion === totalQuestions - 1 ? (
              <Button
                onClick={isReviewMode ? () => (window.location.href = "/dashboard") : handleSubmit}
                className="bg-primary hover:bg-primary/90"
              >
                {isReviewMode ? "Finish Review" : "Submit Quiz"}
              </Button>
            ) : (
              <Button onClick={handleNext} className="bg-primary hover:bg-primary/90">
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
