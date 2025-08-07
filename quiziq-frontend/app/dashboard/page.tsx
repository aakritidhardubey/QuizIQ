'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Line, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'
import { Trophy, Target, Clock, BookOpen } from 'lucide-react'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    accuracy: 0,
    topicsCompleted: 0,
    avgTime: 0
  })

  useEffect(() => {
    fetchUserStats()
  }, [])

  const fetchUserStats = async () => {
    setStats({
      totalQuizzes: 15,
      accuracy: 78,
      topicsCompleted: 8,
      avgTime: 45
    })
  }

  const lineChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Accuracy %',
      data: [65, 70, 75, 72, 78, 82, 78],
      borderColor: '#0D47A1',
      backgroundColor: 'rgba(13, 71, 161, 0.1)',
      tension: 0.4
    }]
  }

  const doughnutData = {
    labels: ['Easy', 'Medium', 'Hard'],
    datasets: [{
      data: [45, 35, 20],
      backgroundColor: ['#4CAF50', '#0D47A1', '#757575']
    }]
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-primary mb-8">Your Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { icon: Trophy, label: 'Total Quizzes', value: stats.totalQuizzes, color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
            { icon: Target, label: 'Accuracy', value: `${stats.accuracy}%`, color: 'text-accent', bgColor: 'bg-green-50' },
            { icon: BookOpen, label: 'Topics Completed', value: `${stats.topicsCompleted}/25`, color: 'text-primary', bgColor: 'bg-blue-50' },
            { icon: Clock, label: 'Avg Time', value: `${stats.avgTime}s`, color: 'text-purple-600', bgColor: 'bg-purple-50' }
          ].map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="card hover:transform hover:scale-105 transition-all duration-300"
            >
              <div className={`${stat.bgColor} rounded-lg p-3 inline-block mb-3`}>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
              <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-xl font-semibold text-primary mb-4">Weekly Progress</h2>
            <div className="h-[300px]">
              <Line data={lineChartData} options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    labels: {
                      font: {
                        family: 'Poppins'
                      }
                    }
                  }
                }
              }} />
            </div>
          </div>
          <div className="card">
            <h2 className="text-xl font-semibold text-primary mb-4">Difficulty Distribution</h2>
            <div className="h-[300px] flex items-center justify-center">
              <Doughnut data={doughnutData} options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    labels: {
                      font: {
                        family: 'Poppins'
                      }
                    }
                  }
                }
              }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}