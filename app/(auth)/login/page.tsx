import Link from 'next/link';

export default function LoginPage() {
  return (
    <main className="max-w-md mx-auto py-20 px-4">
      <h1 className="text-2xl font-semibold">Authentication Disabled</h1>
      <p className="mt-2 text-slate-600">Authentication is disabled in this build. The app uses a mock user for development. Continue to the dashboard to explore features.</p>

      <div className="mt-6 bg-white p-6 rounded-md shadow-sm">
        <div className="flex gap-3">
          <Link href="/dashboard" className="rounded-md bg-slate-900 text-white px-4 py-2">Open Dashboard</Link>
          <Link href="/" className="text-slate-600">Back home</Link>
        </div>
      </div>
    </main>
  );
}
