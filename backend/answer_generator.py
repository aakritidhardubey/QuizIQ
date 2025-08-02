import requests
import os
from dotenv import load_dotenv
import json

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
MODEL = "llama3-70b-8192"  

def generate_question(topic: str, level: str ="medium",previous_questions: list = None) -> dict:
    if not GROQ_API_KEY:
        raise ValueError(" API key not set. Please set OPENROUTER_API_KEY.")
# to avoid repeated question generation
    avoid_text=""
    if previous_questions:
        recent_questions=previous_questions[-3:]
        avoid_text = "\nAvoid generating questions similar to these:\n"
        for q in recent_questions:
            avoid_text += f"- {q}\n"
    prompt = (
    f"You are an expert aptitude test maker. Generate one {level} level *mathematically correct* multiple-choice question on the topic '{topic}'.\n"
    "- The question should test logical or numerical reasoning, not trivia.\n"
    "- Use real-life, exam-style questions. Keep the wording concise.\n"
    "- Double-check all calculations and ensure the correct answer is accurate.\n"
    "- Avoid questions similar to: {recent_questions}.\n\n"
    "Strictly format your response as a VALID JSON with the following keys:\n"
    "  - 'question': string,\n"
    "  - 'options': { 'A': str, 'B': str, 'C': str, 'D': str },\n"
    "  - 'answer': 'A' | 'B' | 'C' | 'D',\n"
    "  - 'explanation': string (explain the logic behind the answer clearly)\n\n"
    "⚠️ Do not add any markdown or text outside the JSON. Ensure clean formatting and correct math."
    )
    
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": "You are a helpful quiz generator for aptitude topics.Always verify your calculations before providing answers."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.7,
        "max_tokens":500
    }

    try:
        response = requests.post(GROQ_URL, headers=headers, json=payload)
        response.raise_for_status()
        result = response.json()
        raw_output = result['choices'][0]['message']['content']
        
        question_data = json.loads(raw_output)
        return question_data

    except requests.exceptions.RequestException as e:
        print(f"❌ API request failed: {e}")
    except json.JSONDecodeError:
        print("❌ Response was not valid JSON. Check the model prompt or temperature.")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")

    return {}