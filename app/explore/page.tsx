"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Brain, Search, Filter, Star, Clock, BookOpen, X, ChevronDown, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

const courses = [
  {
    id: "course-1",
    title: "Machine Learning Fundamentals",
    description: "Learn the basics of machine learning algorithms and their applications",
    modules: 5,
    duration: "4 weeks",
    level: "Intermediate",
    rating: 4.8,
    category: "AI & Machine Learning",
    enrolledStudents: 1543,
    image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=300&auto=format&fit=crop",
    tags: ["Python", "Data Science", "AI"],
    isPopular: true,
  },
  {
    id: "course-2",
    title: "Web Development Bootcamp",
    description: "Master modern web development with React, Next.js, and TypeScript",
    modules: 8,
    duration: "6 weeks",
    level: "Beginner",
    rating: 4.9,
    category: "Web Development",
    enrolledStudents: 2389,
    image: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?q=80&w=300&auto=format&fit=crop",
    tags: ["React", "JavaScript", "CSS"],
    isPopular: true,
  },
  {
    id: "course-3",
    title: "Data Structures & Algorithms",
    description: "Master the fundamentals of algorithms and prepare for technical interviews",
    modules: 6,
    duration: "5 weeks",
    level: "Advanced",
    rating: 4.7,
    category: "Computer Science",
    enrolledStudents: 1876,
    image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=300&auto=format&fit=crop",
    tags: ["Algorithms", "Java", "Problem Solving"],
    isRecommended: true,
  },
  {
    id: "course-4",
    title: "UI/UX Design Masterclass",
    description: "Learn to create beautiful and functional user interfaces with Figma",
    modules: 4,
    duration: "3 weeks",
    level: "Intermediate",
    rating: 4.6,
    category: "Design",
    enrolledStudents: 987,
    image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=300&auto=format&fit=crop",
    tags: ["Figma", "UI Design", "UX Research"],
    isRecommended: true,
  },
  {
    id: "course-5",
    title: "Mobile App Development with Flutter",
    description: "Build cross-platform mobile apps with Google's Flutter framework",
    modules: 7,
    duration: "8 weeks",
    level: "Intermediate",
    rating: 4.5,
    category: "Mobile Development",
    enrolledStudents: 1320,
    image: "https://images.unsplash.com/photo-1565106430482-8f6e74349ca1?q=80&w=300&auto=format&fit=crop",
    tags: ["Flutter", "Dart", "Mobile"],
    isNew: true,
  },
  {
    id: "course-6",
    title: "Blockchain Development",
    description: "Learn to build decentralized applications on Ethereum",
    modules: 5,
    duration: "6 weeks",
    level: "Advanced",
    rating: 4.4,
    category: "Blockchain",
    enrolledStudents: 780,
    image: "https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=300&auto=format&fit=crop",
    tags: ["Ethereum", "Solidity", "Web3"],
    isNew: true,
  },
];

const categories = ["All", "Web Development", "AI & Machine Learning", "Design", "Mobile Development", "Computer Science", "Blockchain"];
const levels = ["Beginner", "Intermediate", "Advanced"];

