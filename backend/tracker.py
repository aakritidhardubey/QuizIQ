import time
class QuizTracker:

    def __init__(self,topic):
        self.topic=topic
        self.history=[]
        self.level_count={"easy":0,"medium":0,"hard":0}
        self.correct_count=0
        self.skipped=0
        self.total_time=0
        self.question_times=[]
        self.previous_questions=[]
    
    def start_question_timer(self):
        self.question_start_time=time.time()
    
    def end_question_timer(self):
        if hasattr(self,'question_start_time'):
            time_taken=time.time()-self.question_start_time
            self.question_times.append(time_taken)
            self.total_time+=time_taken
            return time_taken
        return 0
    
    def log(self,level,correct,skipped,time_taken=0,question_text=""):
        self.level_count[level]+=1
        if skipped:
            self.skipped+=1
        elif correct:
            self.correct_count+=1
        if question_text:
            self.previous_questions.append(question_text)
        
        self.history.append({
            "level":level,
            "correct":correct,
            "skipped":skipped,
            "time_taken":time_taken,
            "question":question_text[:50]+"..."if len(question_text) > 50 else question_text
        })
    
    def get_previous_question(self):
        return self.previous_questions
    

    def generate_report(self):
        questions_attempted = len(self.history)
        questions_answered = questions_attempted - self.skipped
        accuracy = (self.correct_count / questions_answered * 100) if questions_answered > 0 else 0
        avg_time = (self.total_time / questions_answered) if questions_answered > 0 else 0
        
        return {
            "topic": self.topic,
            "questions_attempted": questions_attempted,
            "questions_answered": questions_answered,
            "correct": self.correct_count,
            "incorrect": questions_answered - self.correct_count,
            "skipped": self.skipped,
            "accuracy": round(accuracy, 2),
            "total_time": round(self.total_time, 2),
            "average_time_per_question": round(avg_time, 2),
            "levels": self.level_count,
            "fastest_answer": round(min(self.question_times), 2) if self.question_times else 0,
            "slowest_answer": round(max(self.question_times), 2) if self.question_times else 0
        }
    
    def person_report(self):
        report=self.generate_report()

        print("\n" + "="*50)
        print(f"📊 QUIZ REPORT - {report['topic'].upper()}")
        print("="*50)
        
        print(f"📝 Questions Attempted: {report['questions_attempted']}")
        print(f"✅ Correct Answers: {report['correct']}")
        print(f"❌ Incorrect Answers: {report['incorrect']}")
        print(f"⏭️  Skipped: {report['skipped']}")
        print(f"🎯 Accuracy: {report['accuracy']}%")
        
        print(f"\n⏱️  TIME STATISTICS:")
        print(f"   Total Time: {report['total_time']} seconds")
        print(f"   Average per Question: {report['average_time_per_question']} seconds")
        if report['fastest_answer'] > 0:
            print(f"   Fastest Answer: {report['fastest_answer']} seconds")
            print(f"   Slowest Answer: {report['slowest_answer']} seconds")
        
        print(f"\n📈 DIFFICULTY BREAKDOWN:")
        for level, count in report['levels'].items():
            print(f"   {level.capitalize()}: {count} questions")
        
        print("="*50)
        
        # Performance feedback
        if report['accuracy'] >= 80:
            print("🎉 Excellent performance! Keep it up!")
        elif report['accuracy'] >= 60:
            print("👍 Good job! Room for improvement.")
        else:
            print("📚 Keep practicing! You'll get better.")
        
        if report['average_time_per_question'] < 30:
            print("⚡ Great speed! You're thinking quickly.")
        elif report['average_time_per_question'] > 60:
            print("🤔 Take your time, but try to be a bit faster next time.")