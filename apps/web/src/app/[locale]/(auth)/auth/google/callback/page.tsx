import { Suspense } from "react";
import { GoogleCallbackForm } from "./GoogleCallbackForm";

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <GoogleCallbackForm />
    </Suspense>
  );
}
