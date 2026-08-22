import Link from 'next/link';
import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col justify-center bg-cream px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <Link
            href="/"
            className="font-display text-h2 font-bold tracking-wider text-navy-deep hover:opacity-90"
          >
            KYNDER
          </Link>
          <p className="mt-2 text-lead text-ink-70">
            Sign in to access your portal
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-ink-10 bg-cream-card p-8 shadow-2">
          <LoginForm />
        </div>

        <div className="mt-6 text-center text-small">
          <Link href="/" className="text-navy-deep hover:underline">
            ← Back to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}
