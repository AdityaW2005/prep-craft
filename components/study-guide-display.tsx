"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Brain,
  Search,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Download,
  PrinterIcon as Print,
  Home,
  Bookmark,
  Eye,
  Clock,
  Target,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface StudyGuideSection {
  id: string
  title: string
  content: string
  subsections?: StudyGuideSection[]
  keyPoints?: string[]
  examples?: string[]
  isRead?: boolean
}

interface StudyGuide {
  id: string
  title: string
  subject: string
  description: string
  estimatedReadTime: number
  sections: StudyGuideSection[]
  createdAt: string
  lastUpdated: string
}

// Mock study guide data
const mockStudyGuide: StudyGuide = {
  id: "1",
  title: "Introduction to Computer Science - Complete Study Guide",
  subject: "Computer Science",
  description:
    "Comprehensive study guide covering fundamental concepts in computer science including algorithms, data structures, and programming paradigms.",
  estimatedReadTime: 45,
  createdAt: "2024-01-15",
  lastUpdated: "2024-01-20",
  sections: [
    {
      id: "s1",
      title: "Algorithms and Complexity",
      content:
        "Algorithms are step-by-step procedures for solving computational problems. Understanding algorithmic complexity is crucial for writing efficient code and solving problems at scale.",
      keyPoints: [
        "An algorithm is a finite sequence of well-defined instructions",
        "Time complexity measures how runtime scales with input size",
        "Space complexity measures memory usage relative to input size",
        "Big O notation describes upper bounds of complexity",
      ],
      subsections: [
        {
          id: "s1.1",
          title: "Time Complexity",
          content:
            "Time complexity analysis helps us understand how the runtime of an algorithm grows as the input size increases. This is essential for choosing the right algorithm for a given problem size.",
          keyPoints: [
            "O(1) - Constant time: Runtime doesn't change with input size",
            "O(log n) - Logarithmic time: Runtime grows logarithmically",
            "O(n) - Linear time: Runtime grows linearly with input",
            "O(n²) - Quadratic time: Runtime grows quadratically",
          ],
          examples: ["Array access: O(1)", "Binary search: O(log n)", "Linear search: O(n)", "Bubble sort: O(n²)"],
        },
        {
          id: "s1.2",
          title: "Space Complexity",
          content:
            "Space complexity measures the amount of memory an algorithm uses relative to its input size. This includes both auxiliary space and the space used by the input itself.",
          keyPoints: [
            "Auxiliary space is extra memory used by the algorithm",
            "In-place algorithms use O(1) extra space",
            "Recursive algorithms often have O(n) space due to call stack",
            "Trade-offs exist between time and space complexity",
          ],
          examples: [
            "Iterative algorithms often use O(1) space",
            "Recursive factorial: O(n) space",
            "Merge sort: O(n) auxiliary space",
            "Quick sort: O(log n) average space",
          ],
        },
      ],
    },
    {
      id: "s2",
      title: "Data Structures",
      content:
        "Data structures are ways of organizing and storing data to enable efficient access and modification. Choosing the right data structure is fundamental to algorithm design.",
      keyPoints: [
        "Arrays provide constant-time access by index",
        "Linked lists allow dynamic size but sequential access",
        "Stacks follow Last-In-First-Out (LIFO) principle",
        "Queues follow First-In-First-Out (FIFO) principle",
        "Trees provide hierarchical organization",
        "Hash tables offer average O(1) lookup time",
      ],
      subsections: [
        {
          id: "s2.1",
          title: "Linear Data Structures",
          content:
            "Linear data structures organize elements in a sequential manner, where each element has a unique predecessor and successor (except for the first and last elements).",
          keyPoints: [
            "Arrays: Fixed size, contiguous memory, O(1) access",
            "Dynamic arrays: Resizable, amortized O(1) insertion",
            "Linked lists: Dynamic size, O(n) access, O(1) insertion/deletion",
            "Stacks: LIFO operations, used in function calls and expression evaluation",
            "Queues: FIFO operations, used in scheduling and breadth-first search",
          ],
          examples: [
            "Array: [1, 2, 3, 4, 5]",
            "Stack operations: push(), pop(), peek()",
            "Queue operations: enqueue(), dequeue(), front()",
            "Linked list: Node -> Node -> Node -> null",
          ],
        },
        {
          id: "s2.2",
          title: "Non-Linear Data Structures",
          content:
            "Non-linear data structures organize elements in a hierarchical or network-like manner, allowing for more complex relationships between elements.",
          keyPoints: [
            "Trees: Hierarchical structure with root, internal nodes, and leaves",
            "Binary trees: Each node has at most two children",
            "Binary search trees: Left subtree < root < right subtree",
            "Graphs: Vertices connected by edges, can be directed or undirected",
            "Hash tables: Key-value pairs with hash function for indexing",
          ],
          examples: [
            "Binary tree traversals: inorder, preorder, postorder",
            "Graph representations: adjacency matrix, adjacency list",
            "Hash function: h(key) = key % table_size",
            "Tree applications: file systems, decision trees, parsing",
          ],
        },
      ],
    },
    {
      id: "s3",
      title: "Programming Paradigms",
      content:
        "Programming paradigms are fundamental styles of programming that provide different approaches to structuring and organizing code. Understanding various paradigms helps in choosing the right approach for different problems.",
      keyPoints: [
        "Procedural programming focuses on functions and procedures",
        "Object-oriented programming organizes code around objects and classes",
        "Functional programming treats computation as evaluation of functions",
        "Declarative programming describes what should be done, not how",
      ],
      subsections: [
        {
          id: "s3.1",
          title: "Object-Oriented Programming",
          content:
            "OOP is based on the concept of objects, which contain data (attributes) and code (methods). It promotes code reusability, modularity, and maintainability through key principles.",
          keyPoints: [
            "Encapsulation: Bundling data and methods together",
            "Inheritance: Creating new classes based on existing ones",
            "Polymorphism: Objects of different types responding to the same interface",
            "Abstraction: Hiding complex implementation details",
          ],
          examples: [
            "Class definition with attributes and methods",
            "Inheritance: class Dog extends Animal",
            "Polymorphism: different objects implementing same interface",
            "Encapsulation: private variables with public methods",
          ],
        },
      ],
    },
  ],
}

