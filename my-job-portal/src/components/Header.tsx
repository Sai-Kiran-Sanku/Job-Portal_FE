import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="group">
          <span className="text-xl font-bold tracking-tight text-indigo-600 transition group-hover:text-indigo-700">
            NextJob
          </span>
          <p className="text-sm text-gray-500">Find your next opportunity</p>
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link
            href="/"
            className="text-gray-600 transition hover:text-indigo-600"
          >
            Jobs
          </Link>
          <Link
            href="/admin"
            className="rounded-md bg-indigo-600 px-3 py-1.5 text-white shadow-sm transition hover:bg-indigo-700"
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
