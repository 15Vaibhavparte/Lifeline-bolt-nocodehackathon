@echo off
echo.
echo 🩸 Starting Lifeline AI Blood Matching System...
echo.

echo 📋 Checking environment...
if not exist .env (
    echo ❌ Error: .env file not found!
    echo Please create .env file with your API keys
    echo See GEMINI_AI_INTEGRATION.md for setup instructions
    pause
    exit /b 1
)

echo ✅ Environment file found

echo.
echo 🔧 Installing dependencies...
call npm install

echo.
echo 🧪 Testing Gemini AI connection...
call node test-gemini.js

echo.
echo 🚀 Starting services...
echo.
echo Backend server will run on: http://localhost:3002
echo Frontend will run on: http://localhost:5176 (or next available port)
echo AI Dashboard: http://localhost:5176/gemini-ai
echo.

start "Lifeline Backend" cmd /k "cd /d %cd% && npm run server"
timeout /t 3 /nobreak >nul

start "Lifeline Frontend" cmd /k "cd /d %cd% && npm run dev"

echo.
echo 🎉 Lifeline AI is starting up!
echo.
echo 📖 Open GEMINI_AI_INTEGRATION.md for usage examples
echo 🌐 Visit http://localhost:5176/gemini-ai to start using the AI assistant
echo.
pause
