import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, User, Settings, Package, Heart } from 'lucide-react';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-heading font-bold text-primary mb-8">My Account</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="md:col-span-1">
              <div className="bg-cream/30 p-6 shadow-sm border border-cream h-full">
                <div className="flex items-center space-x-4 mb-8 pb-6 border-b border-cream">
                  <div className="h-12 w-12 bg-primary text-white rounded-full flex items-center justify-center font-heading font-bold text-xl">
                    {user.firstName?.charAt(0) || 'V'}
                  </div>
                  <div>
                    <h2 className="text-lg font-heading font-bold text-primary">{user.firstName} {user.lastName}</h2>
                    <p className="text-xs text-dark/60">{user.email}</p>
                  </div>
                </div>

                <nav className="space-y-2">
                  <Link to="/profile" className="flex items-center space-x-3 w-full p-3 bg-white text-gold font-medium shadow-sm transition-all border-l-2 border-gold">
                    <User size={18} />
                    <span>Profile Details</span>
                  </Link>
                  <Link to="/orders" className="flex items-center space-x-3 w-full p-3 text-dark/70 hover:text-gold hover:bg-white transition-all">
                    <Package size={18} />
                    <span>My Orders</span>
                  </Link>
                  <Link to="/wishlist" className="flex items-center space-x-3 w-full p-3 text-dark/70 hover:text-gold hover:bg-white transition-all">
                    <Heart size={18} />
                    <span>Wishlist</span>
                  </Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="flex items-center space-x-3 w-full p-3 text-dark/70 hover:text-primary hover:bg-white transition-all">
                      <Settings size={18} />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}
                  <button 
                    onClick={handleLogout}
                    className="flex items-center space-x-3 w-full p-3 text-error hover:bg-red-50 transition-all mt-8 border-t border-cream"
                  >
                    <LogOut size={18} />
                    <span>Sign Out</span>
                  </button>
                </nav>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="md:col-span-3">
              <div className="bg-white p-8 shadow-premium border border-cream">
                <h2 className="text-xl font-heading font-bold text-primary mb-6">Account Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-dark/70 mb-1">First Name</label>
                    <div className="p-3 bg-cream/30 border border-cream text-dark">
                      {user.firstName || 'Not provided'}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-dark/70 mb-1">Last Name</label>
                    <div className="p-3 bg-cream/30 border border-cream text-dark">
                      {user.lastName || 'Not provided'}
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-dark/70 mb-1">Email Address</label>
                    <div className="p-3 bg-cream/30 border border-cream text-dark flex justify-between items-center">
                      <span>{user.email}</span>
                      <span className="text-xs bg-success/10 text-success px-2 py-1 rounded">Verified</span>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-dark/70 mb-1">Password</label>
                    <div className="p-3 bg-cream/30 border border-cream text-dark flex justify-between items-center">
                      <span>••••••••••••</span>
                      <button className="text-gold text-sm hover:underline font-medium">Change Password</button>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-cream">
                  <button className="btn-primary w-full sm:w-auto">
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
