'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Clock, Target, SkipForward, Award } from 'lucide-react'

export default function QuizSelection() {
  const [topics, setTopics] = useState<string[]>([])
  const [selectedTopic, setSelectedTopic] = useState('')
  const [difficulty, setDifficulty] = useState('medium')
  const router = useRouter()

  useEffect(() => {
    fetchTopics()
  }, [])

  const fetchTopics = async () => {
    const topicsList = [
      "numbers", "problems-on-numbers", "simplification", "percentage",
      "profit-and-loss", "simple-interest", "compound-interest", "partnership",
      "time-and-work", "pipes-and-cistern", "time-and-distance", "problems-on-trains",
      "boats-and-streams", "problems-on-ages", "calendar", "clock",
      "area", "volume-and-surface-area", "permutation-and-combination",
      "probability", "alligation-or-mixture", "chain-rule", "logarithm",
      "true-discount", "random"
    ]
    setTopics(topicsList)
  }

  const startQuiz = () => {
    if (selectedTopic) {
      router.push(`/quiz/session?topic=${selectedTopic}&difficulty=${difficulty}`)
    }
  }

  const formatTopicName = (topic: string) => {
    return topic.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          <h1 className="text-3xl font-bold text-primary mb-8 text-center">
            Choose Your Quiz Topic
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Topic Selection */}
            <div className="lg:col-span-2">
              <div className="card">
                <h2 className="text-xl font-semibold text-primary mb-4">Select a Topic</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {topics.map((topic) => (
                    <button
                      key={topic}
                      onClick={() => setSelectedTopic(topic)}
                      className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        selectedTopic === topic
                          ? 'bg-primary text-white shadow-md'
                          : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
                      }`}
                    >
                      {formatTopicName(topic)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Difficulty Selection */}
              <div className="card">
                <h2 className="text-xl font-semibold text-primary mb-4">Select Difficulty</h2>
                <div className="space-y-3">
                  {['easy', 'medium', 'hard'].map((level) => (
                    <button
                      key={level}
                      onClick={() => setDifficulty(level)}
                      className={`w-full p-4 rounded-lg capitalize font-medium transition-all duration-200 ${
                        difficulty === level
                          ? 'bg-primary text-white'
                          : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quiz Info */}
              <div className="card">
                <h2 className="text-xl font-semibold text-primary mb-4">Quiz Information</h2>
                <ul className="space-y-3">
                  {[
                    { icon: Target, text: "15 questions (30 for random)" },
                    { icon: Clock, text: "1 minute per question" },
                    { icon: Award, text: "Adaptive difficulty" },
                    { icon: SkipForward, text: "Skip option available" }
                  ].map((info, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-gray-600">
                      <info.icon className="w-5 h-5 text-primary" />
                      <span className="text-sm">{info.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Start Button */}
              <button
                onClick={startQuiz}
                disabled={!selectedTopic}
                className={`w-full py-4 rounded-lg font-semibold text-lg transition-all duration-200 ${
                  selectedTopic
                    ? 'bg-accent text-white hover:bg-accent-dark transform hover:scale-[1.02]'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Start Quiz
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}