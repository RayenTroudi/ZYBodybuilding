import { redirect } from 'next/navigation';
import { getLoggedInUser, isAdmin } from '@/lib/auth';
import { createAdminClient } from '@/lib/appwrite/server';
import { appwriteConfig } from '@/lib/appwrite/config';
import { Query } from 'node-appwrite';
import { Users, UserCheck, DollarSign, TrendingUp, AlertTriangle, Activity } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getDashboardStats() {
  const { databases } = createAdminClient();

  const allMembers = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.membersCollectionId,
    [Query.limit(5000)]
  );

  const now = new Date();

  const activeMembers = allMembers.documents.filter(m => new Date(m.subscriptionEndDate) >= now).length;
  const expiredMembers = allMembers.documents.filter(m => new Date(m.subscriptionEndDate) < now).length;

  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  const allPayments = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.paymentsCollectionId,
    [Query.limit(5000), Query.orderDesc('paymentDate')]
  );

  const monthlyPayments = allPayments.documents.filter(p => {
    const d = new Date(p.paymentDate);
    return d >= firstDayOfMonth && d <= lastDayOfMonth;
  });

  const monthlyRevenue = monthlyPayments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
  const totalRevenue = allPayments.documents.reduce((sum, p) => sum + p.amount, 0);
  const recentPayments = allPayments.documents.slice(0, 6);

  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
  const expiringSoon = allMembers.documents.filter(m => {
    const end = new Date(m.subscriptionEndDate);
    return end >= now && end <= sevenDaysFromNow;
  });

  return {
    totalMembers: allMembers.total,
    activeMembers,
    expiredMembers,
    monthlyRevenue,
    totalRevenue,
    recentPayments,
    expiringSoon,
  };
}

const label = (text) => (
  <p
    className="text-neutral-700 text-[9px] font-semibold uppercase mb-1"
    style={{ letterSpacing: '0.2em' }}
  >
    {text}
  </p>
);

