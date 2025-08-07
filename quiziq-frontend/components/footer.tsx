export default function Footer() {
  return (
    <footer className="bg-primary text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">QuizIQ</h3>
            <p className="text-sm text-gray-200">Master your aptitude with adaptive learning</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/about" className="hover:text-gray-200 transition">About Us</a></li>
              <li><a href="/topics" className="hover:text-gray-200 transition">Topics</a></li>
              <li><a href="/leaderboard" className="hover:text-gray-200 transition">Leaderboard</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Contact</h4>
            <p className="text-sm text-gray-200">support@quiziq.com</p>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t border-blue-800 text-center text-sm text-gray-200">
          © 2024 QuizIQ. All rights reserved.
        </div>
      </div>
    </footer>
  )
}