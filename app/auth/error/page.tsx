export default function AuthErrorPage() {
  return (
    <main className="min-h-screen bg-[#0b1220] px-6 py-24 text-white">
      <div className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-white/5 p-8">
        <h1 className="text-3xl font-bold">Authentication Error</h1>
        <p className="mt-4 text-white/75">
          The Supabase auth callback did not complete successfully. Double-check
          your redirect URLs, auth provider settings, and environment variables.
        </p>
      </div>
    </main>
  );
}
