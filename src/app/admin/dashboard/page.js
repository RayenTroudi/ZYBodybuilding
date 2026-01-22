import { redirect } from 'next/navigation';
import { getLoggedInUser, isAdmin } from '@/lib/auth';
import { createAdminClient } from '@/lib/appwrite/server';
import { appwriteConfig } from '@/lib/appwrite/config';
import { Query } from 'node-appwrite';

// Force dynamic rendering - required for cookie-based authentication
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getDashboardStats() {
  const { databases } = createAdminClient();

  // Get members stats
  const allMembers = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.membersCollectionId,
    [Query.limit(5000)]
  );

  const now = new Date();
  
  // Calculate actual active/expired members based on subscription end date
  const activeMembers = allMembers.documents.filter(m => {
    const endDate = new Date(m.subscriptionEndDate);
    return endDate >= now; // Active if subscription end date is today or in the future
  }).length;
  
  const expiredMembers = allMembers.documents.filter(m => {
    const endDate = new Date(m.subscriptionEndDate);
    return endDate < now; // Expired if subscription end date is in the past
  }).length;

  // Get payments stats
  const thisMonth = new Date();
  thisMonth.setDate(1);
  thisMonth.setHours(0, 0, 0, 0);

  const allPayments = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.paymentsCollectionId,
    [Query.limit(5000), Query.orderDesc('paymentDate')]
  );

  const monthlyPayments = allPayments.documents.filter(
    p => new Date(p.paymentDate) >= thisMonth
  );

  const monthlyRevenue = monthlyPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalRevenue = allPayments.documents.reduce((sum, p) => sum + p.amount, 0);

  // Get recent payments
  const recentPayments = allPayments.documents.slice(0, 5);

  // Get expiring soon (within 7 days) - only truly active members
  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

  const expiringSoon = allMembers.documents.filter(m => {
    const endDate = new Date(m.subscriptionEndDate);
    return endDate >= now && endDate <= sevenDaysFromNow;
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

export default async function AdminDashboardPage() {
  const user = await getLoggedInUser();
  const adminAccess = await isAdmin();

  if (!user || !adminAccess) {
    redirect('/admin/ironcore/login');
  }

  const stats = await getDashboardStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Dashboard</h1>
        <p className="text-neutral-500 font-medium">Overview of your gym management system</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800 hover:border-primary/30 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-500 text-xs font-semibold uppercase tracking-wider">Total Members</p>
              <p className="text-4xl font-black text-white mt-3 tracking-tight">{stats.totalMembers}</p>
            </div>
            <div className="text-5xl opacity-70">👥</div>
          </div>
        </div>

        <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800 hover:border-green-500/30 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-500 text-xs font-semibold uppercase tracking-wider">Active Members</p>
              <p className="text-4xl font-black text-green-400 mt-3 tracking-tight">{stats.activeMembers}</p>
            </div>
            <div className="text-5xl opacity-70">✅</div>
          </div>
        </div>

        <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800 hover:border-primary/30 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-500 text-xs font-semibold uppercase tracking-wider">Monthly Revenue</p>
              <p className="text-4xl font-black text-white mt-3 tracking-tight">{stats.monthlyRevenue.toFixed(2)} TND</p>
            </div>
            <div className="text-5xl opacity-70">💰</div>
          </div>
        </div>

        <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800 hover:border-primary/30 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-500 text-xs font-semibold uppercase tracking-wider">Total Revenue</p>
              <p className="text-4xl font-black text-white mt-3 tracking-tight">{stats.totalRevenue.toFixed(2)} TND</p>
            </div>
            <div className="text-5xl opacity-70">📈</div>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Payments */}
        <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800">
          <h2 className="text-2xl font-black text-white mb-6 tracking-tight">Recent Payments</h2>
          <div className="space-y-3">
            {stats.recentPayments.map((payment) => (
              <div key={payment.$id} className="flex items-center justify-between p-4 bg-neutral-800 rounded-lg border border-neutral-700 hover:border-neutral-600 transition-colors">
                <div>
                  <p className="text-white font-semibold">{payment.memberName}</p>
                  <p className="text-xs text-neutral-500 font-medium mt-1">{payment.planName}</p>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-black">{payment.amount.toFixed(2)} TND</p>
                  <p className="text-xs text-neutral-400">
                    {new Date(payment.paymentDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Expiring Soon */}
        <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800">
          <h2 className="text-2xl font-black text-white mb-6 tracking-tight">
            Expiring Soon ({stats.expiringSoon.length})
          </h2>
          <div className="space-y-3">
            {stats.expiringSoon.length === 0 ? (
              <p className="text-neutral-500 text-center py-8">No memberships expiring soon</p>
            ) : (
              stats.expiringSoon.map((member) => (
                <div key={member.$id} className="flex items-center justify-between p-4 bg-neutral-800 rounded-lg border border-neutral-700 hover:border-yellow-500/30 transition-colors">
                  <div>
                    <p className="text-white font-semibold">{member.name}</p>
                    <p className="text-xs text-neutral-500 font-medium mt-1">{member.planName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-yellow-400 font-black text-sm">
                      {new Date(member.subscriptionEndDate).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-neutral-400">Expires</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800">
        <h2 className="text-2xl font-black text-white mb-6 tracking-tight">Status Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 bg-neutral-800 rounded-lg border border-neutral-700">
            <p className="text-neutral-500 text-xs font-semibold uppercase tracking-wider mb-2">Expired Memberships</p>
            <p className="text-3xl font-black text-red-400">{stats.expiredMembers}</p>
          </div>
          <div className="p-5 bg-neutral-800 rounded-lg border border-neutral-700">
            <p className="text-neutral-500 text-xs font-semibold uppercase tracking-wider mb-2">Active Rate</p>
            <p className="text-3xl font-black text-green-400">
              {stats.totalMembers > 0 
                ? ((stats.activeMembers / stats.totalMembers) * 100).toFixed(1) 
                : 0}%
            </p>
          </div>
          <div className="p-5 bg-neutral-800 rounded-lg border border-neutral-700">
            <p className="text-neutral-500 text-xs font-semibold uppercase tracking-wider mb-2">Avg Payment</p>
            <p className="text-3xl font-black text-primary">
              {stats.recentPayments.length > 0 
                ? (stats.recentPayments.reduce((sum, p) => sum + p.amount, 0) / stats.recentPayments.length).toFixed(2)
                : 0} TND
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
