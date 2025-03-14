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

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    agreeTos: false
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (session) {
      router.push('/dashboard');
    }
  }, [session, router]);

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
    if (!formData.name || !formData.email || !formData.password) {
      setError("All fields are required");
      return;
    }
    
    if (!formData.agreeTos) {
      setError("You must agree to the Terms of Service and Privacy Policy");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      // First, register the user via API
      const registerResponse = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        }),
      });

      const registerData = await registerResponse.json();
      
      if (!registerResponse.ok) {
        throw new Error(registerData.error || "Registration failed");
      }
      
      // If registration successful, sign in with the new credentials
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
        callbackUrl
      });

      if (result?.error) {
        setError("Registration succeeded but login failed. Please go to the login page.");
        setIsLoading(false);
        return;
      }

      setSuccess(true);
      // Automatic redirect handled by the useEffect watching session
      
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  const handleSocialSignup = async (provider: string) => {
    setIsLoading(true);
    try {
      await signIn(provider, { callbackUrl });
    } catch (err) {
      setError(`Failed to sign up with ${provider}`);
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
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Create an account</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">Start your learning journey today</p>
          </div>
          
          {success ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-8 p-4 bg-green-50 dark:bg-green-900/30 rounded-lg flex items-center gap-3 text-green-700 dark:text-green-300"
            >
              <CheckCircle className="h-5 w-5" />
              <p>Account created successfully! Redirecting...</p>
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
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Full name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    className="mt-1"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
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
                    autoComplete="new-password"
                    required
                    className="mt-1"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    name="agreeTos"
                    type="checkbox"
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-slate-300 rounded"
                    checked={formData.agreeTos}
                    onChange={handleChange}
                  />
                  <span className="ml-2 block text-sm text-slate-600 dark:text-slate-300">
                    I agree to the{" "}
                    <Link href="/terms" className="text-purple-600 hover:text-purple-500">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-purple-600 hover:text-purple-500">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
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
                      Creating account...
                    </>
                  ) : "Sign up"}
                </Button>
              </motion.div>

              <div className="mt-4">
                <p className="text-center text-sm text-slate-600 dark:text-slate-300">
                  Already have an account?{" "}
                  <Link href="/login" className="text-purple-600 hover:text-purple-500">
                    Sign in
                  </Link>
                </p>
                
                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-300 dark:border-slate-600"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                        Or sign up with
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleSocialSignup('google')}
                      className="w-full inline-flex items-center justify-center py-2 px-4 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600"
                      disabled={isLoading}
                    >
                      <FcGoogle className="mr-2 h-5 w-5" />
                      Google
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSocialSignup('github')}
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