export default function ExplorePage() {
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [filteredCourses, setFilteredCourses] = useState(courses);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        setIsSearching(true);
        setTimeout(() => {
          filterCourses(searchQuery, selectedCategory, selectedLevels);
          setIsSearching(false);
        }, 600); // Simulate API call delay
      } else {
        filterCourses("", selectedCategory, selectedLevels);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter courses when category or level changes
  useEffect(() => {
    filterCourses(searchQuery, selectedCategory, selectedLevels);
    
    // Update active filters
    const filters = [];
    if (selectedCategory !== "All") filters.push(selectedCategory);
    selectedLevels.forEach(level => filters.push(level));
    setActiveFilters(filters);
    
  }, [selectedCategory, selectedLevels]);

  const filterCourses = (query: string, category: string, levels: string[]) => {
    let result = [...courses];
    
    // Filter by search query
    if (query) {
      const lowerQuery = query.toLowerCase();
      result = result.filter(course => 
        course.title.toLowerCase().includes(lowerQuery) || 
        course.description.toLowerCase().includes(lowerQuery) ||
        course.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
      );
    }
    
    // Filter by category
    if (category !== "All") {
      result = result.filter(course => course.category === category);
    }
    
    // Filter by levels
    if (levels.length > 0) {
      result = result.filter(course => levels.includes(course.level));
    }
    
    setFilteredCourses(result);
  };

  const removeFilter = (filter: string) => {
    if (selectedCategory === filter) {
      setSelectedCategory("All");
    } else {
      setSelectedLevels(prev => prev.filter(level => level !== filter));
    }
  };

  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        <span className="text-sm font-medium">{rating.toFixed(1)}</span>
      </div>
    );
  };

  const recommendedCourses = courses.filter(course => course.isRecommended);
  const popularCourses = courses.filter(course => course.isPopular);
  const newCourses = courses.filter(course => course.isNew);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 ">
      <Navbar />
      <div className="pt-24 container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto mb-12 space-y-6"
        >
          <h1 className="text-4xl font-bold text-center text-slate-900 dark:text-white mb-6">
            Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">AI-Generated</span> Courses
          </h1>
          
          <div className={`relative transition-all duration-300 ${searchFocused ? 'scale-103 ring-2 ring-purple-500 ring-opacity-50' : ''}`}>
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for any topic, skill or interest..."
              className="w-full px-4 py-6 pl-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white shadow-sm hover:shadow-md transition-shadow text-lg"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            {isSearching ? (
              <Loader2 className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-500 h-5 w-5 animate-spin" />
            ) : (
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                  <Filter className="h-5 w-5" />
                  <span>Filter</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <div className="p-2 font-medium">Level</div>
                {levels.map((level) => (
                  <DropdownMenuCheckboxItem
                    key={level}
                    checked={selectedLevels.includes(level)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedLevels(prev => [...prev, level]);
                      } else {
                        setSelectedLevels(prev => prev.filter(l => l !== level));
                      }
                    }}
                  >
                    {level}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="flex gap-2 justify-center  pb-2 scrollbar-hide">
            {categories.map((category) => (
              <Button 
                key={category} 
                variant={selectedCategory === category ? "default" : "outline"} 
                size="sm" 
                className={`rounded-full whitespace-nowrap ${selectedCategory === category ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
          
          {/* Active filters */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="text-sm text-slate-500 dark:text-slate-400 pt-1">Active filters:</span>
              {activeFilters.map(filter => (
                <Badge 
                  key={filter} 
                  variant="secondary"
                  className="flex items-center gap-1 px-2 py-1"
                >
                  {filter}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeFilter(filter)}
                  />
                </Badge>
              ))}
            </div>
          )}
        </motion.div>

        {/* Tabs for different course sections */}
        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="mx-auto flex justify-center space-x-2 rounded-xl p-1">
            <TabsTrigger value="all">All Courses</TabsTrigger>
            <TabsTrigger value="recommended">Recommended</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="new">New</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            {filteredCourses.length === 0 ? (
              <div className="text-center py-12">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-slate-500 dark:text-slate-400"
                >
                  <h3 className="text-xl font-medium mb-2">No courses found</h3>
                  <p>Try adjusting your search or filters</p>
                </motion.div>
              </div>
            ) : (
              <CourseGrid courses={filteredCourses} />
            )}
          </TabsContent>
          
          <TabsContent value="recommended" className="mt-6">
            <CourseGrid courses={recommendedCourses} />
          </TabsContent>
          
          <TabsContent value="popular" className="mt-6">
            <CourseGrid courses={popularCourses} />
          </TabsContent>
          
          <TabsContent value="new" className="mt-6">
            <CourseGrid courses={newCourses} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

interface CourseGridProps {
  courses: typeof courses;
}

const CourseGrid = ({ courses }: CourseGridProps) => {
  function renderStarRating(rating: number): React.ReactNode {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-slate-300 dark:text-slate-600"
          }`}
        />
      );
    }
    return <div className="flex items-center gap-1">{stars}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence>
        {courses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ delay: index * 0.075 }}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200 dark:border-slate-700"
          >
            <div className="relative h-36 w-full overflow-hidden">
              <img 
                src={course.image} 
                alt={course.title} 
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
              />
              {course.isPopular && (
                <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  Popular
                </div>
              )}
              {course.isNew && (
                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  New
                </div>
              )}
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg dark:text-white line-clamp-1">{course.title}</h3>
                  <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                    {course.level}
                  </span>
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-300 mb-4 line-clamp-2">{course.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {course.tags.map(tag => (
                  <span 
                    key={tag} 
                    className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 mb-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>{course.modules} modules</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{course.duration}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  {renderStarRating(course.rating)}
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {course.enrolledStudents.toLocaleString()} students
                </span>
              </div>
              
              <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                Start Learning
              </Button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
