@echo off
echo Starting QuizIQ Application...
echo.

echo Starting Backend Server...
start cmd /k "cd backend && python app.py"

echo Starting Frontend Server...
cd quiziq-frontend
npm run dev

pause