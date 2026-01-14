# QuizIQ 🧠

An adaptive aptitude quiz platform that helps users master problem-solving skills across 25+ topics with AI-generated questions and intelligent difficulty adjustment.

## 🌟 Features

### Core Functionality
- **25+ Aptitude Topics** - Comprehensive coverage including numbers, percentages, profit-and-loss, time-and-work, probability, and more
- **AI-Powered Question Generation** - Dynamic questions generated using Groq's LLaMA 3 70B model
- **Adaptive Difficulty System** - Questions automatically adjust based on your performance
- **Timed Challenges** - 1 minute per question with skip option
- **Performance Analytics** - Track accuracy, speed, and progress over time
- **Interactive Dashboard** - Visual charts showing weekly progress and difficulty distribution

### User Experience
- Modern, responsive UI built with Next.js 14 and Tailwind CSS
- Smooth animations with Framer Motion
- Real-time feedback and explanations
- Progress tracking across sessions
- Mobile-friendly design

## 🏗️ Architecture

### Backend (Python/Flask)
- **Flask API** - RESTful endpoints for quiz operations
- **Groq AI Integration** - LLaMA 3 70B for question generation
- **Adaptive Engine** - Dynamic difficulty adjustment algorithm
- **Session Management** - Track user progress and quiz history
- **Performance Tracker** - Detailed analytics and reporting

### Frontend (Next.js/React)
- **Next.js 14** - App Router with TypeScript
- **Tailwind CSS** - Utility-first styling
- **Chart.js** - Data visualization
- **Axios** - API communication
- **Framer Motion** - Smooth animations

## 📋 Prerequisites

- **Python 3.8+**
- **Node.js 18+** and npm
- **Groq API Key** - Get one from [Groq Console](https://console.groq.com)

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd quiziq
```

### 2. Backend Setup

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install flask flask-cors requests python-dotenv

# Create .env file
echo GROQ_API_KEY=your_groq_api_key_here > .env
```

### 3. Frontend Setup

```bash
cd quiziq-frontend
npm install
```

## 🎮 Running the Application

### Option 1: Run Everything (Windows)
```bash
run-all.bat
```

### Option 2: Run Separately

**Terminal 1 - Backend:**
```bash
cd backend
python app.py
```
Backend runs on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd quiziq-frontend
npm run dev
```
Frontend runs on `http://localhost:3000`

### Option 3: CLI Quiz (Terminal Only)
```bash
python main.py
```

## 📁 Project Structure

```
quiziq/
├── backend/
│   ├── app.py                 # Flask API server
│   ├── answer_generator.py    # AI question generation
│   ├── adaptive_engine.py     # Difficulty adjustment logic
│   ├── quiz_session.py        # Session management
│   ├── tracker.py             # Performance tracking
│   └── topics.json            # Available quiz topics
├── quiziq-frontend/
│   ├── app/
│   │   ├── page.tsx           # Landing page
│   │   ├── quiz/              # Quiz selection & session
│   │   └── dashboard/         # User analytics
│   ├── components/
│   │   ├── navbar.tsx         # Navigation bar
│   │   └── footer.tsx         # Footer component
│   └── services/
│       └── api.ts             # API integration
├── main.py                    # CLI quiz entry point
├── .env                       # Environment variables
└── run-all.bat               # Windows startup script
```

## 🔌 API Endpoints

### Quiz Operations
- `POST /api/generate-question` - Generate a new question
- `GET /api/topics` - Get available topics
- `POST /api/quiz/submit` - Submit quiz results
- `GET /api/user/stats` - Get user statistics
- `GET /api/test-groq` - Test Groq API connection

### Request/Response Examples

**Generate Question:**
```json
POST /api/generate-question
{
  "topic": "percentage",
  "level": "medium",
  "previous_questions": []
}

Response:
{
  "question": "If 30% of a number is 90, what is the number?",
  "options": {
    "A": "270",
    "B": "300",
    "C": "330",
    "D": "360"
  },
  "answer": "B",
  "explanation": "Let the number be x. Then 30% of x = 90..."
}
```

## 🎯 Available Topics

- Numbers & Simplification
- Percentage, Profit & Loss
- Simple & Compound Interest
- Partnership
- Time & Work, Pipes & Cistern
- Time & Distance, Trains
- Boats & Streams
- Problems on Ages
- Calendar & Clock
- Area, Volume & Surface Area
- Permutation & Combination
- Probability
- Alligation & Mixture
- Chain Rule, Logarithm
- True Discount
- Random (mixed topics)

## 🧪 Testing the Setup

1. **Test Backend:**
```bash
curl http://localhost:5000/api/test-groq
```

2. **Test Frontend:**
Open `http://localhost:3000` in your browser

3. **Test CLI:**
```bash
python main.py
```

## 🛠️ Configuration

### Environment Variables (.env)
```env
GROQ_API_KEY=your_groq_api_key_here
```

### Frontend Environment (optional)
Create `quiziq-frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## 📊 How It Works

1. **User selects a topic and difficulty level**
2. **AI generates a unique question** using Groq's LLaMA 3 model
3. **User answers within 60 seconds** or skips
4. **Adaptive engine adjusts difficulty** based on correctness
5. **Performance is tracked** and displayed in dashboard
6. **Detailed explanations** provided for each answer

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the MIT License.

## 🐛 Troubleshooting

**Backend won't start:**
- Ensure virtual environment is activated
- Check if port 5000 is available
- Verify GROQ_API_KEY in .env file

**Frontend won't start:**
- Run `npm install` in quiziq-frontend directory
- Check if port 3000 is available
- Clear .next cache: `rm -rf .next`

**Questions not generating:**
- Verify Groq API key is valid
- Check internet connection
- Review backend console for error messages

## 👥 Authors

Built with ❤️ for learners everywhere

## 🙏 Acknowledgments

- Groq for AI infrastructure
- Next.js team for the amazing framework
- All contributors and testers
