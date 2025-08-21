"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Brain,
  RotateCcw,
  ArrowLeft,
  ArrowRight,
  Home,
  CheckCircle,
  XCircle,
  Clock,
  Target,
  Shuffle,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Flashcard {
  id: string
  front: string
  back: string
  difficulty: "new" | "learning" | "review"
  nextReview: Date
  interval: number
  easeFactor: number
  repetitions: number
}

interface FlashcardDeck {
  id: string
  title: string
  subject: string
  description: string
  cards: Flashcard[]
}

// Mock flashcard data
const mockFlashcardDeck: FlashcardDeck = {
  id: "1",
  title: "Computer Science Fundamentals",
  subject: "Computer Science",
  description: "Essential concepts and definitions in computer science",
  cards: [
    {
      id: "f1",
      front: "What is an Algorithm?",
      back: "A step-by-step procedure or formula for solving a problem. It's a finite sequence of well-defined instructions that can be executed by a computer to solve a specific problem or perform a computation.",
      difficulty: "new",
      nextReview: new Date(),
      interval: 1,
      easeFactor: 2.5,
      repetitions: 0,
    },
    {
      id: "f2",
      front: "Define Big O Notation",
      back: "Big O notation describes the upper bound of the time complexity of an algorithm. It represents the worst-case scenario and helps compare the efficiency of different algorithms as input size grows.",
      difficulty: "learning",
      nextReview: new Date(),
      interval: 3,
      easeFactor: 2.3,
      repetitions: 1,
    },
    {
      id: "f3",
      front: "What is a Data Structure?",
      back: "A data structure is a way of organizing and storing data in a computer so that it can be accessed and modified efficiently. Examples include arrays, linked lists, stacks, queues, trees, and graphs.",
      difficulty: "review",
      nextReview: new Date(),
      interval: 7,
      easeFactor: 2.8,
      repetitions: 3,
    },
    {
      id: "f4",
      front: "Explain Recursion",
      back: "Recursion is a programming technique where a function calls itself to solve a smaller instance of the same problem. It consists of a base case (stopping condition) and a recursive case.",
      difficulty: "new",
      nextReview: new Date(),
      interval: 1,
      easeFactor: 2.5,
      repetitions: 0,
    },
    {
      id: "f5",
      front: "What is Object-Oriented Programming?",
      back: "OOP is a programming paradigm based on the concept of objects, which contain data (attributes) and code (methods). Key principles include encapsulation, inheritance, polymorphism, and abstraction.",
      difficulty: "learning",
      nextReview: new Date(),
      interval: 2,
      easeFactor: 2.4,
      repetitions: 1,
    },
    {
      id: "f6",
      front: "Define Binary Search",
      back: "Binary search is an efficient algorithm for finding a target value in a sorted array. It works by repeatedly dividing the search interval in half, comparing the target with the middle element.",
      difficulty: "review",
      nextReview: new Date(),
      interval: 14,
      easeFactor: 3.0,
      repetitions: 4,
    },
  ],
}

interface FlashcardViewerProps {
  deckId: string
}

