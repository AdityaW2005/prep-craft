import { UploadInterface } from "@/components/upload-interface"

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-foreground">PrepCraft</span>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                Back to Home
              </a>
            </div>
          </div>
        </div>
      </nav>

      <UploadInterface />
    </div>
  )
}
