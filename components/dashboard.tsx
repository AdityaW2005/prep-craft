"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Navigation } from "@/components/navigation"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { LoadingSpinner } from "@/components/loading-spinner"
import {
  Brain,
  BookOpen,
  Upload,
  Search,
  Filter,
  MoreVertical,
  Play,
  Eye,
  Download,
  Trash2,
  TrendingUp,
  Clock,
  Target,
  Award,
} from "lucide-react"

// Mock data for demonstration
const mockStudyMaterials = [
  {
    id: "1",
    title: "Introduction to Computer Science",
    subject: "Computer Science",
    uploadDate: "2024-01-15",
    pages: 45,
    quizzes: 3,
    flashcards: 67,
    studyGuides: 2,
    progress: 75,
    lastStudied: "2024-01-20",
    status: "completed",
  },
  {
    id: "2",
    title: "Calculus I - Derivatives and Limits",
    subject: "Mathematics",
    uploadDate: "2024-01-18",
    pages: 32,
    quizzes: 2,
    flashcards: 45,
    studyGuides: 1,
    progress: 45,
    lastStudied: "2024-01-19",
    status: "completed",
  },
  {
    id: "3",
    title: "Organic Chemistry Fundamentals",
    subject: "Chemistry",
    uploadDate: "2024-01-20",
    pages: 28,
    quizzes: 1,
    flashcards: 34,
    studyGuides: 1,
    progress: 20,
    lastStudied: "2024-01-20",
    status: "processing",
  },
  {
    id: "4",
    title: "World History - Renaissance Period",
    subject: "History",
    uploadDate: "2024-01-22",
    pages: 52,
    quizzes: 4,
    flashcards: 89,
    studyGuides: 3,
    progress: 90,
    lastStudied: "2024-01-22",
    status: "completed",
  },
]

const mockStats = {
  totalDocuments: 12,
  totalQuizzes: 28,
  totalFlashcards: 456,
  studyStreak: 7,
  averageScore: 87,
  hoursStudied: 24,
}

export function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("all")
  const [isLoading, setIsLoading] = useState(false)

  const filteredMaterials = mockStudyMaterials.filter((material) => {
    const matchesSearch = material.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSubject = selectedSubject === "all" || material.subject.toLowerCase() === selectedSubject.toLowerCase()
    return matchesSearch && matchesSubject
  })

  const subjects = ["all", ...Array.from(new Set(mockStudyMaterials.map((m) => m.subject)))]

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentPage="dashboard" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BreadcrumbNav items={[{ label: "Dashboard", current: true }]} className="mb-6" />

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Study Dashboard</h1>
          <p className="text-muted-foreground">Manage your study materials and track your progress</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card/60 backdrop-blur-sm border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{mockStats.totalDocuments}</div>
              <p className="text-xs text-muted-foreground">+2 from last week</p>
            </CardContent>
          </Card>

          <Card className="bg-card/60 backdrop-blur-sm border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{mockStats.studyStreak} days</div>
              <p className="text-xs text-muted-foreground">Keep it up!</p>
            </CardContent>
          </Card>

          <Card className="bg-card/60 backdrop-blur-sm border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{mockStats.averageScore}%</div>
              <p className="text-xs text-muted-foreground">+5% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-card/60 backdrop-blur-sm border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hours Studied</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{mockStats.hoursStudied}h</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search study materials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                <Filter className="h-4 w-4" />
                {selectedSubject === "all" ? "All Subjects" : selectedSubject}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {subjects.map((subject) => (
                <DropdownMenuItem key={subject} onClick={() => setSelectedSubject(subject)}>
                  {subject === "all" ? "All Subjects" : subject}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Study Materials */}
        <Tabs defaultValue="materials" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="materials">Study Materials</TabsTrigger>
            <TabsTrigger value="recent">Recent Activity</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="materials" className="space-y-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <LoadingSpinner size="lg" />
                <span className="ml-2 text-muted-foreground">Loading study materials...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMaterials.map((material) => (
                  <Card
                    key={material.id}
                    className="bg-card/60 backdrop-blur-sm border-border/50 hover:bg-card/80 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 group"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                            {material.title}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {material.subject}
                            </Badge>
                            <Badge
                              variant={material.status === "completed" ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {material.status}
                            </Badge>
                          </CardDescription>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Export
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center">
                          <div className="font-semibold text-primary">{material.quizzes}</div>
                          <div className="text-muted-foreground">Quizzes</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-accent">{material.flashcards}</div>
                          <div className="text-muted-foreground">Cards</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-primary">{material.studyGuides}</div>
                          <div className="text-muted-foreground">Guides</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{material.progress}%</span>
                        </div>
                        <Progress value={material.progress} className="h-2" />
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1" asChild>
                          <a href={`/study-guide/${material.id}`}>
                            <Play className="h-4 w-4 mr-2" />
                            Study
                          </a>
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 bg-transparent" asChild>
                          <a href={`/quiz/${material.id}`}>
                            <Brain className="h-4 w-4 mr-2" />
                            Quiz
                          </a>
                        </Button>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        Last studied: {new Date(material.lastStudied).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {filteredMaterials.length === 0 && (
              <Card className="bg-card/60 backdrop-blur-sm border-border/50">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No study materials found</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    {searchQuery || selectedSubject !== "all"
                      ? "Try adjusting your search or filter criteria"
                      : "Upload your first PDF to get started"}
                  </p>
                  <Button asChild>
                    <a href="/upload">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload PDF
                    </a>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="recent" className="space-y-6">
            <Card className="bg-card/60 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest study sessions and achievements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4 p-4 border border-border rounded-lg">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Award className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">Completed quiz: Computer Science Basics</p>
                    <p className="text-sm text-muted-foreground">Score: 92% • 2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 border border-border rounded-lg">
                  <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-accent" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">Studied flashcards: Calculus I</p>
                    <p className="text-sm text-muted-foreground">45 cards reviewed • 5 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 border border-border rounded-lg">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Upload className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">Uploaded new document: Organic Chemistry</p>
                    <p className="text-sm text-muted-foreground">Processing completed • 1 day ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-card/60 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle>Study Performance</CardTitle>
                  <CardDescription>Your quiz scores over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Computer Science</span>
                      <span className="font-medium">92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Mathematics</span>
                      <span className="font-medium">87%</span>
                    </div>
                    <Progress value={87} className="h-2" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Chemistry</span>
                      <span className="font-medium">78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/60 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle>Study Goals</CardTitle>
                  <CardDescription>Track your learning objectives</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Weekly Study Goal</span>
                        <span className="text-sm text-muted-foreground">18/20 hours</span>
                      </div>
                      <Progress value={90} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Quiz Completion</span>
                        <span className="text-sm text-muted-foreground">12/15 quizzes</span>
                      </div>
                      <Progress value={80} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Flashcard Reviews</span>
                        <span className="text-sm text-muted-foreground">450/500 cards</span>
                      </div>
                      <Progress value={90} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
