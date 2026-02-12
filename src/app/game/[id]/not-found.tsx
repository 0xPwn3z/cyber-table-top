import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-red-800 bg-red-950/30">
          <ShieldAlert className="h-10 w-10 text-red-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-100">
          Scenario Not Found
        </h2>
        <p className="mt-2 max-w-sm text-sm text-slate-400">
          The requested scenario does not exist or has been removed. Return to
          the dashboard to select an available exercise.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 text-sm text-emerald-400 transition-colors hover:text-emerald-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
