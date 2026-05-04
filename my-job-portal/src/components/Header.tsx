import Link from "next/link";

function NextJobLogo() {
  return (
    <svg
      viewBox="0 0 56 56"
      className="h-11 w-11 shrink-0"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect x="4" y="4" width="48" height="48" rx="16" fill="url(#nextjob-shell)" />
      <path
        d="M16 17h5.25l10.5 13.5V17H37v22h-5.25l-10.5-13.5V39H16V17Z"
        fill="white"
      />
      <path
        d="M40 17v13.5c0 5.9-3.4 9-9 9-2.44 0-4.62-.55-6.5-1.66"
        stroke="#BFDBFE"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M33 36.5c1.44 0 2.65-.43 3.62-1.3.92-.9 1.38-2.33 1.38-4.3V17"
        stroke="white"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id="nextjob-shell" x1="9" y1="8" x2="47" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0F172A" />
          <stop offset="0.5" stopColor="#334155" />
          <stop offset="1" stopColor="#4F46E5" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between xl:px-6">
        <Link href="/" className="group inline-flex items-center gap-3">
          <NextJobLogo />
          <div>
            <span className="block text-xl font-bold tracking-tight text-slate-900 transition group-hover:text-indigo-700">
              Next Job
            </span>
            <p className="text-sm text-gray-500">Find your next opportunity</p>
          </div>
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link
            href="/"
            className="text-gray-600 transition hover:text-indigo-600"
          >
            Jobs
          </Link>
        </nav>
      </div>
    </header>
  );
}
