"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Check, HelpCircle, X } from "lucide-react"
import { motion } from "framer-motion"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Link from "next/link"

const basePlans = [
  {
    name: "Free",
    price: {
      monthly: "$0",
      annual: "$0"
    },
    description: "Perfect for getting started",
    features: [
      "5 AI-generated courses per month",
      "Basic course customization",
      "Community support",
      "Access to public courses",
    ],
    limitations: [
      "No export options",
      "Limited customization",
    ]
  },
  {
    name: "Pro",
    price: {
      monthly: "$19",
      annual: "$190"
    },
    description: "Best for individual learners",
    features: [
      "Unlimited AI-generated courses",
      "Advanced customization",
      "Priority support",
      "Export to multiple formats",
      "Custom branding",
    ],
    limitations: [],
    popular: true,
  },
  {
    name: "Enterprise",
    price: {
      monthly: "Custom",
      annual: "Custom"
    },
    description: "For teams and organizations",
    features: [
      "Everything in Pro",
      "Custom integrations",
      "Dedicated support",
      "Team management",
      "Advanced analytics",
    ],
    limitations: [],
  },
]

const featureComparison = [
  { 
    feature: "AI-generated courses", 
    free: "5 per month", 
    pro: "Unlimited", 
    enterprise: "Unlimited" 
  },
  { 
    feature: "Course customization", 
    free: "Basic", 
    pro: "Advanced", 
    enterprise: "Advanced" 
  },
  { 
    feature: "Support", 
    free: "Community", 
    pro: "Priority", 
    enterprise: "Dedicated" 
  },
  { 
    feature: "Export formats", 
    free: "None", 
    pro: "PDF, DOCX, HTML", 
    enterprise: "All formats + API" 
  },
  { 
    feature: "Team members", 
    free: "1", 
    pro: "1", 
    enterprise: "Unlimited" 
  },
]

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Education Specialist",
    company: "LearnTech",
    content: "This platform transformed how we create learning materials. The AI course generator saves us countless hours every week.",
    avatar: "https://randomuser.me/api/portraits/women/12.jpg"
  },
  {
    name: "Michael Chen",
    role: "Independent Instructor",
    company: "",
    content: "As an independent educator, the Pro plan gives me everything I need to create professional courses at a fraction of the time.",
    avatar: "https://randomuser.me/api/portraits/men/22.jpg"
  },
  {
    name: "Emma Rodriguez",
    role: "Training Director",
    company: "Global Solutions Inc.",
    content: "The Enterprise plan's analytics and team management features are indispensable for our organization's learning initiatives.",
    avatar: "https://randomuser.me/api/portraits/women/33.jpg"
  },
]

