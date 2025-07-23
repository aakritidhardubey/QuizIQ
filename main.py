from backend.answer_generator import generate_question
from backend.adaptive_enigne import update_difficulty
from backend.tracker import QuizTracker
import re
import time
import threading


def normalize_options(options):
    if isinstance(options, list):
        return dict(zip(['A', 'B', 'C', 'D'], options))
    elif isinstance(options, dict):
        return {k.upper(): v for k, v in options.items()}
    else:
        return {}

def clean_answer(ans):
    match = re.match(r"[A-D]", str(ans).strip().upper())
    return match.group(0) if match else None


class TimerInput():
    def __init__(self,timeout=60):
        self.timeout=timeout
        self.result=None
        self.expired=False

    def get_input(self, prompt):
        def read_input():
            try:
                self.result = input(prompt).strip().upper()
            except:
                pass
    
        def expire():
            time.sleep(self.timeout)
            if self.result is None:
                self.expired=True
                print(f"\n⏰ Time's up! ({self.timeout} seconds)")
        
        input_thread = threading.Thread(target=read_input, daemon=True)
        timer_thread = threading.Thread(target=expire, daemon=True)
        input_thread.start()
        timer_thread.start()

        while input_thread.is_alive() and not self.expired:
            time.sleep(0.1)

        return self.result if self.result else "TIMEOUT"

    
def run_quiz(topic, num_questions,level="easy",time_limit=60,show_explanations=True):
    tracker = QuizTracker(topic)

    for q_num in range(1, num_questions + 1):
        print(f"\nQ{q_num}: Generating question (Level: {level})...")
        q = generate_question(topic, level,tracker.get_previous_question())
        
        if not q :
            print("⚠️ Skipping due to generation error.")
            tracker.log(level, correct=False, skipped=True)
            continue

        question = q.get("question", "")
        raw_options = normalize_options(q.get("options", {}))
        answer = clean_answer(q.get("answer", ""))
        explanation = q.get("explanation", "")

        options = normalize_options(raw_options)

        if not options or not answer:
            print("⚠️ Missing option or answer")
            tracker.log(level, correct=False, skipped=True)
            continue

        print(f"\nQ{q_num}: {question}")
        for key in ['A', 'B', 'C', 'D']:
            print(f"{key}) {options.get(key, '')}")
        print(f"You have {time_limit} seconds to Answer...")

        timer=TimerInput(time_limit)
        start=time.time()
        user_ans = timer.get_input("Answer (A-D or S to Skip): ").strip().upper()
        duration = time.time()-start

        if user_ans == "S":
            print("⏭️ Skipped.")
            tracker.log(level, correct=False, skipped=True, time_taken=duration, question_text=question)
            continue
        elif user_ans=="TIMEOUT":
            tracker.log(level, correct=False, skipped=True, time_taken=duration, question_text=question)
            continue
        elif user_ans == answer:
            print("✅ Correct!")
            if show_explanations:
                print(f"💡 {explanation}")
            correct = True
        else:
            print(f"❌ Incorrect. Correct answer was: {answer}) {options.get(answer, '')}")
            if show_explanations:
                print(f"{explanation}")
            correct = False

        tracker.log(level, correct, skipped=False,time_taken=duration, question_text=question)
        level = update_difficulty(level, correct)
        time.sleep(1)

    print("\n📝 Final Report")
    print(tracker.generate_report())




if __name__ == "__main__":

    run_quiz("probability", 5,"easy")