# for session tracking 
from backend.answer_generator import generate_question
from backend.adaptive_engine import update_difficulty
from backend.tracker import QuizTracker
import time
import json
import threading


class QuizSession:
    def __init__(self, topic: str, start_level: str = "easy", num_questions: int = 4):
        self.topic = topic
        self.difficulty = start_level
        self.num_questions = num_questions
        self.tracker = QuizTracker(topic)
        self.questions = []

    @staticmethod
    def load_topic():
        with open("backend/topics.json") as f:
            return json.load(f)
        
    @staticmethod
    def get_user_choice(prompt,options):
        print(prompt)

        for i,opt in enumerate(options,start=1):
            print(f"{i}.{opt}")
        while True:
            try:
                choice=int(input("Enter your Choice Number :"))
                if 1<=choice<=len(options):
                    return options[choice-1]
            except ValueError:
                pass
            print("Invalid choice. Try again.")
        
    def run(self):
        print("Welcome to QuizMania!")
        for i in range(1, self.num_questions + 1):
            print(f"\nQ{i}:")
            prev_questions = [q['question'] for q in self.questions]
            q_data = generate_question(self.topic, self.difficulty, previous_questions=prev_questions)

            if not q_data:
                print("⚠️ Failed to generate question. Skipping.")
                self.tracker.log(self.difficulty, correct=False, skipped=True)
                continue

            self.questions.append(q_data)
            print(q_data['question'])
            for key, val in q_data['options'].items():
                print(f"{key}) {val}")

            self.start_time = time.time()
            answer, time_taken = self.timed_input("Your answer (A/B/C/D or S to skip): ")


            if answer == 'S' or time_taken > 60:
                print("⏱️ Skipped.")
                self.tracker.log(self.difficulty, correct=False, skipped=True)
                continue

            correct = answer == q_data['answer']
            if correct:
                print("✅ Correct!")
            else:
                print(f"❌ Incorrect. Correct answer was: {q_data['answer']}")

            self.tracker.log(self.difficulty, correct, skipped=False)
            self.difficulty = update_difficulty(self.difficulty, correct)

        self.show_report()

    def show_report(self):
        print("\nFinal Report:")
        report = self.tracker.generate_report()
        print(json.dumps(report, indent=2))

        review = input("\nDo you want to review all questions with correct answers and explanations? (y/n): ").strip().lower()
        if review == 'y':
            for idx, q in enumerate(self.questions, 1):
                print(f"\nQ{idx}: {q['question']}")
                for opt, val in q['options'].items():
                    print(f"{opt}) {val}")
                print(f"Correct Answer: {q['answer']}")
                print(f"Explanation: {q['explanation']}")
    
    def timed_input(self, prompt, timeout=60):
        user_input = [None]
        def get_input():
            user_input[0] = input(prompt)

        thread = threading.Thread(target=get_input)
        thread.start()
        thread.join(timeout)
        if thread.is_alive():
            print("\n⏰ Time's up! Auto-skipping the question.")
            return 'S', timeout
        return user_input[0].strip().upper(), time.time() - self.start_time


def start_quiz_session():
    topics = QuizSession.load_topic()
    topic = QuizSession.get_user_choice("Choose a topic:", topics)
    level = QuizSession.get_user_choice("Choose starting difficulty:", ["easy", "medium", "hard"])
    session = QuizSession(topic=topic, start_level=level)
    session.run()
    return session