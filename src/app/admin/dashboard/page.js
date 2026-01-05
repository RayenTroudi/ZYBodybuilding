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
    [Query.limit(500)]
  );

  const activeMembers = allMembers.documents.filter(m => m.status === 'Active').length;
  const expiredMembers = allMembers.documents.filter(m => m.status === 'Expired').length;

  // Get payments stats
  const thisMonth = new Date();
  thisMonth.setDate(1);
  thisMonth.setHours(0, 0, 0, 0);

  const allPayments = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.paymentsCollectionId,
    [Query.limit(500)]
  );

  const monthlyPayments = allPayments.documents.filter(
    p => new Date(p.paymentDate) >= thisMonth
  );

  const monthlyRevenue = monthlyPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalRevenue = allPayments.documents.reduce((sum, p) => sum + p.amount, 0);

  // Get recent payments
  const recentPayments = allPayments.documents.slice(0, 5);

  // Get expiring soon (within 3 days)
  const threeDaysFromNow = new Date();
  threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
  const now = new Date();

  const expiringSoon = allMembers.documents.filter(m => {
    const endDate = new Date(m.subscriptionEndDate);
    return m.status === 'Active' && endDate > now && endDate <= threeDaysFromNow;
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
    redirect('/admin/login');
  }

  const stats = await getDashboardStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Overview of your gym management system</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Members</p>
              <p className="text-3xl font-bold text-white mt-2">{stats.totalMembers}</p>
            </div>
            <div className="text-4xl">👥</div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Members</p>
              <p className="text-3xl font-bold text-green-500 mt-2">{stats.activeMembers}</p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Monthly Revenue</p>
              <p className="text-3xl font-bold text-white mt-2">${stats.monthlyRevenue.toFixed(2)}</p>
            </div>
            <div className="text-4xl">💰</div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Revenue</p>
              <p className="text-3xl font-bold text-white mt-2">${stats.totalRevenue.toFixed(2)}</p>
            </div>
            <div className="text-4xl">📈</div>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Payments */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4">Recent Payments</h2>
          <div className="space-y-3">
            {stats.recentPayments.map((payment) => (
              <div key={payment.$id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div>
                  <p className="text-white font-medium">{payment.memberName}</p>
                  <p className="text-sm text-gray-400">{payment.planName}</p>
                </div>
                <div className="text-right">
                  <p className="text-green-500 font-semibold">${payment.amount.toFixed(2)}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(payment.paymentDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Expiring Soon */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4">
            Expiring Soon ({stats.expiringSoon.length})
          </h2>
          <div className="space-y-3">
            {stats.expiringSoon.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No memberships expiring soon</p>
            ) : (
              stats.expiringSoon.map((member) => (
                <div key={member.$id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <div>
                    <p className="text-white font-medium">{member.name}</p>
                    <p className="text-sm text-gray-400">{member.planName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-yellow-500 font-semibold text-sm">
                      {new Date(member.subscriptionEndDate).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-400">Expires</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-4">Status Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-700 rounded-lg">
            <p className="text-gray-400 text-sm mb-1">Expired Memberships</p>
            <p className="text-2xl font-bold text-red-500">{stats.expiredMembers}</p>
          </div>
          <div className="p-4 bg-gray-700 rounded-lg">
            <p className="text-gray-400 text-sm mb-1">Active Rate</p>
            <p className="text-2xl font-bold text-green-500">
              {stats.totalMembers > 0 
                ? ((stats.activeMembers / stats.totalMembers) * 100).toFixed(1) 
                : 0}%
            </p>
          </div>
          <div className="p-4 bg-gray-700 rounded-lg">
            <p className="text-gray-400 text-sm mb-1">Avg Payment</p>
            <p className="text-2xl font-bold text-blue-500">
              ${stats.recentPayments.length > 0 
                ? (stats.recentPayments.reduce((sum, p) => sum + p.amount, 0) / stats.recentPayments.length).toFixed(2)
                : 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
