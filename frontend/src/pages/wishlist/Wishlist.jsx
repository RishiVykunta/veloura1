import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, Eye, ArrowLeft, Loader2 } from 'lucide-react';
import { productService } from '../../services/product.service';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load wishlist keys from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('veloura_wishlist') || '[]');
    setWishlistItems(stored);
  }, []);

  // When wishlist items are loaded, fetch live product data from API
  useEffect(() => {
    if (wishlistItems.length === 0) {
      setLoading(false);
      setProducts([]);
      return;
    }

    const fetchProducts = async () => {
      setLoading(true);
      const results = await Promise.allSettled(
        wishlistItems.map(item =>
          item.slug
            ? productService.getProductBySlug(item.slug).catch(() => null)
            : Promise.resolve(null)
        )
      );

      const liveProducts = [];
      const validSlugs = [];

      results.forEach((res, idx) => {
        const slug = wishlistItems[idx]?.slug;
        // Only include if the API confirms the product exists
        if (res.status === 'fulfilled' && res.value?.success && res.value?.data) {
          liveProducts.push(res.value.data);
          if (slug) validSlugs.push(slug);
        }
        // If API failed (not 404 - network error), keep the localStorage copy as fallback
        else if (res.status === 'rejected' && slug) {
          const fallback = wishlistItems[idx];
          if (fallback?.name) {
            liveProducts.push({
              id: fallback.id,
              name: fallback.name,
              slug: fallback.slug,
              price: fallback.price,
              primaryImage: fallback.image,
              images: fallback.image ? [{ imageUrl: fallback.image }] : []
            });
            validSlugs.push(slug);
          }
        }
        // If res.value?.success is false → product deleted → skip it (clean up)
      });

      // Clean up localStorage: remove items whose products no longer exist
      const cleanedWishlist = wishlistItems.filter(item => validSlugs.includes(item.slug));
      if (cleanedWishlist.length !== wishlistItems.length) {
        localStorage.setItem('veloura_wishlist', JSON.stringify(cleanedWishlist));
      }

      setProducts(liveProducts);
      setLoading(false);
    };

    fetchProducts();
  }, [wishlistItems]);

  const removeWish = (slug) => {
    const updated = wishlistItems.filter(item => item.slug !== slug);
    setWishlistItems(updated);
    localStorage.setItem('veloura_wishlist', JSON.stringify(updated));
    setProducts(prev => prev.filter(p => p.slug !== slug));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 size={32} className="animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-16 px-4 md:px-8">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-10">
          <span className="text-gold uppercase tracking-widest text-xs font-semibold">Your Saved Items</span>
          <h1 className="text-3xl font-heading font-bold text-primary mt-1">Wishlist</h1>
          <div className="w-12 h-[2px] bg-gold mx-auto mt-3" />
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 bg-cream/15 border border-cream/50 rounded flex flex-col items-center">
            <Heart size={48} className="text-gold mb-4" />
            <h2 className="text-lg font-heading font-bold text-primary mb-2">No Saved Items</h2>
            <p className="text-xs text-dark/60 mb-8 max-w-xs">Heart your favorite pieces to save them for later.</p>
            <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
              <ArrowLeft size={16} /> Explore Shop
            </Link>
          </div>
        ) : (
          <>
            <p className="text-xs text-dark/50 mb-6">{products.length} item{products.length !== 1 ? 's' : ''} saved</p>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((product) => {
                const primaryImage =
                  product.images?.[0]?.imageUrl ||
                  product.primaryImage ||
                  'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=400';
                const hasDiscount = product.discountPrice && product.discountPrice > 0;
                const displayPrice = hasDiscount ? product.discountPrice : product.price;

                return (
                  <div
                    key={product.id || product.slug}
                    className="border border-cream/50 rounded overflow-hidden bg-white hover:shadow-premium transition-all duration-300 group relative"
                  >
                    {/* Badges */}
                    <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                      {product.isNewArrival && (
                        <span className="bg-primary text-white text-[8px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded-sm">New</span>
                      )}
                      {hasDiscount && (
                        <span className="bg-gold text-white text-[8px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded-sm">Sale</span>
                      )}
                    </div>

                    <div className="aspect-[3/4] bg-cream/20 overflow-hidden relative">
                      <Link to={`/product/${product.slug}`} className="block w-full h-full">
                        <img
                          src={primaryImage}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </Link>

                      {/* Actions overlay */}
                      <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 pointer-events-none">
                        <Link
                          to={`/product/${product.slug}`}
                          className="bg-white text-primary p-2 rounded-full hover:bg-gold hover:text-white transition-colors shadow pointer-events-auto"
                          title="View Details"
                        >
                          <Eye size={14} />
                        </Link>
                        <button
                          onClick={() => removeWish(product.slug)}
                          className="bg-white text-red-500 p-2 rounded-full hover:bg-red-500 hover:text-white transition-colors shadow pointer-events-auto"
                          title="Remove from Wishlist"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="p-3 md:p-4">
                      <Link to={`/product/${product.slug}`}>
                        <h3 className="font-heading font-bold text-primary text-xs md:text-sm truncate hover:text-gold transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-2 mt-2">
                        <p className="font-bold text-primary text-xs">₹{displayPrice}</p>
                        {hasDiscount && (
                          <p className="text-[10px] text-dark/40 line-through">₹{product.price}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
