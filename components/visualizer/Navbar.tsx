"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Navbar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === "/visualizer") {
      return pathname === "/visualizer"
    }
    return pathname.startsWith(path)
  }

  const navItem = (label: string, href: string) => (
    <Link
      href={href}
      className="relative pb-1 hover:text-white"
    >
      <span>{label}</span>

      {isActive(href) && (
        <span className="absolute left-0 right-0 -bottom-1 h-[2px] bg-blue-500 rounded-full" />
      )}
    </Link>
  )

  return (
    <nav className="flex items-center justify-between px-8 py-4 border-b border-white/10">
      
      
      
{/* Logo */}
<Link
  href="/"
  className="
    flex items-center gap-0 text-xl font-semibold
    cursor-pointer
    transition-opacity hover:opacity-90
  "
>

  <span className="flex items-center justify-center w-9 h-9 -mr-1">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="rgb(59 130 246)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M8 13l4-4 4 4" />
    </svg>
  </span>

  <span>
    <span className="text-blue-500">Algo</span>Wizard Visualizer
  </span>
</Link>





      {/* Links */}
      <div className="flex items-center gap-6 text-sm text-white/70">
        {navItem("Home", "/visualizer")}
        {navItem("Sorting", "/visualizer/sorting")}
        {navItem("Searching", "/visualizer/searching")}
        {navItem("Graph", "/visualizer/graph")}

        {/* GitHub */}
        <a
          href="https://github.com/N9601"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white transition"
          title="GitHub"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 .5C5.73.5.5 5.74.5 12.03c0 5.11 3.29 9.45 7.86 10.98.58.11.79-.25.79-.56v-2.02c-3.2.7-3.87-1.55-3.87-1.55-.52-1.32-1.28-1.67-1.28-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.02 1.75 2.68 1.25 3.33.96.1-.74.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 2.9-.39c.98 0 1.97.13 2.9.39 2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.77.11 3.06.74.81 1.19 1.84 1.19 3.1 0 4.43-2.69 5.41-5.25 5.69.41.36.78 1.08.78 2.18v3.23c0 .31.21.68.8.56 4.56-1.53 7.85-5.87 7.85-10.98C23.5 5.74 18.27.5 12 .5z"/>
          </svg>
        </a>
      </div>
    </nav>
  )
}
     