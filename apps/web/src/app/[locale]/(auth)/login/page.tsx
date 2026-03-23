"use client";

import { Button } from "@/components/ui/button";
import { Chrome } from "lucide-react";

export default function LoginPage() {
  const handleGoogleLogin = () => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:4000';
    // Redirect the entire browser to the backend initiation endpoint
    window.location.href = `${backendUrl}/auth/google/login`;
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-neutral-light px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-premium md:p-12">
        <div className="text-center">
          <h1 className="font-heading text-3xl font-extrabold text-neutral-dark md:text-4xl">
            Welcome Back
          </h1>
          <p className="mt-2 text-neutral-dark/60">
            Sign in to access your orders and account settings.
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <Button
            onClick={handleGoogleLogin}
            variant="outline"
            size="lg"
            className="w-full border-neutral-light bg-white py-6 text-neutral-dark hover:bg-neutral-light hover:text-neutral-dark"
          >
            <Chrome className="mr-2 h-5 w-5 text-primary" />
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-neutral-light" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-neutral-dark/40">
                Or secure access
              </span>
            </div>
          </div>

          <p className="text-center text-xs text-neutral-dark/40">
            By continuing, you agree to Ekene Sport's{" "}
            <a href="#" className="underline hover:text-primary">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline hover:text-primary">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
