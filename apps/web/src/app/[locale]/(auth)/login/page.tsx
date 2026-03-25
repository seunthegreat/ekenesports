import { LoginForm } from "@/components/auth/login-form";

export const metadata = {
  title: "Sign In | Ekene Sports",
  description: "Sign in to your Ekene Sports account to access your orders and settings.",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-neutral-light px-4 py-12">
      <div className="w-full max-w-md">
        {/* Brand header */}
        <div className="mb-8 text-center">
          <h1 className="font-heading text-3xl font-extrabold text-neutral-dark">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-neutral-dark/60">
            Sign in to access your orders and account settings.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-white p-8 shadow-[0_4px_24px_rgba(0,0,0,0.08)] md:p-10">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
