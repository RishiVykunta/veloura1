import React, { useState, useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';
import { orderService } from '../../services/order.service';

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await orderService.getAllOrders();
      if (res.success) {
        setOrders(res.data);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await orderService.updateOrderStatus(orderId, newStatus);
      if (res.success) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, orderStatus: newStatus } : o));
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-heading font-bold text-primary">Orders</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-cream overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37]" />
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center mb-4">
              <ShoppingBag size={32} className="text-primary/40" />
            </div>
            <h3 className="text-lg font-heading font-bold text-primary mb-2">No orders found</h3>
            <p className="text-dark/60">No orders have been placed yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8F5EE] text-dark/70 text-sm border-b border-[#F8F5EE]">
                  <th className="p-4 font-medium">Order Number</th>
                  <th className="p-4 font-medium">Customer</th>
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium">Total</th>
                  <th className="p-4 font-medium">Payment</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F8F5EE]">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-[#F8F5EE]/50 transition-colors">
                    <td className="p-4 font-mono font-bold text-primary">
                      {o.orderNumber}
                    </td>
                    <td className="p-4">
                      <div className="text-sm">
                        <p className="font-medium text-primary">{o.userFirstName || 'Guest'}</p>
                        <p className="text-dark/50 text-xs">{o.userEmail || '-'}</p>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-dark/70">
                      {new Date(o.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="p-4 font-medium text-primary">₹{o.totalAmount}</td>
                    <td className="p-4 text-sm">
                      <p className="text-primary font-medium">{o.paymentMethod}</p>
                      <p className={`text-[10px] uppercase font-bold ${o.paymentStatus === 'paid' ? 'text-green-600' : 'text-amber-600'}`}>
                        {o.paymentStatus}
                      </p>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold uppercase ${
                        o.orderStatus === 'delivered' ? 'bg-green-50 text-green-700' :
                        o.orderStatus === 'shipped' ? 'bg-blue-50 text-blue-700' :
                        o.orderStatus === 'cancelled' ? 'bg-red-50 text-red-700' :
                        'bg-amber-50 text-amber-700'
                      }`}>
                        {o.orderStatus}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <select 
                        value={o.orderStatus || 'pending'} 
                        onChange={(e) => handleStatusChange(o.id, e.target.value)}
                        className="bg-cream/40 border border-cream hover:bg-cream transition-colors text-xs font-semibold text-primary py-1 px-2 rounded outline-none cursor-pointer"
                      >
                        <option value="pending">Pending</option>
                        <option value="packed">Packed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersList;
