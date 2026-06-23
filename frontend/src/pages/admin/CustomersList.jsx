import React, { useState, useEffect } from 'react';
import { Users, Mail } from 'lucide-react';
import apiClient from '../../services/api';

const CustomersList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/users/admin');
      if (res.data?.success) {
        setCustomers(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-heading font-bold text-primary">Customers</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-cream overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37]" />
          </div>
        ) : customers.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center mb-4">
              <Users size={32} className="text-primary/40" />
            </div>
            <h3 className="text-lg font-heading font-bold text-primary mb-2">No customers found</h3>
            <p className="text-dark/60">No registered customers yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8F5EE] text-dark/70 text-sm border-b border-[#F8F5EE]">
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">Email</th>
                  <th className="p-4 font-medium">Role</th>
                  <th className="p-4 font-medium">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F8F5EE]">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-[#F8F5EE]/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-cream flex items-center justify-center text-primary font-bold text-sm uppercase">
                          {c.firstName ? c.firstName[0] : c.email[0]}
                        </div>
                        <span className="font-medium text-primary">
                          {c.firstName} {c.lastName}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-dark/70">
                      <div className="flex items-center gap-2">
                        <Mail size={14} className="text-dark/40" />
                        {c.email}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium uppercase ${c.role === 'admin' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
                        {c.role || 'customer'}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-dark/70">
                      {new Date(c.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
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

export default CustomersList;