export default async function AdminDashboardPage() {
  const user = await getLoggedInUser();
  const adminAccess = await isAdmin();
  if (!user || !adminAccess) redirect('/admin/ironcore/login');

  const stats = await getDashboardStats();
  const activeRate = stats.totalMembers > 0
    ? ((stats.activeMembers / stats.totalMembers) * 100).toFixed(1)
    : '0.0';
  const avgPayment = stats.recentPayments.length > 0
    ? (stats.recentPayments.reduce((s, p) => s + p.amount, 0) / stats.recentPayments.length).toFixed(2)
    : '0.00';

  return (
    <div className="space-y-5 max-w-7xl">

      {/* Page title */}
      <div className="flex items-end justify-between pb-4 border-b border-[#141414]">
        <div>
          {label('Overview')}
          <h1
            className="text-white font-black uppercase leading-none"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '2rem', letterSpacing: '-0.01em' }}
          >
            Dashboard
          </h1>
        </div>
        <p className="text-neutral-700 text-[10px] uppercase" style={{ letterSpacing: '0.15em' }}>
          {new Date().toLocaleDateString('fr-TN', { day: '2-digit', month: 'short', year: 'numeric' })}
        </p>
      </div>

      {/* ── KPI row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">

        {/* Total Members */}
        <div className="bg-[#0c0c0c] border border-[#161616] hover:border-[#222] transition-colors p-5 group">
          <div className="flex items-start justify-between mb-4">
            {label('Total Members')}
            <Users size={14} className="text-neutral-800 group-hover:text-neutral-600 transition-colors" />
          </div>
          <p
            className="text-white font-black leading-none"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '2.4rem' }}
          >
            {stats.totalMembers}
          </p>
        </div>

        {/* Active Members */}
        <div className="bg-[#0c0c0c] border border-[#161616] hover:border-[#222] transition-colors p-5 group">
          <div className="flex items-start justify-between mb-4">
            {label('Active')}
            <UserCheck size={14} className="text-neutral-800 group-hover:text-neutral-600 transition-colors" />
          </div>
          <p
            className="font-black leading-none"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '2.4rem', color: '#10B981' }}
          >
            {stats.activeMembers}
          </p>
          <p className="text-neutral-700 text-[10px] mt-1.5" style={{ letterSpacing: '0.1em' }}>
            {activeRate}% active rate
          </p>
        </div>

        {/* Monthly Revenue */}
        <div className="bg-[#0c0c0c] border border-[#161616] hover:border-primary/20 transition-colors p-5 group relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-start justify-between mb-4">
            {label('Monthly Revenue')}
            <DollarSign size={14} className="text-neutral-800 group-hover:text-neutral-600 transition-colors" />
          </div>
          <p
            className="text-white font-black leading-none"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '2.4rem' }}
          >
            {stats.monthlyRevenue.toFixed(0)}
            <span className="text-neutral-600 text-lg ml-1">TND</span>
          </p>
        </div>

        {/* Total Revenue */}
        <div className="bg-[#0c0c0c] border border-[#161616] hover:border-primary/20 transition-colors p-5 group relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-start justify-between mb-4">
            {label('Total Revenue')}
            <TrendingUp size={14} className="text-neutral-800 group-hover:text-neutral-600 transition-colors" />
          </div>
          <p
            className="text-white font-black leading-none"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '2.4rem' }}
          >
            {stats.totalRevenue.toFixed(0)}
            <span className="text-neutral-600 text-lg ml-1">TND</span>
          </p>
        </div>
      </div>

      {/* ── Main two-col ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Recent Payments */}
        <div className="bg-[#0c0c0c] border border-[#161616]">
          <div className="px-5 py-4 border-b border-[#161616] flex items-center justify-between">
            <div>
              {label('Finance')}
              <h2
                className="text-white font-black uppercase leading-none"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.2rem', letterSpacing: '0.04em' }}
              >
                Recent Payments
              </h2>
            </div>
            <Activity size={14} className="text-neutral-800" />
          </div>

          <div>
            {stats.recentPayments.length === 0 ? (
              <p className="text-neutral-700 text-xs text-center py-10" style={{ letterSpacing: '0.1em' }}>
                No recent payments
              </p>
            ) : (
              stats.recentPayments.map((payment, i) => (
                <div
                  key={payment.$id}
                  className={`flex items-center justify-between px-5 py-3.5 hover:bg-[#0f0f0f] transition-colors ${
                    i < stats.recentPayments.length - 1 ? 'border-b border-[#111]' : ''
                  }`}
                >
                  <div className="min-w-0">
                    <p className="text-white text-sm font-semibold truncate">{payment.memberName}</p>
                    <p className="text-neutral-700 text-[10px] uppercase mt-0.5" style={{ letterSpacing: '0.08em' }}>
                      {payment.planName}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <p
                      className="font-black"
                      style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.1rem', color: '#10B981' }}
                    >
                      {payment.amount.toFixed(2)}
                      <span className="text-neutral-700 text-xs ml-1">TND</span>
                    </p>
                    <p className="text-neutral-700 text-[10px] mt-0.5">
                      {new Date(payment.paymentDate).toLocaleDateString('fr-TN', { day: '2-digit', month: 'short' })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Expiring Soon */}
        <div className="bg-[#0c0c0c] border border-[#161616]">
          <div className="px-5 py-4 border-b border-[#161616] flex items-center justify-between">
            <div>
              {label('Alerts')}
              <h2
                className="text-white font-black uppercase leading-none"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.2rem', letterSpacing: '0.04em' }}
              >
                Expiring Soon
                <span className="text-primary ml-2 text-base">{stats.expiringSoon.length}</span>
              </h2>
            </div>
            <AlertTriangle size={14} className={stats.expiringSoon.length > 0 ? 'text-yellow-500' : 'text-neutral-800'} />
          </div>

          <div>
            {stats.expiringSoon.length === 0 ? (
              <p className="text-neutral-700 text-xs text-center py-10" style={{ letterSpacing: '0.1em' }}>
                No expiring memberships this week
              </p>
            ) : (
              stats.expiringSoon.map((member, i) => {
                const daysLeft = Math.ceil(
                  (new Date(member.subscriptionEndDate) - new Date()) / (1000 * 60 * 60 * 24)
                );
                return (
                  <div
                    key={member.$id}
                    className={`flex items-center justify-between px-5 py-3.5 hover:bg-[#0f0f0f] transition-colors ${
                      i < stats.expiringSoon.length - 1 ? 'border-b border-[#111]' : ''
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="text-white text-sm font-semibold truncate">{member.name}</p>
                      <p className="text-neutral-700 text-[10px] uppercase mt-0.5" style={{ letterSpacing: '0.08em' }}>
                        {member.planName}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <p
                        className="font-black"
                        style={{
                          fontFamily: "'Barlow Condensed', sans-serif",
                          fontSize: '1.1rem',
                          color: daysLeft <= 2 ? '#EF4444' : '#F59E0B',
                        }}
                      >
                        {daysLeft}d
                      </p>
                      <p className="text-neutral-700 text-[10px] mt-0.5">
                        {new Date(member.subscriptionEndDate).toLocaleDateString('fr-TN', { day: '2-digit', month: 'short' })}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* ── Status overview ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-[#0c0c0c] border border-[#161616] p-5">
          {label('Expired Memberships')}
          <p
            className="font-black leading-none mt-2"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '2.6rem', color: '#EF4444' }}
          >
            {stats.expiredMembers}
          </p>
        </div>

        <div className="bg-[#0c0c0c] border border-[#161616] p-5">
          {label('Active Rate')}
          <p
            className="font-black leading-none mt-2"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '2.6rem', color: '#10B981' }}
          >
            {activeRate}
            <span className="text-neutral-600 text-2xl">%</span>
          </p>
        </div>

        <div className="bg-[#0c0c0c] border border-[#161616] p-5 relative overflow-hidden group hover:border-primary/20 transition-colors">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
          {label('Avg. Payment (Recent)')}
          <p
            className="text-white font-black leading-none mt-2"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '2.6rem' }}
          >
            {avgPayment}
            <span className="text-neutral-600 text-xl ml-1">TND</span>
          </p>
        </div>
      </div>

    </div>
  );
}
