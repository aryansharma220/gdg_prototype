"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { motion } from "framer-motion"
import { BookOpen, Cpu, Users, Mail, ArrowRight, ChevronLeft, ChevronRight, MessageSquare } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function AboutPage() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  
  const testimonials = [
    {
      text: "CourseGemini transformed my learning experience. The AI-generated courses are tailored perfectly to my pace and learning style.",
      author: "Sarah Johnson",
      role: "Software Engineer"
    },
    {
      text: "As an educator, I'm impressed by the quality of content CourseGemini produces. It's like having a teaching assistant that works 24/7.",
      author: "Dr. Michael Chen",
      role: "University Professor"
    },
    {
      text: "I've tried many online learning platforms, but none compare to CourseGemini's personalized approach. My productivity has increased tremendously.",
      author: "Elena Rodriguez",
      role: "Data Scientist"
    }
  ];
  
  const teamMembers = [
    {
      name: "Alex Rivera",
      role: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
    },
    {
      name: "Taylor Morgan",
      role: "AI Director",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
    },
    {
      name: "Jordan Lee",
      role: "Lead Developer",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
    },
    {
      name: "Sam Patel",
      role: "Education Expert",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      
      {/* Hero Section */}
      <div className="pt-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-transparent z-0"></div>
        <div className="container mx-auto px-4 py-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <motion.h1 
              className="text-5xl font-bold text-slate-900 dark:text-white mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Revolutionizing <span className="text-purple-600">Education</span> with AI
            </motion.h1>
            <motion.p 
              className="text-xl text-slate-600 dark:text-slate-300 mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              We're combining the power of Google's Gemini AI with personalized learning experiences 
              to create the future of education.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Link href="/courses" 
                className="bg-purple-600 hover:bg-purple-700 transition-colors text-white px-8 py-3 rounded-full font-medium inline-flex items-center mr-4">
                Explore Courses <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link href="#contact" 
                className="bg-transparent border-2 border-purple-600 text-purple-600 hover:bg-purple-600/10 px-8 py-3 rounded-full font-medium transition-colors inline-flex items-center">
                Contact Us <MessageSquare className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-24">
        <motion.h2 
          className="text-3xl font-bold text-center mb-16 text-slate-900 dark:text-white"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          What Sets Us Apart
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto mb-16">
          {[
            {
              icon: <Cpu className="h-10 w-10 text-purple-600" />,
              title: "AI-Powered Learning",
              description: "Using Google's Gemini API to create dynamic, adaptive courses that evolve with your learning progress.",
            },
            {
              icon: <Users className="h-10 w-10 text-purple-600" />,
              title: "Community Driven",
              description: "Join thousands of learners sharing knowledge, insights, and experiences in our vibrant community.",
            },
            {
              icon: <BookOpen className="h-10 w-10 text-purple-600" />,
              title: "Quality Content",
              description: "Every piece of content is verified by subject matter experts to ensure accuracy and relevance.",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              className="text-center p-8 rounded-2xl bg-white dark:bg-slate-800 shadow-md border border-slate-100 dark:border-slate-700 transition-all duration-300"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-purple-100 dark:bg-purple-900/30 mb-6">
                {item.icon}
              </div>
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">{item.title}</h3>
              <p className="text-slate-600 dark:text-slate-300 text-lg">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Mission Section */}
      <div className="bg-gradient-to-br from-purple-100 to-slate-100 dark:from-slate-800 dark:to-purple-900/30 py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.h2 
              className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Our Mission
            </motion.h2>
            
            <motion.div 
              className="prose prose-lg dark:prose-invert mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-xl">
                At CourseGemini, we believe that everyone deserves access to high-quality education. Our mission is to
                democratize learning by leveraging artificial intelligence to create personalized, engaging courses that
                adapt to each learner's needs.
              </p>
              
              <p className="text-xl">
                Powered by Google's Gemini API, our platform uses state-of-the-art AI to generate comprehensive courses,
                complete with interactive elements, assessments, and visual aids. The content is dynamically adjusted based
                on your progress and learning style.
              </p>
              
              <p className="text-xl">
                Whether you're a student, professional, or lifelong learner, CourseGemini provides the tools and resources
                you need to achieve your educational goals. Join our growing community of learners and start your journey
                today.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Team Section */}
      {/* <div className="container mx-auto px-4 py-24">
        <motion.h2 
          className="text-3xl font-bold text-center mb-16 text-slate-900 dark:text-white"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Meet Our Team
        </motion.h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {teamMembers.map((member, index) => (
            <motion.div 
              key={index}
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="mb-5 rounded-xl overflow-hidden mx-auto w-48 h-48 relative">
                <Image 
                  src={member.image} 
                  alt={member.name} 
                  fill 
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{member.name}</h3>
              <p className="text-purple-600 dark:text-purple-400">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </div> */}
      
      {/* Testimonials Section */}
      <div className="bg-slate-100 dark:bg-slate-800/50 py-24">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-3xl font-bold text-center mb-16 text-slate-900 dark:text-white"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            What Our Users Say
          </motion.h2>
          
          <div className="max-w-4xl mx-auto relative">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-10 mb-8">
              {testimonials.map((testimonial, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: index === activeTestimonial ? 1 : 0, x: index === activeTestimonial ? 0 : (index < activeTestimonial ? -20 : 20) }}
                  transition={{ duration: 0.5 }}
                  className={`${index === activeTestimonial ? 'block' : 'hidden'}`}
                >
                  <p className="text-xl italic mb-6 text-slate-700 dark:text-slate-300">"{testimonial.text}"</p>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{testimonial.author}</p>
                    <p className="text-purple-600 dark:text-purple-400">{testimonial.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="flex justify-center gap-3">
              <button 
                onClick={() => setActiveTestimonial(prev => (prev === 0 ? testimonials.length - 1 : prev - 1))}
                className="bg-white dark:bg-slate-800 rounded-full p-2 shadow-md hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
              >
                <ChevronLeft className="h-6 w-6 text-purple-600" />
              </button>
              <div className="flex gap-2 items-center">
                {testimonials.map((_, index) => (
                  <button 
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`h-3 rounded-full transition-all ${index === activeTestimonial ? 'w-6 bg-purple-600' : 'w-3 bg-slate-300 dark:bg-slate-600'}`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
              <button 
                onClick={() => setActiveTestimonial(prev => (prev === testimonials.length - 1 ? 0 : prev + 1))}
                className="bg-white dark:bg-slate-800 rounded-full p-2 shadow-md hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
              >
                <ChevronRight className="h-6 w-6 text-purple-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Contact Section */}
      <div id="contact" className="container mx-auto px-4 py-24">
        <motion.h2 
          className="text-3xl font-bold text-center mb-16 text-slate-900 dark:text-white"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Get In Touch
        </motion.h2>
        
        <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Contact Information</h3>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Have questions about CourseGemini? We're here to help you on your learning journey.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="bg-purple-100 dark:bg-purple-900/30 rounded-full p-3 mr-3">
                    <Mail className="h-5 w-5 text-purple-600" />
                  </div>
                  <span className="text-slate-700 dark:text-slate-300">hello@coursegemini.com</span>
                </div>
              </div>
            </motion.div>
            
            <motion.form 
              className="space-y-4"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1" htmlFor="name">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  className="w-full px-4 py-2 rounded-lg border dark:bg-slate-700 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full px-4 py-2 rounded-lg border dark:bg-slate-700 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1" htmlFor="message">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border dark:bg-slate-700 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="How can we help you?"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Send Message
              </button>
            </motion.form>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} CourseGemini. All rights reserved.</p>
          <p className="mt-2">Powered by Google's Gemini API</p>
        </div>
      </footer>
    </div>
  )
}
