import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from '../components/admin/Sidebar';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    
    // Initial check
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-screen bg-[#F8F5EE] overflow-hidden font-body">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} isMobile={isMobile} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Admin Header (Mobile only) */}
        {isMobile && (
          <header className="bg-white shadow-sm border-b border-cream h-16 flex items-center px-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-2 mr-2 rounded-md hover:bg-cream text-primary"
            >
              <Menu size={24} />
            </button>
            <span className="text-xl font-heading font-bold text-primary">Veloura Admin</span>
          </header>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#F8F5EE] p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
