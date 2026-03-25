import { RegisterForm } from "@/components/auth/register-form";

export const metadata = {
  title: "Create Account | Ekene Sports",
  description: "Create your Ekene Sports account to start shopping and tracking your orders.",
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-neutral-light px-4 py-12">
      <div className="w-full max-w-md">
        {/* Brand header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/30">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-7 w-7 text-white"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </div>
          <h1 className="font-heading text-3xl font-extrabold text-neutral-dark">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-neutral-dark/60">
            Join Ekene Sports and start shopping your favourite gear.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-white p-8 shadow-[0_4px_24px_rgba(0,0,0,0.08)] md:p-10">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
