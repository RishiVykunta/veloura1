import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, Eye, ArrowLeft } from 'lucide-react';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('veloura_wishlist') || '[]');
    setWishlist(items);
  }, []);

  const removeWish = (slug) => {
    const updated = wishlist.filter(item => item.slug !== slug);
    setWishlist(updated);
    localStorage.setItem('veloura_wishlist', JSON.stringify(updated));
  };

  return (
    <div className="bg-white min-h-screen py-16 px-4 md:px-8">
      <div className="container mx-auto max-w-5xl">
        <h1 className="text-3xl font-heading font-bold text-primary mb-10 text-center">Your Wishlist</h1>

        {wishlist.length === 0 ? (
          <div className="text-center py-20 bg-cream/15 border border-cream/50 rounded flex flex-col items-center">
            <Heart size={48} className="text-gold mb-4" />
            <h2 className="text-lg font-heading font-bold text-primary mb-2">No Saved Items</h2>
            <p className="text-xs text-dark/60 mb-8 max-w-xs">Heart your favorite pieces to save them for later.</p>
            <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
              <ArrowLeft size={16} /> Explore Shop
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlist.map((item) => (
              <div 
                key={item.id}
                className="border border-cream/50 rounded overflow-hidden bg-white hover:shadow-premium transition-shadow group relative"
              >
                <div className="aspect-[3/4] bg-cream/20 overflow-hidden relative">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  
                  {/* Actions overlay */}
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                    <Link
                      to={`/product/${item.slug}`}
                      className="bg-white text-primary p-2 rounded-full hover:bg-gold hover:text-white transition-colors"
                      title="View Details"
                    >
                      <Eye size={14} />
                    </Link>
                    <button
                      onClick={() => removeWish(item.slug)}
                      className="bg-white text-red-500 p-2 rounded-full hover:bg-red-500 hover:text-white transition-colors"
                      title="Remove"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  <Link to={`/product/${item.slug}`}>
                    <h3 className="font-heading font-bold text-primary text-sm truncate hover:text-gold transition-colors">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="font-bold text-primary text-xs mt-2">₹{item.price}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
