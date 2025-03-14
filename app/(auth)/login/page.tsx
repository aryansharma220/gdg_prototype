"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BookOpen, Loader2, CheckCircle, AlertCircle, Github } from "lucide-react"
import { motion } from "framer-motion"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn, useSession } from "next-auth/react"
import { FcGoogle } from "react-icons/fc"

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const errorFromQuery = searchParams.get("error");
  
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });

  // Set error from query parameter if present
  useEffect(() => {
    if (errorFromQuery) {
      if (errorFromQuery === "CredentialsSignin") {
        setError("Invalid email or password");
      } else {
        setError(`Authentication error: ${errorFromQuery}`);
      }
    }
  }, [errorFromQuery]);

  // Redirect if already authenticated
  useEffect(() => {
    if (session) {
      router.push(callbackUrl);
    }
  }, [session, router, callbackUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Validate form
    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      return;
    }

    setIsLoading(true);
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
        callbackUrl
      });

      if (result?.error) {
        setError("Invalid email or password");
        setIsLoading(false);
        return;
      }

      setSuccess(true);
      // Redirect is handled by the session change in useEffect
      
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    setIsLoading(true);
    try {
      await signIn(provider, { callbackUrl });
    } catch (err) {
      setError(`Failed to sign in with ${provider}`);
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-slate-900 dark:via-purple-900/10 dark:to-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 dark:bg-grid-white/5 bg-grid-black/5 bg-[size:20px_20px]" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full relative"
      >
        <div className="absolute inset-0 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl shadow-purple-500/10 blur" />
        <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700">
          <div className="text-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/" className="inline-flex items-center justify-center gap-2 mb-8">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
                  CourseGemini
                </span>
              </Link>
            </motion.div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Welcome back</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">Sign in to your account</p>
          </div>

          {success ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-8 p-4 bg-green-50 dark:bg-green-900/30 rounded-lg flex items-center gap-3 text-green-700 dark:text-green-300"
            >
              <CheckCircle className="h-5 w-5" />
              <p>Login successful! Redirecting...</p>
            </motion.div>
          ) : (
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/30 rounded-lg flex items-center gap-2 text-red-700 dark:text-red-300">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <p className="text-sm">{error}</p>
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Email address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="mt-1"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="mt-1"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="rememberMe"
                    type="checkbox"
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-slate-300 rounded"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600 dark:text-slate-300">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link href="/forgot-password" className="text-purple-600 hover:text-purple-500">
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : "Sign in"}
                </Button>
              </motion.div>

              <div className="mt-6">
                <p className="text-center text-sm text-slate-600 dark:text-slate-300">
                  Don't have an account?{" "}
                  <Link href="/signup" className="text-purple-600 hover:text-purple-500">
                    Sign up
                  </Link>
                </p>
                
                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-300 dark:border-slate-600"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                        Or continue with
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleSocialLogin('google')}
                      className="w-full inline-flex items-center justify-center py-2 px-4 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600"
                      disabled={isLoading}
                    >
                      <FcGoogle className="mr-2 h-5 w-5" />
                      Google
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSocialLogin('github')}
                      className="w-full inline-flex items-center justify-center py-2 px-4 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600"
                      disabled={isLoading}
                    >
                      <Github className="mr-2 h-5 w-5" />
                      GitHub
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  )
}
