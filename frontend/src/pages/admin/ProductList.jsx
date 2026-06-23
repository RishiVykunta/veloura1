import React, { useState, useEffect } from 'react';
import { Package, Plus, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { productService } from '../../services/product.service';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await productService.getProducts();
      // Handle different possible API response structures
      let productsData = [];
      if (res.success) {
        productsData = res.data?.products || res.data || [];
      } else if (Array.isArray(res)) {
        productsData = res;
      } else if (res.data) {
        productsData = res.data.products || res.data || [];
      }
      setProducts(productsData);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-heading font-bold text-primary">Products</h1>
        <Link to="/admin/products/new" className="bg-[#D4AF37] text-white px-4 py-2 rounded-md hover:bg-[#C29F32] transition-colors flex items-center gap-2 text-sm font-medium">
          <Plus size={18} /> Add Product
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-cream overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37]" />
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center mb-4">
              <Package size={32} className="text-primary/40" />
            </div>
            <h3 className="text-lg font-heading font-bold text-primary mb-2">No products found</h3>
            <p className="text-dark/60">Get started by adding your first product.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8F5EE] text-dark/70 text-sm border-b border-[#F8F5EE]">
                  <th className="p-4 font-medium">Product</th>
                  <th className="p-4 font-medium">Category</th>
                  <th className="p-4 font-medium">Price</th>
                  <th className="p-4 font-medium">Stock</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F8F5EE]">
                {products.map((p) => {
                  const primaryImage = p.images?.[0]?.imageUrl || p.primaryImage || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=100';
                  return (
                    <tr key={p.id} className="hover:bg-[#F8F5EE]/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={primaryImage} alt={p.name} className="w-10 h-10 rounded object-cover border border-[#F8F5EE]" />
                          <span className="font-medium text-primary">{p.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-dark/70">{p.category || p.collectionType || '-'}</td>
                      <td className="p-4 font-medium text-primary">₹{p.price}</td>
                      <td className="p-4 text-sm text-dark/70">{p.stockQuantity !== undefined ? p.stockQuantity : (p.stock || 0)}</td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link to={`/admin/products/edit/${p.id}`} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors">
                            <Edit size={16} />
                          </Link>
                          <button className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
