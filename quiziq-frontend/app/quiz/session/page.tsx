'use client'
import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, SkipForward, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import axios from 'axios'

interface Question {
  question: string
  options: {
    A: string
    B: string
    C: string
    D: string
  }
  answer: string
  explanation: string
}

export default function QuizSession() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const topic = searchParams.get('topic') || 'random'
  const startDifficulty = searchParams.get('difficulty') || 'medium'

  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [questionNumber, setQuestionNumber] = useState(1)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60)
  const [difficulty, setDifficulty] = useState(startDifficulty)
  const [loading, setLoading] = useState(false)
  const [quizResults, setQuizResults] = useState({
    correct: 0,
    incorrect: 0,
    skipped: 0,
    questions: [] as any[]
  })

  const totalQuestions = topic === 'random' ? 30 : 15

  useEffect(() => {
    if (timeLeft > 0 && !showResult) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !showResult) {
      handleSkip()
    }
  }, [timeLeft, showResult])

  const fetchQuestion = useCallback(async () => {
    setLoading(true)
    try {
      const response = await axios.post('http://localhost:5000/api/generate-question', {
        topic,
        level: difficulty,
        previous_questions: quizResults.questions.map(q => q.question)
      })
      setCurrentQuestion(response.data)
      setTimeLeft(60)
      setSelectedAnswer('')
      setShowResult(false)
    } catch (error) {
      console.error('Error fetching question:', error)
    }
    setLoading(false)
  }, [topic, difficulty, quizResults.questions])

  useEffect(() => {
    fetchQuestion()
  }, [])

  const handleAnswer = (answer: string) => {
    if (!showResult) {
      setSelectedAnswer(answer)
    }
  }

  const submitAnswer = () => {
    if (!selectedAnswer || !currentQuestion) return

    const correct = selectedAnswer === currentQuestion.answer
    setIsCorrect(correct)
    setShowResult(true)

    setQuizResults(prev => ({
      ...prev,
      correct: correct ? prev.correct + 1 : prev.correct,
      incorrect: !correct ? prev.incorrect + 1 : prev.incorrect,
      questions: [...prev.questions, { ...currentQuestion, userAnswer: selectedAnswer }]
    }))

    if (correct && difficulty === 'easy') setDifficulty('medium')
    else if (correct && difficulty === 'medium') setDifficulty('hard')
    else if (!correct && difficulty === 'hard') setDifficulty('medium')
    else if (!correct && difficulty === 'medium') setDifficulty('easy')
  }

  const handleSkip = () => {
    setQuizResults(prev => ({
      ...prev,
      skipped: prev.skipped + 1,
      questions: [...prev.questions, { ...currentQuestion, userAnswer: 'SKIPPED' }]
    }))
    nextQuestion()
  }

  const nextQuestion = () => {
    if (questionNumber >= totalQuestions) {
      router.push(`/quiz/results?data=${encodeURIComponent(JSON.stringify(quizResults))}`)
    } else {
      setQuestionNumber(questionNumber + 1)
      fetchQuestion()
    }
  }

  if (loading || !currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading question...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-primary">
              {topic.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
            </h1>
            <p className="text-gray-600">Question {questionNumber} of {totalQuestions}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className={`px-4 py-2 rounded-full text-sm font-medium ${
              difficulty === 'easy' ? 'bg-green-100 text-green-700' :
              difficulty === 'medium' ? 'bg-blue-100 text-blue-700' :
              'bg-red-100 text-red-700'
            }`}>
              {difficulty.toUpperCase()}
            </div>
            <div className={`flex items-center gap-2 font-mono text-lg ${
              timeLeft < 10 ? 'text-red-600' : 'text-gray-700'
            }`}>
              <Clock className="w-5 h-5" />
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          />
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={questionNumber}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="card mb-6"
          >
            <h2 className="text-xl font-semibold mb-6 text-gray-800">
              {currentQuestion.question}
            </h2>

            <div className="space-y-3">
              {Object.entries(currentQuestion.options).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => handleAnswer(key)}
                  disabled={showResult}
                  className={`w-full text-left p-4 rounded-lg transition-all duration-200 ${
                    showResult && key === currentQuestion.answer
                      ? 'bg-accent text-white border-2 border-accent'
                      : showResult && key === selectedAnswer && !isCorrect
                      ? 'bg-red-100 border-2 border-red-500 text-red-700'
                      : selectedAnswer === key
                      ? 'bg-primary text-white border-2 border-primary'
                      : 'bg-white hover:bg-gray-50 border-2 border-gray-200'
                  }`}
                >
                  <span className="font-semibold">{key}.</span> {value}
                </button>
              ))}
            </div>

            {showResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-6 p-4 rounded-lg ${
                  isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-accent" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className={`font-semibold ${isCorrect ? 'text-accent' : 'text-red-600'}`}>
                    {isCorrect ? 'Correct!' : 'Incorrect'}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{currentQuestion.explanation}</p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="flex gap-4">
          {!showResult ? (
            <>
              <button
                onClick={handleSkip}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 transition font-medium"
              >
                <SkipForward className="w-5 h-5" />
                Skip
              </button>
              <button
                onClick={submitAnswer}
                disabled={!selectedAnswer}
                className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  selectedAnswer
                    ? 'bg-primary text-white hover:bg-primary-dark'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Submit Answer
              </button>
            </>
          ) : (
            <button
              onClick={nextQuestion}
              className="w-full py-3 rounded-lg bg-accent text-white font-semibold hover:bg-accent-dark transition"
            >
              {questionNumber >= totalQuestions ? 'View Results' : 'Next Question'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}