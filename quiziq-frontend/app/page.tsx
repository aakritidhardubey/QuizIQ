'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Brain, Target, TrendingUp, Clock, CheckCircle, Users, Award, BookOpen } from 'lucide-react'

export default function Home() {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Master Your Aptitude with QuizIQ
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100">
              Adaptive learning platform with 25+ topics to boost your problem-solving skills
            </p>
            <Link 
              href="/quiz" 
              className="inline-block bg-accent text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-accent-dark transition transform hover:scale-105 shadow-lg"
            >
              Start Your Journey
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-primary mb-12">Why Choose QuizIQ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Brain, title: "25+ Topics", desc: "Comprehensive aptitude coverage", color: "text-primary" },
              { icon: Target, title: "Adaptive Difficulty", desc: "Questions adjust to your level", color: "text-accent" },
              { icon: TrendingUp, title: "Track Progress", desc: "Detailed performance analytics", color: "text-primary" },
              { icon: Clock, title: "Timed Practice", desc: "1 minute per question", color: "text-accent" }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="card text-center hover:transform hover:scale-105 transition-all duration-300"
              >
                <feature.icon className={`w-12 h-12 ${feature.color} mx-auto mb-4`} />
                <h3 className="font-semibold text-lg mb-2 text-gray-800">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-card py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: Users, value: "10K+", label: "Active Users" },
              { icon: BookOpen, value: "50K+", label: "Questions Solved" },
              { icon: Award, value: "95%", label: "Success Rate" },
              { icon: CheckCircle, value: "4.8", label: "User Rating" }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
              >
                <stat.icon className="w-10 h-10 text-primary mx-auto mb-2" />
                <h3 className="text-3xl font-bold text-primary">{stat.value}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary mb-4">Ready to Test Your Skills?</h2>
          <p className="text-xl text-gray-600 mb-8">Join thousands of learners improving their aptitude daily</p>
          <Link href="/signup" className="btn-primary inline-block">
            Get Started Free
          </Link>
        </div>
      </section>
    </div>
  )
}