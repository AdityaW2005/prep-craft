"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import {
  Upload,
  FileText,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  File,
  BookOpen,
  Sparkles,
  LogIn,
  LogOut,
  FileIcon,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Navigation } from "@/components/navigation"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { QuizInterface } from "@/components/quiz-interface"
import { FlashcardViewer } from "@/components/flashcard-viewer"

interface UploadedFile {
  id: string
  name: string
  size: number
  status: "uploading" | "processing" | "completed" | "error"
  progress: number
  error?: string
  text?: string
  quiz?: any
  flashcards?: any
}

const getFileIcon = (fileName: string) => {
  if (fileName.endsWith(".pdf")) return <FileIcon className="w-8 h-8 text-red-500" />
  if (fileName.endsWith(".doc") || fileName.endsWith(".docx")) return <FileIcon className="w-8 h-8 text-blue-500" />
  if (fileName.endsWith(".ppt") || fileName.endsWith(".pptx")) return <FileIcon className="w-8 h-8 text-orange-500" />
  return <FileText className="w-8 h-8 text-primary" />
}

export function UploadInterface() {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeFile, setActiveFile] = useState<UploadedFile | null>(null)
  const { data: session } = useSession()

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const validateFile = (file: File): string | null => {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ]
    if (!allowedTypes.includes(file.type)) {
      return "Only PDF, Word, and PowerPoint files are allowed"
    }
    if (file.size > 50 * 1024 * 1024) {
      // 50MB limit
      return "File size must be less than 50MB"
    }
    return null
  }

  const handleGenerate = async (text: string, fileId: string) => {
    setIsGenerating(true)
    try {
      const [quizResponse, flashcardsResponse] = await Promise.all([
        fetch("/api/generate-quiz", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        }),
        fetch("/api/generate-flashcards", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        }),
      ])

      if (!quizResponse.ok || !flashcardsResponse.ok) {
        throw new Error("Failed to generate content")
      }

      const quizData = await quizResponse.json()
      const flashcardsData = await flashcardsResponse.json()

      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? { ...f, status: "completed", quiz: quizData.quiz, flashcards: flashcardsData.flashcards }
            : f,
        ),
      )
    } catch (error: any) {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId ? { ...f, status: "error", error: error.message || "Generation failed" } : f,
        ),
      )
    } finally {
      setIsGenerating(false)
    }
  }

  const handleUpload = async (file: File, fileId: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, status: "uploading", progress: 0 } : f)),
    )

    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/parse-file", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "File processing failed")
      }

      const result = await response.json()
      setFiles((prev) =>
        prev.map((f) => (f.id === fileId ? { ...f, status: "processing", text: result.text } : f)),
      )
      await handleGenerate(result.text, fileId)
    } catch (error: any) {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? { ...f, status: "error", error: error.message || "Upload failed" }
            : f,
        ),
      )
    }
  }

  const handleFiles = useCallback((fileList: FileList) => {
    const newFiles: UploadedFile[] = []

    Array.from(fileList).forEach((file) => {
      const error = validateFile(file)
      const fileId = Math.random().toString(36).substr(2, 9)

      if (error) {
        newFiles.push({
          id: fileId,
          name: file.name,
          size: file.size,
          status: "error",
          progress: 0,
          error,
        })
      } else {
        const newFile: UploadedFile = {
          id: fileId,
          name: file.name,
          size: file.size,
          status: "uploading",
          progress: 0,
        }
        newFiles.push(newFile)
        handleUpload(file, fileId)
      }
    })

    setFiles((prev) => [...prev, ...newFiles])
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      const files = e.dataTransfer.files
      if (files.length > 0) {
        handleFiles(files)
      }
    },
    [handleFiles],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files && files.length > 0) {
        handleFiles(files)
      }
    },
    [handleFiles],
  )

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId))
    if (activeFile?.id === fileId) {
      setActiveFile(null)
    }
  }

  const completedFiles = files.filter((f) => f.status === "completed")

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-blue-50/50">
      <Navigation currentPage="upload" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <BreadcrumbNav items={[{ label: "Upload", current: true }]} className="mb-6" />

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4 tracking-tight">
            Unlock Your Study Superpowers
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Drag and drop your study materials—PDFs, Word documents, or PowerPoint presentations. Our AI will
            instantly craft quizzes and flashcards to accelerate your learning.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            {/* Upload Zone */}
            <Card className="mb-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-6 h-6 text-primary" />
                  Upload Your Files
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div
                  className={cn(
                    "border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300",
                    isDragOver
                      ? "border-primary bg-primary/10 scale-105 shadow-inner"
                      : "border-border hover:border-primary/50 hover:bg-accent/50",
                  )}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  <div className="flex flex-col items-center space-y-4">
                    <div className="flex space-x-4 text-gray-400">
                      <FileIcon className="w-12 h-12 text-red-400" />
                      <FileIcon className="w-12 h-12 text-blue-400" />
                      <FileIcon className="w-12 h-12 text-orange-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-1">Drop your files here</h3>
                      <p className="text-muted-foreground text-sm mb-4">or click to browse</p>
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx,.ppt,.pptx"
                        onChange={handleFileInput}
                        className="hidden"
                        id="file-upload"
                      />
                      <label htmlFor="file-upload">
                        <Button className="cursor-pointer" asChild>
                          <span>Choose Files</span>
                        </Button>
                      </label>
                    </div>
                    <div className="text-xs text-muted-foreground pt-2">
                      <p>Supported: PDF, DOCX, PPTX • Max size: 50MB</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* File List */}
            {files.length > 0 && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>File Queue ({files.length})</CardTitle>
                  <CardDescription>Your uploaded files and their status.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center space-x-4 p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex-shrink-0">{getFileIcon(file.name)}</div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant={
                                file.status === "error"
                                  ? "destructive"
                                  : file.status === "completed"
                                    ? "default"
                                    : "secondary"
                              }
                              className="capitalize"
                            >
                              {file.status}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(file.id)}
                              className="h-6 w-6 p-0"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>{formatFileSize(file.size)}</span>
                          {file.status === "uploading" && <span>{Math.round(file.progress)}%</span>}
                        </div>

                        {(file.status === "uploading" || file.status === "processing") && (
                          <Progress value={file.progress} className="h-1.5 mt-1" />
                        )}

                        {file.status === "processing" && (
                          <div className="flex items-center space-x-2 mt-1.5 text-xs text-muted-foreground">
                            <Loader2 className="w-3 h-3 animate-spin text-primary" />
                            <span>AI is analyzing your document...</span>
                          </div>
                        )}

                        {file.error && (
                          <Alert variant="destructive" className="mt-2 p-2 text-xs">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{file.error}</AlertDescription>
                          </Alert>
                        )}

                        {file.status === "completed" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2 h-8"
                            onClick={() => setActiveFile(file)}
                          >
                            <Sparkles className="w-4 h-4 mr-2" />
                            View Content
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          <div className="lg:sticky top-24 h-fit">
            <Card className="shadow-lg min-h-[600px]">
              <CardHeader>
                <CardTitle>Generated Content</CardTitle>
                <CardDescription>
                  {activeFile
                    ? `Showing content for ${activeFile.name}`
                    : "Select a completed file to view its quiz and flashcards."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {activeFile ? (
                  <Tabs defaultValue="quiz">
                    <TabsList>
                      <TabsTrigger value="quiz">Quiz</TabsTrigger>
                      <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
                    </TabsList>
                    <TabsContent value="quiz">
                      {activeFile.quiz ? (
                        <QuizInterface quizData={activeFile.quiz} />
                      ) : (
                        <p>No quiz data available.</p>
                      )}
                    </TabsContent>
                    <TabsContent value="flashcards">
                      {activeFile.flashcards ? (
                        <FlashcardViewer flashcards={activeFile.flashcards} />
                      ) : (
                        <p>No flashcards available.</p>
                      )}
                    </TabsContent>
                  </Tabs>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8">
                    <BookOpen className="w-16 h-16 mb-4" />
                    <h3 className="text-lg font-semibold">Your study materials will appear here</h3>
                    <p className="text-sm">
                      Once a file is processed, click "View Content" to see the generated quiz and flashcards.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
