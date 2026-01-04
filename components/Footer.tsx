export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between text-sm text-gray-500">
        <span>© 2026 G Nandakishore Reddy</span>

        <div className="flex gap-6">
          <a
            href="/about"
            className="hover:text-gray-700 transition"
          >
            About
          </a>
          <a
            href="/portfolio"
            className="hover:text-gray-700 transition"
          >
            Portfolio
          </a>
        </div>
      </div>
    </footer>
  )
}
