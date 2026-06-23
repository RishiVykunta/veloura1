import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, ShoppingBag, Users, Ticket, 
  Star, Image as ImageIcon, BarChart2, Bell, 
  Settings, LogOut, Package, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const menuItems = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { name: 'Products', path: '/admin/products', icon: Package },
  { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
  { name: 'Customers', path: '/admin/customers', icon: Users },
];

const Sidebar = ({ isOpen, setIsOpen, isMobile }) => {
  const content = (
    <div className="h-full flex flex-col bg-white border-r border-cream shadow-premium">
      <div className="p-6 flex justify-between items-center border-b border-cream">
        <span className="text-2xl font-heading font-bold text-primary tracking-wide">
          <span className="text-gold">V</span>eloura Admin
        </span>
        {isMobile && (
          <button onClick={() => setIsOpen(false)} className="text-dark p-1 rounded-full hover:bg-cream">
            <X size={20} />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/admin'}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300 ${
                isActive
                  ? 'bg-primary text-white shadow-md'
                  : 'text-dark/70 hover:bg-cream hover:text-primary'
              }`
            }
            onClick={() => isMobile && setIsOpen(false)}
          >
            <item.icon size={18} className="mr-3" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-cream">
        <button className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-500 rounded-lg hover:bg-red-50 transition-colors">
          <LogOut size={18} className="mr-3" />
          Logout
        </button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-[280px] z-50 bg-white"
            >
              {content}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  return (
    <div className="hidden lg:block w-[280px] h-screen sticky top-0">
      {content}
    </div>
  );
};

export default Sidebar;
