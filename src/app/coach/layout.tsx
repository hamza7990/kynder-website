import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { Sidebar } from '@/components/dashboard/sidebar';

export default async function CoachLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSession();

  if (!user) {
    redirect('/login?redirect=/coach');
  }

  return (
    <div className="flex min-h-screen bg-cream text-ink">
      <Sidebar user={user} />
      <main className="flex-1 overflow-y-auto p-8 lg:p-12">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
