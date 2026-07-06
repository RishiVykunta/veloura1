import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, User, Settings, Heart, Key, Save, Edit, X, Loader2 } from 'lucide-react';
import { authService } from '../../services/auth.service';

const Profile = () => {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();

  // Profile Edit States
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [firstNameInput, setFirstNameInput] = useState('');
  const [lastNameInput, setLastNameInput] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  // Password Change States
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  // Alert States
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (user) {
      setFirstNameInput(user.firstName || '');
      setLastNameInput(user.lastName || '');
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!firstNameInput.trim()) {
      setErrorMsg('First Name cannot be empty');
      return;
    }

    setSavingProfile(true);
    try {
      const res = await authService.updateProfile({
        firstName: firstNameInput.trim(),
        lastName: lastNameInput.trim(),
      });
      if (res.success && res.user) {
        setUser(res.user);
        setSuccessMsg('Profile updated successfully!');
        setIsEditingProfile(false);
      } else {
        setErrorMsg(res.message || 'Profile update failed.');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Error updating profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setErrorMsg('Please fill in all password fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('New password and confirmation do not match');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters');
      return;
    }

    setSavingPassword(true);
    try {
      const res = await authService.changePassword({
        currentPassword,
        newPassword,
      });
      if (res.success) {
        setSuccessMsg('Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setIsChangingPassword(false);
      } else {
        setErrorMsg(res.message || 'Password update failed.');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Error updating password.');
    } finally {
      setSavingPassword(false);
    }
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
                  <div className="h-12 w-12 bg-primary text-white rounded-full flex items-center justify-center font-heading font-bold text-xl uppercase">
                    {user.firstName?.charAt(0) || 'V'}
                  </div>
                  <div>
                    <h2 className="text-lg font-heading font-bold text-primary truncate max-w-[150px]">
                      {user.firstName} {user.lastName}
                    </h2>
                    <p className="text-xs text-dark/60 truncate max-w-[150px]">{user.email}</p>
                  </div>
                </div>

                <nav className="space-y-2">
                  <Link to="/profile" className="flex items-center space-x-3 w-full p-3 bg-white text-gold font-medium shadow-sm transition-all border-l-2 border-gold">
                    <User size={18} />
                    <span>Profile Details</span>
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
              <div className="bg-white p-6 md:p-8 shadow-premium border border-cream space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-cream">
                  <h2 className="text-xl font-heading font-bold text-primary">Account Details</h2>
                  {!isEditingProfile && !isChangingPassword && (
                    <button 
                      onClick={() => setIsEditingProfile(true)}
                      className="text-gold hover:text-primary text-xs font-bold uppercase flex items-center gap-1 transition-colors"
                    >
                      <Edit size={14} /> Edit Profile
                    </button>
                  )}
                </div>

                {/* Alerts */}
                <AnimatePresence mode="wait">
                  {errorMsg && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-red-50 border-l-4 border-error p-4 text-xs text-error font-medium flex justify-between items-center"
                    >
                      <span>{errorMsg}</span>
                      <button onClick={() => setErrorMsg('')} className="text-error/70 hover:text-error"><X size={14} /></button>
                    </motion.div>
                  )}
                  {successMsg && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-green-50 border-l-4 border-success p-4 text-xs text-success font-medium flex justify-between items-center"
                    >
                      <span>{successMsg}</span>
                      <button onClick={() => setSuccessMsg('')} className="text-success/70 hover:text-success"><X size={14} /></button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Profile Details Form / Display */}
                {!isChangingPassword ? (
                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-primary uppercase mb-1">First Name</label>
                        {isEditingProfile ? (
                          <input 
                            type="text" 
                            value={firstNameInput}
                            onChange={(e) => setFirstNameInput(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold text-dark transition-all"
                            placeholder="Enter first name"
                            required
                          />
                        ) : (
                          <div className="p-3 bg-cream/35 border border-cream text-xs text-dark select-all">
                            {user.firstName || 'Not provided'}
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-xs font-bold text-primary uppercase mb-1">Last Name</label>
                        {isEditingProfile ? (
                          <input 
                            type="text" 
                            value={lastNameInput}
                            onChange={(e) => setLastNameInput(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold text-dark transition-all"
                            placeholder="Enter last name"
                          />
                        ) : (
                          <div className="p-3 bg-cream/35 border border-cream text-xs text-dark select-all">
                            {user.lastName || 'Not provided'}
                          </div>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-primary uppercase mb-1">Email Address</label>
                        <div className="p-3 bg-cream/35 border border-cream text-xs text-dark flex justify-between items-center select-all">
                          <span>{user.email}</span>
                          <span className="text-[9px] font-bold tracking-wider uppercase bg-success/10 text-success px-2 py-0.5 rounded-sm">Verified</span>
                        </div>
                      </div>

                      {!isEditingProfile && (
                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-primary uppercase mb-1">Password</label>
                          <div className="p-3 bg-cream/35 border border-cream text-xs text-dark flex justify-between items-center">
                            <span className="tracking-widest">••••••••••••</span>
                            <button 
                              type="button" 
                              onClick={() => {
                                setIsChangingPassword(true);
                                setErrorMsg('');
                                setSuccessMsg('');
                              }}
                              className="text-gold text-xs hover:underline font-bold uppercase flex items-center gap-1"
                            >
                              <Key size={13} /> Change Password
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {isEditingProfile && (
                      <div className="flex gap-3 pt-4 border-t border-cream">
                        <button 
                          type="submit" 
                          disabled={savingProfile}
                          className="btn-primary py-2 px-6 text-xs flex items-center gap-1.5"
                        >
                          {savingProfile ? (
                            <>
                              <Loader2 className="animate-spin" size={14} /> Saving...
                            </>
                          ) : (
                            <>
                              <Save size={14} /> Save Changes
                            </>
                          )}
                        </button>
                        <button 
                          type="button" 
                          onClick={() => {
                            setIsEditingProfile(false);
                            setFirstNameInput(user.firstName || '');
                            setLastNameInput(user.lastName || '');
                            setErrorMsg('');
                          }}
                          className="border border-cream text-dark/70 hover:bg-cream/20 py-2 px-6 text-xs font-semibold rounded transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </form>
                ) : (
                  /* Password Change Form */
                  <form onSubmit={handleChangePassword} className="space-y-6">
                    <h3 className="text-sm font-bold text-primary uppercase tracking-wider pb-2 border-b border-cream/50">Change Password</h3>
                    
                    <div className="space-y-4 max-w-md">
                      <div>
                        <label className="block text-xs font-bold text-primary uppercase mb-1">Current Password</label>
                        <input 
                          type="password" 
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold text-dark transition-all"
                          placeholder="••••••••"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-bold text-primary uppercase mb-1">New Password</label>
                        <input 
                          type="password" 
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold text-dark transition-all"
                          placeholder="••••••••"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-primary uppercase mb-1">Confirm New Password</label>
                        <input 
                          type="password" 
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold text-dark transition-all"
                          placeholder="••••••••"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-cream">
                      <button 
                        type="submit" 
                        disabled={savingPassword}
                        className="btn-primary py-2 px-6 text-xs flex items-center gap-1.5"
                      >
                        {savingPassword ? (
                          <>
                            <Loader2 className="animate-spin" size={14} /> Updating...
                          </>
                        ) : (
                          <>
                            <Save size={14} /> Update Password
                          </>
                        )}
                      </button>
                      <button 
                        type="button" 
                        onClick={() => {
                          setIsChangingPassword(false);
                          setCurrentPassword('');
                          setNewPassword('');
                          setConfirmPassword('');
                          setErrorMsg('');
                        }}
                        className="border border-cream text-dark/70 hover:bg-cream/20 py-2 px-6 text-xs font-semibold rounded transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
