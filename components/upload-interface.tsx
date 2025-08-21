"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, FileText, X, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Navigation } from "@/components/navigation"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"

interface UploadedFile {
  id: string
  name: string
  size: number
  status: "uploading" | "processing" | "completed" | "error"
  progress: number
  error?: string
}

export function UploadInterface() {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const validateFile = (file: File): string | null => {
    if (file.type !== "application/pdf") {
      return "Only PDF files are allowed"
    }
    if (file.size > 50 * 1024 * 1024) {
      // 50MB limit
      return "File size must be less than 50MB"
    }
    return null
  }

  const simulateUpload = (fileId: string) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 15
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
        setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, status: "processing", progress: 100 } : f)))
        // Simulate processing
        setTimeout(() => {
          setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, status: "completed" } : f)))
        }, 2000)
      } else {
        setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, progress } : f)))
      }
    }, 200)
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
        newFiles.push({
          id: fileId,
          name: file.name,
          size: file.size,
          status: "uploading",
          progress: 0,
        })
        // Start upload simulation
        setTimeout(() => simulateUpload(fileId), 100)
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
  }

  const processAllFiles = () => {
    setIsProcessing(true)
    // Simulate processing all completed files
    setTimeout(() => {
      setIsProcessing(false)
      // Navigate to dashboard or show success message
    }, 3000)
  }

  const completedFiles = files.filter((f) => f.status === "completed")
  const hasErrors = files.some((f) => f.status === "error")

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentPage="upload" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <BreadcrumbNav items={[{ label: "Upload", current: true }]} className="mb-6" />

        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Upload Your Study Materials</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Upload your PDF documents and let our AI transform them into interactive study materials.
          </p>
        </div>

        {/* Upload Zone */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-12 text-center transition-all duration-200",
                isDragOver
                  ? "border-primary bg-primary/5 scale-105"
                  : "border-border hover:border-primary/50 hover:bg-accent/5",
              )}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Drop your PDF files here</h3>
                  <p className="text-muted-foreground mb-4">or click to browse from your computer</p>
                  <input
                    type="file"
                    multiple
                    accept=".pdf"
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
                <div className="text-sm text-muted-foreground">
                  <p>Supported format: PDF • Maximum size: 50MB per file</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* File List */}
        {files.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Uploaded Files ({files.length})</span>
                {completedFiles.length > 0 && !isProcessing && (
                  <Button onClick={processAllFiles} className="ml-4">
                    <Loader2 className="w-4 h-4 mr-2" />
                    Generate Study Materials
                  </Button>
                )}
              </CardTitle>
              <CardDescription>Track the progress of your file uploads and processing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {files.map((file) => (
                <div key={file.id} className="flex items-center space-x-4 p-4 border border-border rounded-lg">
                  <div className="flex-shrink-0">
                    {file.status === "error" ? (
                      <AlertCircle className="w-8 h-8 text-destructive" />
                    ) : file.status === "completed" ? (
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    ) : (
                      <FileText className="w-8 h-8 text-primary" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
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
                        >
                          {file.status === "uploading"
                            ? "Uploading"
                            : file.status === "processing"
                              ? "Processing"
                              : file.status === "completed"
                                ? "Ready"
                                : "Error"}
                        </Badge>
                        <Button variant="ghost" size="sm" onClick={() => removeFile(file.id)} className="h-6 w-6 p-0">
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                      <span>{formatFileSize(file.size)}</span>
                      {file.status === "uploading" && <span>{Math.round(file.progress)}%</span>}
                    </div>

                    {file.status === "uploading" && <Progress value={file.progress} className="h-2" />}

                    {file.status === "processing" && (
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                        <span className="text-sm text-muted-foreground">AI is analyzing your document...</span>
                      </div>
                    )}

                    {file.error && (
                      <Alert className="mt-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{file.error}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Processing Status */}
        {isProcessing && (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                <h3 className="text-xl font-semibold text-foreground">Generating Study Materials</h3>
                <p className="text-muted-foreground">
                  Our AI is creating quizzes, flashcards, and study guides from your documents...
                </p>
                <Progress value={66} className="w-full max-w-md" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Success State */}
        {completedFiles.length > 0 && !isProcessing && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {completedFiles.length} file{completedFiles.length > 1 ? "s" : ""} uploaded successfully! Ready to
              generate study materials.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}
