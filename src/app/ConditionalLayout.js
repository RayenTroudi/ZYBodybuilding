'use client';

import { usePathname } from 'next/navigation';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  
  // Don't show public navbar/footer on admin, dashboard, or membership-expired routes
  const isAdminRoute = pathname.startsWith('/admin');
  const isDashboardRoute = pathname.startsWith('/dashboard');
  const isMembershipExpiredRoute = pathname.startsWith('/membership-expired');
  const isResetPasswordRoute = pathname.startsWith('/reset-password');

  if (isAdminRoute || isDashboardRoute || isMembershipExpiredRoute || isResetPasswordRoute) {
    return children;
  }

  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
