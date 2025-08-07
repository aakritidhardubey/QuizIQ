import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from flask import Flask, request, jsonify
from flask_cors import CORS
from answer_generator import generate_question
# from mock_generator import generate_question
from quiz_session import QuizSession
from tracker import QuizTracker
import json
import traceback

app = Flask(__name__)
CORS(app)


user_stats = {}
quiz_sessions = {}

@app.route('/api/test-groq', methods=['GET'])
def test_groq():
    try:
        # Test with a simple question
        test_question = generate_question("numbers", "easy", [])
        if test_question:
            return jsonify({"status": "success", "message": "GROQ API is working!", "sample": test_question})
        else:
            return jsonify({"status": "error", "message": "Failed to generate question"}), 500
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/generate-question', methods=['POST'])

def api_generate_question():
    try:
        data = request.json
        topic = data.get('topic', 'random')
        level = data.get('level', 'medium')
        previous_questions = data.get('previous_questions', [])
        
        print(f"Generating question for topic: {topic}, level: {level}")
        
        question = generate_question(topic, level, previous_questions)
        
        if not question:
            return jsonify({'error': 'Failed to generate question'}), 500
            
        return jsonify(question)
    except Exception as e:
        print(f"Error in generate_question endpoint: {str(e)}")
        print(traceback.format_exc())
        return jsonify({'error': str(e)}), 500

# ... rest of your code

@app.route('/api/topics', methods=['GET'])
def get_topics():
    with open('backend/topics.json', 'r') as f:
        topics = json.load(f)
    return jsonify(topics)

@app.route('/api/quiz/submit', methods=['POST'])
def submit_quiz():
    data = request.json
    user_id = data.get('user_id', 'anonymous')
    
    # Store quiz results
    if user_id not in user_stats:
        user_stats[user_id] = {
            'total_quizzes': 0,
            'total_correct': 0,
            'total_questions': 0,
            'topics_attempted': set()
        }
    
    stats = user_stats[user_id]
    stats['total_quizzes'] += 1
    stats['total_correct'] += data.get('correct', 0)
    stats['total_questions'] += data.get('total', 0)
    stats['topics_attempted'].add(data.get('topic', 'unknown'))
    
    return jsonify({'success': True})

@app.route('/api/user/stats', methods=['GET'])
def get_user_stats():
    # In production, get user_id from auth token
    user_id = request.args.get('user_id', 'anonymous')
    
    if user_id in user_stats:
        stats = user_stats[user_id]
        return jsonify({
            'totalQuizzes': stats['total_quizzes'],
            'accuracy': round((stats['total_correct'] / stats['total_questions'] * 100) if stats['total_questions'] > 0 else 0, 2),
            'topicsCompleted': len(stats['topics_attempted']),
            'avgTime': 45  # Mock data - implement actual timing
        })
    
    return jsonify({
        'totalQuizzes': 0,
        'accuracy': 0,
        'topicsCompleted': 0,
        'avgTime': 0
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)