interface StudyGuideDisplayProps {
  guideId: string
}

export function StudyGuideDisplay({ guideId }: StudyGuideDisplayProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(["s1"]))
  const [readSections, setReadSections] = useState<Set<string>>(new Set())
  const [activeSection, setActiveSection] = useState<string | null>(null)

  const guide = mockStudyGuide

  const toggleSection = (sectionId: string) => {
    const newOpenSections = new Set(openSections)
    if (newOpenSections.has(sectionId)) {
      newOpenSections.delete(sectionId)
    } else {
      newOpenSections.add(sectionId)
    }
    setOpenSections(newOpenSections)
  }

  const markAsRead = (sectionId: string) => {
    setReadSections((prev) => new Set([...prev, sectionId]))
  }

  const calculateProgress = () => {
    const totalSections = guide.sections.reduce((acc, section) => {
      return acc + 1 + (section.subsections?.length || 0)
    }, 0)
    return (readSections.size / totalSections) * 100
  }

  const renderSection = (section: StudyGuideSection, level = 0) => {
    const isOpen = openSections.has(section.id)
    const isRead = readSections.has(section.id)
    const hasSubsections = section.subsections && section.subsections.length > 0

    return (
      <div key={section.id} className={cn("mb-4", level > 0 && "ml-6")}>
        <Collapsible open={isOpen} onOpenChange={() => toggleSection(section.id)}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start p-4 h-auto text-left hover:bg-accent/10"
              onClick={() => setActiveSection(section.id)}
            >
              <div className="flex items-center space-x-3 w-full">
                {hasSubsections &&
                  (isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />)}
                <div className="flex-1">
                  <h3
                    className={cn(
                      "font-semibold text-left",
                      level === 0 ? "text-lg" : "text-base",
                      isRead && "text-muted-foreground",
                    )}
                  >
                    {section.title}
                  </h3>
                </div>
                <div className="flex items-center space-x-2">
                  {isRead && <Eye className="h-4 w-4 text-green-600" />}
                  <Badge variant={level === 0 ? "default" : "secondary"}>{level === 0 ? "Chapter" : "Section"}</Badge>
                </div>
              </div>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 pt-4">
            <Card className="bg-card/60 backdrop-blur-sm border-border/50">
              <CardContent className="p-6">
                <p className="text-foreground leading-relaxed mb-4">{section.content}</p>

                {section.keyPoints && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-foreground mb-2 flex items-center">
                      <Target className="h-4 w-4 mr-2 text-primary" />
                      Key Points
                    </h4>
                    <ul className="space-y-2">
                      {section.keyPoints.map((point, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                          <span className="text-muted-foreground">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {section.examples && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-foreground mb-2 flex items-center">
                      <BookOpen className="h-4 w-4 mr-2 text-accent" />
                      Examples
                    </h4>
                    <div className="bg-secondary/50 rounded-lg p-4">
                      <ul className="space-y-1">
                        {section.examples.map((example, index) => (
                          <li key={index} className="text-sm font-mono text-muted-foreground">
                            {example}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                <div className="flex justify-end">
                  <Button
                    size="sm"
                    variant={isRead ? "secondary" : "default"}
                    onClick={() => markAsRead(section.id)}
                    disabled={isRead}
                  >
                    {isRead ? (
                      <>
                        <Eye className="h-4 w-4 mr-2" />
                        Read
                      </>
                    ) : (
                      <>
                        <Bookmark className="h-4 w-4 mr-2" />
                        Mark as Read
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {section.subsections?.map((subsection) => renderSection(subsection, level + 1))}
          </CollapsibleContent>
        </Collapsible>
      </div>
    )
  }

  const filteredSections = guide.sections.filter(
    (section) =>
      section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.content.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">PrepCraft</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Print className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Button variant="ghost" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="ghost" asChild>
                <a href="/dashboard">
                  <Home className="w-4 h-4 mr-2" />
                  Dashboard
                </a>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Table of Contents */}
          <div className="lg:col-span-1">
            <Card className="bg-card/60 backdrop-blur-sm border-border/50 sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Table of Contents</CardTitle>
                <CardDescription>Navigate through the study guide</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-2">
                    {guide.sections.map((section, index) => (
                      <div key={section.id}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start text-left h-auto p-2"
                          onClick={() => {
                            setActiveSection(section.id)
                            if (!openSections.has(section.id)) {
                              toggleSection(section.id)
                            }
                          }}
                        >
                          <div className="flex items-center space-x-2 w-full">
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">{index + 1}</span>
                            <span className="flex-1 text-sm">{section.title}</span>
                            {readSections.has(section.id) && <Eye className="h-3 w-3 text-green-600" />}
                          </div>
                        </Button>
                        {section.subsections?.map((subsection, subIndex) => (
                          <Button
                            key={subsection.id}
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-left h-auto p-2 ml-4"
                            onClick={() => setActiveSection(subsection.id)}
                          >
                            <div className="flex items-center space-x-2 w-full">
                              <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">
                                {index + 1}.{subIndex + 1}
                              </span>
                              <span className="flex-1 text-xs">{subsection.title}</span>
                              {readSections.has(subsection.id) && <Eye className="h-3 w-3 text-green-600" />}
                            </div>
                          </Button>
                        ))}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">{guide.title}</h1>
                  <p className="text-muted-foreground">{guide.description}</p>
                </div>
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{guide.estimatedReadTime} min read</span>
                </Badge>
              </div>

              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-foreground">Reading Progress</span>
                  <span className="text-sm text-muted-foreground">{readSections.size} sections completed</span>
                </div>
                <Progress value={calculateProgress()} className="h-2" />
              </div>

              {/* Search */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search within this study guide..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Study Guide Content */}
            <div className="space-y-6">{filteredSections.map((section) => renderSection(section))}</div>

            {filteredSections.length === 0 && searchQuery && (
              <Card className="bg-card/60 backdrop-blur-sm border-border/50">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Search className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No results found</h3>
                  <p className="text-muted-foreground text-center">
                    Try adjusting your search terms or browse the table of contents.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
