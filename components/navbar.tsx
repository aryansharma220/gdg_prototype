"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen, Menu, X } from "lucide-react"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  return (
    <nav className="fixed top-0 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-50 border-b border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            <span className="text-xl font-bold text-slate-900 dark:text-white">CourseGemini</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/explore" className="text-slate-600 hover:text-purple-600 dark:text-slate-300 dark:hover:text-purple-400">
              Explore
            </Link>
            <Link href="/pricing" className="text-slate-600 hover:text-purple-600 dark:text-slate-300 dark:hover:text-purple-400">
              Pricing
            </Link>
            <Link href="/about" className="text-slate-600 hover:text-purple-600 dark:text-slate-300 dark:hover:text-purple-400">
              About
            </Link>
            <Link href="/contact" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
              Contact
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-slate-600 dark:text-slate-300"
            >
              {theme === "dark" ? "🌞" : "🌙"}
            </Button>
            <Link href="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">Sign up</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-slate-600 dark:text-slate-300" />
            ) : (
              <Menu className="h-6 w-6 text-slate-600 dark:text-slate-300" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800"
          >
            <div className="container mx-auto px-4 py-4 space-y-4">
              <Link href="/explore" className="block text-slate-600 hover:text-purple-600 dark:text-slate-300 dark:hover:text-purple-400">
                Explore
              </Link>
              <Link href="/pricing" className="block text-slate-600 hover:text-purple-600 dark:text-slate-300 dark:hover:text-purple-400">
                Pricing
              </Link>
              <Link href="/about" className="block text-slate-600 hover:text-purple-600 dark:text-slate-300 dark:hover:text-purple-400">
                About
              </Link>
              <Link href="/contact" className="block text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
                Contact
              </Link>
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <Link href="/login">
                  <Button variant="ghost" className="w-full mb-2">Log in</Button>
                </Link>
                <Link href="/signup">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">Sign up</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
