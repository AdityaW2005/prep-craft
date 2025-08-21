"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Brain, Upload, LayoutDashboard, BookOpen, CreditCard, Settings, LogOut, Menu, User, Bell } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavigationProps {
  currentPage?: string
  showMobileMenu?: boolean
}

export function Navigation({ currentPage, showMobileMenu = true }: NavigationProps) {
  const [notifications] = useState(3) // Mock notification count

  const navigationItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      current: currentPage === "dashboard",
    },
    {
      name: "Upload",
      href: "/upload",
      icon: Upload,
      current: currentPage === "upload",
    },
    {
      name: "Study Materials",
      href: "/dashboard",
      icon: BookOpen,
      current: currentPage === "materials",
    },
  ]

  const NavItems = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={cn("flex gap-1", mobile ? "flex-col space-y-1" : "items-center")}>
      {navigationItems.map((item) => (
        <Button
          key={item.name}
          variant={item.current ? "default" : "ghost"}
          size={mobile ? "default" : "sm"}
          asChild
          className={cn(
            mobile && "justify-start",
            !mobile && "text-muted-foreground hover:text-foreground",
            item.current && !mobile && "bg-primary text-primary-foreground",
          )}
        >
          <a href={item.href}>
            <item.icon className="w-4 h-4 mr-2" />
            {item.name}
          </a>
        </Button>
      ))}
    </div>
  )

  return (
    <nav className="border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <a href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">PrepCraft</span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <NavItems />
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-4 h-4" />
              {notifications > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {notifications}
                </Badge>
              )}
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/diverse-user-avatars.png" alt="User" />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">John Doe</p>
                    <p className="text-xs leading-none text-muted-foreground">john@example.com</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>Billing</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            {showMobileMenu && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="md:hidden">
                    <Menu className="w-4 h-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-64">
                  <div className="flex flex-col space-y-4 mt-4">
                    <div className="flex items-center space-x-2 pb-4 border-b border-border">
                      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <Brain className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <span className="text-xl font-bold text-foreground">PrepCraft</span>
                    </div>
                    <NavItems mobile />
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
