import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const AppLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();

  // Auto-collapse sidebar on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarCollapsed(true);
      } else {
        setIsSidebarCollapsed(false);
      }
    };

    // Set initial state
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Set header title based on route
  const getHeaderInfo = () => {
    const path = location.pathname;
    if (path === '/') return { title: 'Dashboard', subtitle: 'Overview of compliance metrics' };
    if (path.startsWith('/scan')) return { title: 'Scan Product', subtitle: 'Upload product label for compliance check' };
    if (path === '/products') return { title: 'Product History', subtitle: 'View previously scanned products' };
    if (path.startsWith('/products/')) return { title: 'Compliance Report', subtitle: 'Detailed verification report' };
    if (path === '/analytics') return { title: 'Analytics', subtitle: 'Compliance trends and violation stats' };
    return { title: 'NyayaTula', subtitle: '' };
  };

  const headerInfo = getHeaderInfo();

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans">
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
      />
      
      <div 
        id="main-content"
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'sm:ml-20' : 'sm:ml-64'
        }`}
      >
        <Header 
          title={headerInfo.title} 
          subtitle={headerInfo.subtitle}
          toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
        />
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