const faqs = [
  {
    question: "How does the AI course generation work?",
    answer: "Our AI analyzes your input and learning objectives to generate customized course content, exercises, and assessments. You can then edit and refine the generated content to suit your specific needs."
  },
  {
    question: "Can I change plans later?",
    answer: "Absolutely! You can upgrade, downgrade, or cancel your plan at any time. If you upgrade, you'll gain immediate access to the new features. If you downgrade, the changes will take effect at the end of your current billing cycle."
  },
  {
    question: "Do you offer refunds?",
    answer: "Yes, we offer a 14-day money-back guarantee for all paid plans. If you're not satisfied with our service within this period, you can request a full refund."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, PayPal, and for Enterprise customers, we can arrange invoicing options."
  },
  {
    question: "Is there a contract for paid plans?",
    answer: "No, all our plans are subscription-based with no long-term commitment required. You can cancel at any time."
  },
]

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly")
  const [showComparison, setShowComparison] = useState(false)
  
  // Calculate plans based on billing cycle
  const plans = basePlans.map(plan => ({
    ...plan,
    displayPrice: plan.price[billingCycle]
  }))
  
  // Calculate annual savings percentage
  const annualSavingsPercent = 16 // 16% savings with annual billing

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-purple-50 to-white dark:from-slate-900 dark:via-purple-900/10 dark:to-slate-900">
      <Navbar />
      <div className="pt-16 container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">
            Choose the plan that's right for you
          </p>
          
          {/* Billing cycle toggle */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <span className={`text-sm ${billingCycle === "monthly" ? "text-slate-900 dark:text-white font-medium" : "text-slate-500 dark:text-slate-400"}`}>
              Monthly
            </span>
            <Switch
              checked={billingCycle === "annual"}
              onCheckedChange={(checked) => setBillingCycle(checked ? "annual" : "monthly")}
              className="data-[state=checked]:bg-purple-600"
            />
            <span className={`text-sm flex items-center gap-2 ${billingCycle === "annual" ? "text-slate-900 dark:text-white font-medium" : "text-slate-500 dark:text-slate-400"}`}>
              Annual
              {billingCycle === "annual" && (
                <span className="inline-block px-2 py-1 text-xs font-medium text-white bg-green-500 rounded-full">
                  Save {annualSavingsPercent}%
                </span>
              )}
            </span>
          </div>
          
          {/* Toggle between cards and comparison table */}
          <Tabs defaultValue="cards" className="w-full max-w-md mx-auto mb-8">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="cards" onClick={() => setShowComparison(false)}>Card View</TabsTrigger>
              <TabsTrigger value="table" onClick={() => setShowComparison(true)}>Compare Features</TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>

        {!showComparison ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          >
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -10 }}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-white dark:bg-slate-800 rounded-2xl p-8 ${
                  plan.popular 
                    ? "ring-2 ring-purple-500 shadow-xl shadow-purple-500/10" 
                    : "border border-slate-200 dark:border-slate-700"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                    <span className="inline-block px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-full shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{plan.name}</h3>
                  <div className="mb-2">
                    <span className="text-5xl font-bold text-slate-900 dark:text-white">{plan.displayPrice}</span>
                    {plan.displayPrice !== "Custom" && (
                      <span className="text-slate-500 dark:text-slate-400 ml-2">
                        /{billingCycle === "monthly" ? "month" : "year"}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">{plan.description}</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <motion.li
                      key={featureIndex}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + featureIndex * 0.1 }}
                      className="flex items-center text-slate-600 dark:text-slate-300"
                    >
                      <div className="mr-3 h-5 w-5 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                        <Check className="h-3 w-3 text-green-500" />
                      </div>
                      {feature}
                    </motion.li>
                  ))}
                  
                  {/* Limitations if any */}
                  {plan.limitations && plan.limitations.map((limitation, limitIndex) => (
                    <motion.li
                      key={`limit-${limitIndex}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + plan.features.length * 0.1 + limitIndex * 0.1 }}
                      className="flex items-center text-slate-500 dark:text-slate-400"
                    >
                      <div className="mr-3 h-5 w-5 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                        <X className="h-3 w-3 text-red-500" />
                      </div>
                      {limitation}
                    </motion.li>
                  ))}
                </ul>

                <Button 
                  className={`w-full ${
                    plan.popular
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      : "bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600"
                  } text-white`}
                >
                  {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
                </Button>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-6xl mx-auto overflow-hidden"
          >
            <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-lg">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800">
                    <th className="text-left p-4 border-b border-slate-200 dark:border-slate-700">Feature</th>
                    <th className="p-4 border-b border-slate-200 dark:border-slate-700">Free</th>
                    <th className="p-4 border-b border-slate-200 dark:border-slate-700 bg-purple-50 dark:bg-purple-900/20">Pro</th>
                    <th className="p-4 border-b border-slate-200 dark:border-slate-700">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-4 border-b border-slate-200 dark:border-slate-700 font-medium">Price</td>
                    <td className="p-4 border-b border-slate-200 dark:border-slate-700 text-center">$0</td>
                    <td className="p-4 border-b border-slate-200 dark:border-slate-700 text-center bg-purple-50 dark:bg-purple-900/10">
                      {billingCycle === "monthly" ? "$19/month" : "$190/year"}
                    </td>
                    <td className="p-4 border-b border-slate-200 dark:border-slate-700 text-center">Custom</td>
                  </tr>
                  
                  {featureComparison.map((item, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-slate-50 dark:bg-slate-800/50"}>
                      <td className="p-4 border-b border-slate-200 dark:border-slate-700">{item.feature}</td>
                      <td className="p-4 border-b border-slate-200 dark:border-slate-700 text-center">{item.free}</td>
                      <td className="p-4 border-b border-slate-200 dark:border-slate-700 text-center bg-purple-50 dark:bg-purple-900/10">{item.pro}</td>
                      <td className="p-4 border-b border-slate-200 dark:border-slate-700 text-center">{item.enterprise}</td>
                    </tr>
                  ))}
                  
                  <tr>
                    <td className="p-4"></td>
                    <td className="p-4 text-center">
                      <Button>Get Started</Button>
                    </td>
                    <td className="p-4 text-center bg-purple-50 dark:bg-purple-900/10">
                      <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                        Get Started
                      </Button>
                    </td>
                    <td className="p-4 text-center">
                      <Button>Contact Sales</Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
        
        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-32"
        >
          <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">
            Trusted by educators worldwide
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700"
              >
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">{testimonial.name}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {testimonial.role}{testimonial.company && `, ${testimonial.company}`}
                    </p>
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-300 italic">"{testimonial.content}"</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-32 max-w-4xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">
            Frequently Asked Questions
          </h2>
          
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-slate-900 dark:text-white hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 dark:text-slate-300">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          
          <div className="mt-12 text-center p-8 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              Still have questions?
            </h3>
            <p className="mb-6 text-slate-600 dark:text-slate-300">
              Our team is here to help you find the perfect plan for your needs.
            </p>
            <Link href="/contact">
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                Contact Support
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
