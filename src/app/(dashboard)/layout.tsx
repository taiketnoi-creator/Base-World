import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Lấy thông tin Family của user
  const { data: memberData } = await supabase
    .from('family_members')
    .select('family_id, families(name)')
    .eq('user_id', user.id)
    .single();

  const familyName = (memberData?.families as any)?.name || 'Gia đình';
  const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Thành viên';

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar familyName={familyName} />
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <Header userName={userName} userEmail={user.email || ''} />
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
