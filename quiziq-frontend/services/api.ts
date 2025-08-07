import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const quizAPI = {
  generateQuestion: async (topic: string, level: string, previousQuestions: string[] = []) => {
    const response = await api.post('/api/generate-question', {
      topic,
      level,
      previous_questions: previousQuestions,
    })
    return response.data
  },

  getTopics: async () => {
    const response = await api.get('/api/topics')
    return response.data
  },

  submitQuizResult: async (results: any) => {
    const response = await api.post('/api/quiz/submit', results)
    return response.data
  },

  getUserStats: async () => {
    const response = await api.get('/api/user/stats')
    return response.data
  },

  getLeaderboard: async () => {
    const response = await api.get('/api/leaderboard')
    return response.data
  },
}

export default api