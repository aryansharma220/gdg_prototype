"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  CheckCircle,
  Loader2,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  reason: z.enum(["support", "sales", "feedback", "partnership", "other"]),
});

type FormValues = z.infer<typeof formSchema>;

// FAQ data
const faqData = [
  {
    question: "How quickly can I expect a response?",
    answer:
      "We typically respond to all inquiries within 24-48 business hours.",
  },
  {
    question: "Do you offer phone support?",
    answer:
      "Yes, our support team is available by phone Monday through Friday, 9am-6pm.",
  },
  {
    question: "How can I report a technical issue?",
    answer:
      "Select 'Customer Support' as your reason for contact and provide details about the issue you're experiencing.",
  },
  {
    question: "Can I request a demo of your platform?",
    answer:
      "Absolutely! Choose 'Sales Inquiry' and mention that you're interested in a demo in your message.",
  },
];

export default function ContactPage() {
  const [formStatus, setFormStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Initialize react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      reason: "support",
    },
  });

  // Function to toggle FAQ items
  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    setFormStatus("submitting");

    try {
      // Simulate API call with timeout (replace with actual API call)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Example of EmailJS integration (commented out)
      /* 
      await emailjs.send(
        "YOUR_SERVICE_ID",
        "YOUR_TEMPLATE_ID",
        {
          from_name: data.name,
          from_email: data.email,
          from_phone: data.phone,
          subject: data.subject,
          message: data.message,
          reason: data.reason
        },
        "YOUR_PUBLIC_KEY"
      );
      */

      setFormStatus("success");
      toast.success("Message sent successfully!");

      // Reset form to default values
      form.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      setFormStatus("error");
      toast.error("Failed to send message. Please try again later.");
    }
  };

  // Reset form status after a successful submission
  const handleNewMessage = () => {
    setFormStatus("idle");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-purple-50 to-white dark:from-slate-900 dark:via-purple-900/10 dark:to-slate-900">
      <Navbar />
      <div className="pt-16 container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            We'd love to hear from you! Reach out to our team with any questions
            or feedback, and we'll respond as soon as possible.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-8"
          >
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                <Mail className="h-6 w-6 text-purple-600 dark:text-purple-400 mr-2" />
                Get in Touch
              </h2>

              <div className="space-y-6">
                <div className="flex items-start group">
                  <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-4 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors duration-300">
                    <Mail className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-white">
                      Email
                    </h3>
                    <a
                      href="mailto:support@learningpath.io"
                      className="text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300"
                    >
                      support@learningpath.io
                    </a>
                  </div>
                </div>

                <div className="flex items-start group">
                  <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-4 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors duration-300">
                    <Phone className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-white">
                      Phone
                    </h3>
                    <a
                      href="tel:+15551234567"
                      className="text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300"
                    >
                      +1 (555) 123-4567
                    </a>
                  </div>
                </div>

                <div className="flex items-start group">
                  <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-4 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors duration-300">
                    <MapPin className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-white">
                      Office
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300">
                      123 Learning Lane, Tech City, CA 94103
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400 mr-2" />
                Business Hours
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-300">
                    Monday - Friday:
                  </span>
                  <span className="text-slate-900 dark:text-white font-medium">
                    9:00 AM - 6:00 PM
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-300">
                    Saturday:
                  </span>
                  <span className="text-slate-900 dark:text-white font-medium">
                    10:00 AM - 4:00 PM
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-300">
                    Sunday:
                  </span>
                  <span className="text-slate-900 dark:text-white font-medium">
                    Closed
                  </span>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                <HelpCircle className="h-6 w-6 text-purple-600 dark:text-purple-400 mr-2" />
                Frequently Asked Questions
              </h2>

              <div className="space-y-4">
                {faqData.map((faq, index) => (
                  <div
                    key={index}
                    className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden"
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      className="flex justify-between items-center w-full p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <span className="font-medium text-slate-900 dark:text-white">
                        {faq.question}
                      </span>
                      {expandedFaq === index ? (
                        <ChevronUp className="h-5 w-5 text-slate-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-slate-500" />
                      )}
                    </button>

                    <AnimatePresence>
                      {expandedFaq === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="p-4 pt-0 border-t border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                <MessageSquare className="h-6 w-6 text-purple-600 dark:text-purple-400 mr-2" />
                Send us a Message
              </h2>

              <AnimatePresence mode="wait">
                {formStatus === "success" ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/30 rounded-lg p-6 text-center"
                  >
                    <div className="mb-4 flex justify-center">
                      <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 15,
                          delay: 0.1,
                        }}
                      >
                        <CheckCircle className="h-16 w-16 text-green-500" />
                      </motion.div>
                    </div>
                    <h3 className="text-lg font-semibold text-green-800 dark:text-green-400 mb-2">
                      Message Sent Successfully!
                    </h3>
                    <p className="text-green-700 dark:text-green-300 mb-6">
                      Thank you for reaching out. We'll get back to you as soon
                      as possible.
                    </p>
                    <Button
                      onClick={handleNewMessage}
                      className="bg-green-600 hover:bg-green-700 text-white transition-all duration-300 transform hover:scale-105"
                    >
                      Send Another Message
                    </Button>
                  </motion.div>
                ) : formStatus === "error" ? (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-lg p-6 text-center"
                  >
                    <div className="mb-4 flex justify-center">
                      <AlertCircle className="h-12 w-12 text-red-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-red-800 dark:text-red-400 mb-2">
                      Something went wrong!
                    </h3>
                    <p className="text-red-700 dark:text-red-300 mb-4">
                      We couldn't send your message. Please try again or contact
                      us directly.
                    </p>
                    <Button
                      onClick={() => setFormStatus("idle")}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      Try Again
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-5"
                      >
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Your Name
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="John Doe"
                                      {...field}
                                      className="w-full focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                  </FormControl>
                                  <FormMessage className="text-xs text-red-500" />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Email Address
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="email"
                                      placeholder="john@example.com"
                                      {...field}
                                      className="w-full focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                  </FormControl>
                                  <FormMessage className="text-xs text-red-500" />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="phone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Phone Number
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="+1 (555) 123-4567"
                                      {...field}
                                      className="w-full focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                  </FormControl>
                                  <FormMessage className="text-xs text-red-500" />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="reason"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Reason for Contact
                                  </FormLabel>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger className="focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                                        <SelectValue placeholder="Select a reason" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="support">
                                        Customer Support
                                      </SelectItem>
                                      <SelectItem value="sales">
                                        Sales Inquiry
                                      </SelectItem>
                                      <SelectItem value="feedback">
                                        Product Feedback
                                      </SelectItem>
                                      <SelectItem value="partnership">
                                        Partnership Opportunity
                                      </SelectItem>
                                      <SelectItem value="other">
                                        Other
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage className="text-xs text-red-500" />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={form.control}
                            name="subject"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                  Subject
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="How can we help you?"
                                    {...field}
                                    className="w-full focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                  />
                                </FormControl>
                                <FormMessage className="text-xs text-red-500" />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                  Your Message
                                </FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Please provide details about your inquiry..."
                                    rows={5}
                                    {...field}
                                    className="w-full resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                  />
                                </FormControl>
                                <FormMessage className="text-xs text-red-500" />
                              </FormItem>
                            )}
                          />
                        </div>

                        <Button
                          type="submit"
                          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white transition-all duration-300 transform hover:scale-[1.02]"
                          disabled={formStatus === "submitting"}
                        >
                          {formStatus === "submitting" ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Send Message
                            </>
                          )}
                        </Button>
                      </form>
                    </Form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Google Maps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 max-w-6xl mx-auto"
        >
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center px-2">
              <MapPin className="h-6 w-6 text-purple-600 dark:text-purple-400 mr-2" />
              Find Us
            </h2>
            <div className="h-[400px] w-full rounded-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.0952332735255!2d-122.41941708571872!3d37.77492907975918!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085809c6c8f4459%3A0xb10ed6d9b5358da5!2sTwitter%20HQ!5e0!3m2!1sen!2sus!4v1653588305994!5m2!1sen!2sus"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Our Location"
                className="w-full h-full"
              ></iframe>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
