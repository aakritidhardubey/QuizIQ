'use client'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Trophy, Target, Clock, BookOpen, Home, RefreshCw, XCircle, SkipForward, ChevronDown, ChevronUp } from 'lucide-react'
import { Doughnut } from 'react-chartjs-2'
import { useState } from 'react'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

export default function QuizResults() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [showReview, setShowReview] = useState(false)
  
  const resultsData = JSON.parse(searchParams.get('data') || '{}')
  const total = resultsData.correct + resultsData.incorrect + resultsData.skipped
  const accuracy = total > 0 ? Math.round((resultsData.correct / total) * 100) : 0

  const chartData = {
    labels: ['Correct', 'Incorrect', 'Skipped'],
    datasets: [{
      data: [resultsData.correct, resultsData.incorrect, resultsData.skipped],
      backgroundColor: ['#4CAF50', '#f87171', '#fbbf24']
    }]
  }

  const getPerformanceMessage = () => {
    if (accuracy >= 80) return { text: "Excellent Performance! 🎉", color: "text-accent" }
    if (accuracy >= 60) return { text: "Good Job! Keep Practicing 👍", color: "text-yellow-600" }
    return { text: "Keep Learning! You'll Get Better 📚", color: "text-red-600" }
  }

  const performance = getPerformanceMessage()

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Trophy className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-primary mb-2">Quiz Completed!</h1>
          <p className={`text-xl font-semibold ${performance.color}`}>
            {performance.text}
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="card text-center"
          >
            <Target className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-sm text-gray-600 font-medium">Accuracy</p>
            <p className="text-2xl font-bold text-primary">{accuracy}%</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="card text-center"
          >
            <BookOpen className="w-8 h-8 text-accent mx-auto mb-2" />
            <p className="text-sm text-gray-600 font-medium">Correct</p>
            <p className="text-2xl font-bold text-accent">{resultsData.correct}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="card text-center"
          >
            <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600 font-medium">Incorrect</p>
            <p className="text-2xl font-bold text-red-600">{resultsData.incorrect}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="card text-center"
          >
            <SkipForward className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600 font-medium">Skipped</p>
            <p className="text-2xl font-bold text-yellow-600">{resultsData.skipped}</p>
          </motion.div>
        </div>

        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card mb-8"
        >
          <h2 className="text-xl font-semibold text-primary mb-4 text-center">Performance Breakdown</h2>
          <div className="h-64 flex items-center justify-center">
            <Doughnut data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </motion.div>

        {/* Review Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card mb-8"
        >
          <button
            onClick={() => setShowReview(!showReview)}
            className="w-full text-left flex justify-between items-center"
          >
            <h2 className="text-xl font-semibold text-primary">Review Answers</h2>
            {showReview ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
          </button>

          {showReview && (
            <div className="mt-4 space-y-4">
              {resultsData.questions && resultsData.questions.map((q: any, idx: number) => (
                <div key={idx} className="border-t pt-4">
                  <p className="font-medium mb-2 text-gray-800">Q{idx + 1}: {q.question}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                    {q.options && Object.entries(q.options).map(([key, value]: [string, any]) => (
                      <div
                        key={key}
                        className={`p-3 rounded-lg text-sm ${
                          key === q.answer
                            ? 'bg-green-100 border border-accent text-green-800'
                            : key === q.userAnswer && q.userAnswer !== q.answer
                            ? 'bg-red-100 border border-red-500 text-red-700'
                            : 'bg-gray-50'
                        }`}
                      >
                        <span className="font-semibold">{key}.</span> {String(value)}
                      </div>
                    ))}
                  </div>
                  {q.userAnswer === 'SKIPPED' && (
                    <p className="text-sm text-yellow-600 font-medium">Skipped</p>
                  )}
                  <p className="text-sm text-gray-600 mt-2">
                    <span className="font-semibold">Explanation:</span> {q.explanation}
                  </p>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 transition font-medium"
          >
            <Home className="w-5 h-5" />
            Dashboard
          </button>
          <button
            onClick={() => router.push('/quiz')}
            className="flex-1 flex items-center justify-center gap-2 btn-primary"
          >
            <RefreshCw className="w-5 h-5" />
            New Quiz
          </button>
        </div>
      </div>
    </div>
  )
}