export function FlashcardViewer({ deckId }: FlashcardViewerProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [sessionStats, setSessionStats] = useState({
    cardsStudied: 0,
    correct: 0,
    incorrect: 0,
    startTime: new Date(),
  })
  const [showResults, setShowResults] = useState(false)
  const [cardResults, setCardResults] = useState<{ [key: string]: "easy" | "medium" | "hard" | "again" }>({})

  const deck = mockFlashcardDeck
  const currentCard = deck.cards[currentCardIndex]
  const progress = ((currentCardIndex + 1) / deck.cards.length) * 100

  const flipCard = () => {
    setIsFlipped(!isFlipped)
  }

  const handleCardResponse = (response: "again" | "hard" | "medium" | "easy") => {
    const cardId = currentCard.id
    setCardResults((prev) => ({ ...prev, [cardId]: response }))

    // Update session stats
    setSessionStats((prev) => ({
      ...prev,
      cardsStudied: prev.cardsStudied + 1,
      correct: response === "easy" || response === "medium" ? prev.correct + 1 : prev.correct,
      incorrect: response === "again" || response === "hard" ? prev.incorrect + 1 : prev.incorrect,
    }))

    // Move to next card or show results
    if (currentCardIndex < deck.cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1)
      setIsFlipped(false)
    } else {
      setShowResults(true)
    }
  }

  const goToPrevious = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1)
      setIsFlipped(false)
    }
  }

  const goToNext = () => {
    if (currentCardIndex < deck.cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1)
      setIsFlipped(false)
    }
  }

  const restartSession = () => {
    setCurrentCardIndex(0)
    setIsFlipped(false)
    setShowResults(false)
    setCardResults({})
    setSessionStats({
      cardsStudied: 0,
      correct: 0,
      incorrect: 0,
      startTime: new Date(),
    })
  }

  const shuffleCards = () => {
    // In a real app, this would shuffle the deck
    setCurrentCardIndex(0)
    setIsFlipped(false)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "new":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "learning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "review":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (showResults) {
    const sessionTime = Math.round((new Date().getTime() - sessionStats.startTime.getTime()) / 1000 / 60)
    const accuracy =
      sessionStats.cardsStudied > 0 ? Math.round((sessionStats.correct / sessionStats.cardsStudied) * 100) : 0

    return (
      <div className="min-h-screen bg-background">
        {/* Navigation */}
        <nav className="border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-foreground">PrepCraft</span>
              </div>
              <Button variant="ghost" asChild>
                <a href="/dashboard">
                  <Home className="w-4 h-4 mr-2" />
                  Dashboard
                </a>
              </Button>
            </div>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="bg-card/60 backdrop-blur-sm border-border/50">
            <CardContent className="p-12 text-center">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-primary" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-4">Session Complete!</h1>
              <p className="text-xl text-muted-foreground mb-8">Great job studying your flashcards.</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">{accuracy}%</div>
                  <div className="text-muted-foreground">Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent mb-2">{sessionStats.cardsStudied}</div>
                  <div className="text-muted-foreground">Cards Studied</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">{sessionTime}m</div>
                  <div className="text-muted-foreground">Time Spent</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={restartSession} className="bg-primary hover:bg-primary/90">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Study Again
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

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">PrepCraft</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={shuffleCards}>
                <Shuffle className="w-4 h-4 mr-2" />
                Shuffle
              </Button>
              <Badge variant="secondary">
                {currentCardIndex + 1} of {deck.cards.length}
              </Badge>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">{deck.title}</h1>
          <p className="text-muted-foreground">{deck.description}</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-foreground">Progress</span>
            <span className="text-sm text-muted-foreground">
              Card {currentCardIndex + 1} of {deck.cards.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Session Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="bg-card/60 backdrop-blur-sm border-border/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{sessionStats.cardsStudied}</div>
              <div className="text-sm text-muted-foreground">Studied</div>
            </CardContent>
          </Card>
          <Card className="bg-card/60 backdrop-blur-sm border-border/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{sessionStats.correct}</div>
              <div className="text-sm text-muted-foreground">Correct</div>
            </CardContent>
          </Card>
          <Card className="bg-card/60 backdrop-blur-sm border-border/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{sessionStats.incorrect}</div>
              <div className="text-sm text-muted-foreground">Incorrect</div>
            </CardContent>
          </Card>
        </div>

        {/* Flashcard */}
        <div className="mb-8 flex justify-center">
          <div className="relative w-full max-w-2xl h-96 perspective-1000">
            <div
              className={cn(
                "relative w-full h-full transition-transform duration-700 transform-style-preserve-3d cursor-pointer",
                isFlipped && "rotate-y-180",
              )}
              onClick={flipCard}
            >
              {/* Front of card */}
              <Card className="absolute inset-0 w-full h-full backface-hidden bg-card/80 backdrop-blur-sm border-border/50 hover:bg-card/90 transition-all duration-300">
                <CardContent className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <div className="mb-4">
                    <Badge className={getDifficultyColor(currentCard.difficulty)}>{currentCard.difficulty}</Badge>
                  </div>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">{currentCard.front}</h2>
                  <p className="text-muted-foreground">Click to reveal answer</p>
                </CardContent>
              </Card>

              {/* Back of card */}
              <Card className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-accent/10 backdrop-blur-sm border-accent/20 hover:bg-accent/20 transition-all duration-300">
                <CardContent className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <div className="mb-4">
                    <Badge className={getDifficultyColor(currentCard.difficulty)}>{currentCard.difficulty}</Badge>
                  </div>
                  <p className="text-lg text-accent-foreground leading-relaxed">{currentCard.back}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Response Buttons */}
        {isFlipped && (
          <div className="mb-8">
            <Alert className="mb-4 bg-accent/10 border-accent/20">
              <Brain className="h-4 w-4" />
              <AlertDescription className="text-accent-foreground">
                How well did you know this answer? Your response helps optimize future reviews.
              </AlertDescription>
            </Alert>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button
                onClick={() => handleCardResponse("again")}
                variant="outline"
                className="bg-red-50 border-red-200 text-red-800 hover:bg-red-100"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Again
              </Button>
              <Button
                onClick={() => handleCardResponse("hard")}
                variant="outline"
                className="bg-orange-50 border-orange-200 text-orange-800 hover:bg-orange-100"
              >
                <Clock className="w-4 h-4 mr-2" />
                Hard
              </Button>
              <Button
                onClick={() => handleCardResponse("medium")}
                variant="outline"
                className="bg-yellow-50 border-yellow-200 text-yellow-800 hover:bg-yellow-100"
              >
                <Target className="w-4 h-4 mr-2" />
                Good
              </Button>
              <Button
                onClick={() => handleCardResponse("easy")}
                variant="outline"
                className="bg-green-50 border-green-200 text-green-800 hover:bg-green-100"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Easy
              </Button>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={goToPrevious} disabled={currentCardIndex === 0} className="bg-transparent">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex space-x-4">
            <Button variant="outline" onClick={flipCard} className="bg-transparent">
              {isFlipped ? "Show Question" : "Show Answer"}
            </Button>
          </div>

          <Button
            variant="outline"
            onClick={goToNext}
            disabled={currentCardIndex === deck.cards.length - 1}
            className="bg-transparent"
          >
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  )
}
