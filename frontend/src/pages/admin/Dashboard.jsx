import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../services/api';
import { productService } from '../../services/product.service';
import { orderService } from '../../services/order.service';

const AdminDashboard = () => {
  const [usersCount, setUsersCount] = useState(0);
  const [productsCount, setProductsCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [avgOrderValue, setAvgOrderValue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        // Fetch users
        const usersRes = await apiClient.get('/users/admin');
        const usersData = usersRes.data?.data || [];
        setUsersCount(usersData.length);

        // Fetch products
        const productsRes = await productService.getProducts();
        const productsData = productsRes.success ? (productsRes.data?.products || productsRes.data || []) : (productsRes.data || []);
        setProductsCount(productsData.length);

        // Fetch orders
        const ordersRes = await orderService.getAllOrders();
        const ordersData = ordersRes.success ? (ordersRes.data || []) : [];
        setOrdersCount(ordersData.length);

        // Calculate revenue & average order value
        let revenue = 0;
        ordersData.forEach(o => {
          if (o.orderStatus !== 'cancelled' && o.paymentStatus === 'paid') {
            revenue += parseFloat(o.totalAmount) || 0;
          }
        });
        setTotalRevenue(revenue);
        
        const paidOrders = ordersData.filter(o => o.orderStatus !== 'cancelled' && o.paymentStatus === 'paid');
        const avg = paidOrders.length > 0 ? (revenue / paidOrders.length) : 0;
        setAvgOrderValue(avg);

      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const stats = [
    { title: 'Total Users', value: loading ? '...' : usersCount.toString() },
    { title: 'Total Products', value: loading ? '...' : productsCount.toString() },
    { title: 'Total Orders', value: loading ? '...' : ordersCount.toString() },
    { title: 'Total Revenue', value: loading ? '...' : `₹${totalRevenue.toFixed(2)}` },
    { title: 'Average Order Value', value: loading ? '...' : `₹${avgOrderValue.toFixed(2)}` },
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
