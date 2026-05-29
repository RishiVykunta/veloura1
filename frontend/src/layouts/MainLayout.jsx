import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-[72px]">
        {/* pt-[72px] to account for sticky navbar height */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
