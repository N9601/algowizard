import AuthForm from "components/auth/AuthForm";

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#081120] to-[#0d1830] px-6 py-24">
      <AuthForm mode="signup" />
    </main>
  );
}
