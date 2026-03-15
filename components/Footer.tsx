import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-[#050b14] text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-[0.98rem] text-white/48 sm:flex-row sm:items-center sm:justify-between">
        <span>&copy; {year} G Nandakishore Reddy</span>

        <div className="flex items-center gap-8">
          <Link href="/about" className="transition hover:text-white/78">
            About
          </Link>
          <a
            href="https://github.com/N9601"
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-white/78"
          >
            Portfolio
          </a>
        </div>
      </div>
    </footer>
  );
}
