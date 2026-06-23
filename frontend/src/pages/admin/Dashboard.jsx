import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const stats = [
    { title: 'Total Users', value: '4' },
    { title: 'Total Products', value: '5' },
    { title: 'Total Orders', value: '0' },
    { title: 'Total Revenue', value: '₹0.00' },
    { title: 'Average Order Value', value: '₹0.00' },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-heading font-bold text-[#1a1a1a]">Admin Dashboard</h1>

      <div className="flex flex-wrap gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-100 py-8 px-4 flex flex-col items-center justify-center flex-1 min-w-[150px]">
            <h3 className="text-[#555] font-heading text-[15px] mb-4 whitespace-nowrap">{stat.title}</h3>
            <p className="text-4xl font-bold text-[#CD9D29]">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-4">
        <Link to="/admin/products" className="bg-[#CD9D29] text-white px-6 py-2.5 rounded hover:bg-[#B58A24] transition-colors font-body font-medium text-sm">
          Manage Products
        </Link>
        <Link to="/admin/orders" className="bg-[#CD9D29] text-white px-6 py-2.5 rounded hover:bg-[#B58A24] transition-colors font-body font-medium text-sm">
          Manage Orders
        </Link>
        <Link to="/admin/customers" className="bg-[#CD9D29] text-white px-6 py-2.5 rounded hover:bg-[#B58A24] transition-colors font-body font-medium text-sm">
          Manage Users
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
