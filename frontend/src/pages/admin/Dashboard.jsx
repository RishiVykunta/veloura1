import React from 'react';
import { motion } from 'framer-motion';
import { IndianRupee, ShoppingBag, Users, TrendingUp, Package } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', revenue: 4000 },
  { name: 'Feb', revenue: 3000 },
  { name: 'Mar', revenue: 5000 },
  { name: 'Apr', revenue: 4500 },
  { name: 'May', revenue: 6000 },
  { name: 'Jun', revenue: 8000 },
];

const StatCard = ({ title, value, icon: Icon, trend, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className="bg-white p-6 rounded-2xl shadow-premium border border-cream"
  >
    <div className="flex justify-between items-start">
      <div>
        <p className="text-dark/60 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-primary">{value}</h3>
      </div>
      <div className="p-3 bg-cream rounded-xl text-primary">
        <Icon size={24} />
      </div>
    </div>
    <div className="mt-4 flex items-center text-sm">
      <TrendingUp size={16} className="text-emerald-500 mr-1" />
      <span className="text-emerald-500 font-medium mr-2">{trend}</span>
      <span className="text-dark/40">vs last month</span>
    </div>
  </motion.div>
);

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-heading font-bold text-primary">Dashboard Overview</h1>
        <button className="btn-primary flex items-center gap-2">
          <Package size={18} /> Add Product
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value="₹45,231" icon={IndianRupee} trend="+12.5%" delay={0.1} />
        <StatCard title="Total Orders" value="342" icon={ShoppingBag} trend="+8.2%" delay={0.2} />
        <StatCard title="Total Customers" value="1,204" icon={Users} trend="+15.3%" delay={0.3} />
        <StatCard title="Conversion Rate" value="3.2%" icon={TrendingUp} trend="+1.1%" delay={0.4} />
      </div>

      {/* Charts Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="bg-white p-6 rounded-2xl shadow-premium border border-cream h-[400px]"
      >
        <h3 className="text-lg font-heading font-bold text-primary mb-6">Revenue Analytics</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F8F5EE" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#1E1E1E', opacity: 0.6 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#1E1E1E', opacity: 0.6 }} tickFormatter={(val) => `₹${val}`} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px -10px rgba(11, 31, 58, 0.1)' }}
            />
            <Line type="monotone" dataKey="revenue" stroke="#D4AF37" strokeWidth={3} dot={{ r: 4, fill: '#0B1F3A', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#D4AF37' }} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
