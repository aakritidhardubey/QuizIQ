import requests
import os
from dotenv import load_dotenv

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"
MODEL = "mistralai/mistral-7b-instruct"  

def generate_question(topic: str, level: str ="medium",previous_questions: list = None) -> dict:
    if not OPENROUTER_API_KEY:
        raise ValueError(" API key not set. Please set OPENROUTER_API_KEY.")
# to avoid repeated question generation
    avoid_text=""
    if previous_questions:
        recent_questions=previous_questions[-3:]
        avoid_text=f"\\Avoid generating question simalar to these recent ones:{recent_questions}"
    
    prompt = (
        f"Generate one {level} level aptitude multiple-choice question on the topic '{topic}'. "
        f"Make sure the question is unique and different from typical basic questions.{avoid_text}\n"
        "IMPORTANT: Double-check your answer calculation before responding.\n"
        "Format your response strictly as a **valid JSON object** with the following keys: "
        "'question'(string),'options' (an object with keys 'A', 'B', 'C', 'D'), 'answer' (string with one of 'A', 'B', 'C', 'D'), and 'explanation' (string explaining the correct answer)."
        "Verify your math calculations are correct. Do not include any text outside the JSON object."
    )

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost"
    }

    payload = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": "You are a helpful quiz generator for aptitude topics.Always verify your calculations before providing answers."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.8,
        "max_tokens":500
    }

    try:
        response = requests.post(OPENROUTER_API_URL, headers=headers, json=payload)
        response.raise_for_status()
        result = response.json()
        raw_output = result['choices'][0]['message']['content']
        
        import json
        question_data = json.loads(raw_output)
        return question_data

    except requests.exceptions.RequestException as e:
        print(f"❌ API request failed: {e}")
    except json.JSONDecodeError:
        print("❌ Response was not valid JSON. Check the model prompt or temperature.")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")

    return {}