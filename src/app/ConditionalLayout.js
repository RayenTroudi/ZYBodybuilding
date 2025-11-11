'use client';

import { usePathname } from 'next/navigation';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  
  // Don't show public navbar/footer on admin routes
  const isAdminRoute = pathname.startsWith('/admin');

  if (isAdminRoute) {
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
