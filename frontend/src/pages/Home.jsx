import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag, Eye, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { productService } from '../services/product.service';
import apiClient from '../services/api';

const Home = () => {
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadHomepageData = async () => {
    setLoading(true);
    try {
      // Fetch banners
      const bannerRes = await apiClient.get('/banners');
      if (bannerRes.data?.success) setBanners(bannerRes.data.data);

      // Fetch categories
      const catRes = await apiClient.get('/categories');
      if (catRes.data?.success) setCategories(catRes.data.data);

      // Fetch featured products
      const featuredRes = await productService.getFeatured();
      if (featuredRes.success) setFeaturedProducts(featuredRes.data);
    } catch (err) {
      console.error('Error loading homepage integrations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHomepageData();
  }, []);

  const heroBanner = banners[0] || {
    title: "Elegance Reimagined",
    subtitle: "New Collection 2026 — Soft Luxury & Editorial Outfits",
    desktopImageUrl: "https://res.cloudinary.com/dqcxekzxn/image/upload/v1780155306/WhatsApp_Image_2026-05-29_at_10.06.09_AM_hexvgh.jpg",
    redirectUrl: "/shop"
  };

  return (
    <div className="w-full bg-white">
      {/* Dynamic Hero Section */}
      <section className="relative h-[85vh] w-full flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-primary/20 z-10" />
          <img
            src={heroBanner.desktopImageUrl}
            alt={heroBanner.title}
            className="w-full h-full object-cover transform scale-102 hover:scale-100 transition-transform duration-[4000ms]"
          />
        </div>
        
        <div className="container mx-auto px-4 z-10 text-center flex flex-col items-center">
          <motion.span 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-gold tracking-widest uppercase text-xs font-semibold mb-3 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20"
          >
            New Season 2026
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-7xl font-heading font-bold text-white mb-6 max-w-4xl leading-tight shadow-sm"
          >
            {heroBanner.title}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-sm sm:text-base text-cream/90 mb-10 max-w-xl font-light shadow-sm"
          >
            {heroBanner.subtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Link to={heroBanner.redirectUrl || "/shop"} className="btn-primary inline-flex items-center gap-2 px-8 py-3.5 bg-white text-primary border border-white hover:bg-transparent hover:text-white transition-all shadow-premium">
              Shop The Look <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Categories Grid */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <span className="text-gold uppercase tracking-widest text-[10px] font-bold">Categories</span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mt-1">Shop by Department</h2>
            <div className="w-12 h-[2px] bg-gold mx-auto mt-4"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, idx) => (
              <div 
                key={cat.id || idx}
                className="group relative overflow-hidden bg-cream rounded shadow-sm aspect-[4/5] border border-cream/20 flex flex-col justify-end p-6"
              >
                <div className="absolute inset-0 bg-primary/20 z-10 transition-colors group-hover:bg-primary/35 duration-300" />
                <img
                  src={cat.imageUrl}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="relative z-20 text-white">
                  <h3 className="font-heading font-bold text-lg">{cat.name}</h3>
                  <Link 
                    to={`/shop?category=${cat.slug}`}
                    className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest mt-2 border-b border-white hover:text-gold hover:border-gold transition-colors pb-0.5"
                  >
                    View pieces &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="py-24 bg-cream/15 border-t border-b border-cream/30">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <span className="text-gold uppercase tracking-widest text-[10px] font-bold">Atelier Curations</span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mt-1">Featured Essentials</h2>
            <div className="w-12 h-[2px] bg-gold mx-auto mt-4"></div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.slice(0, 4).map((p) => {
                const primaryImage = p.images?.[0]?.imageUrl || p.primaryImage || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=400';
                return (
                  <div key={p.id} className="premium-card group bg-white border border-cream/50 rounded overflow-hidden shadow-premium hover:shadow-premium-hover transition-all duration-300 relative">
                    <div className="aspect-[3/4] bg-cream/20 overflow-hidden relative">
                      <img src={primaryImage} alt={p.name} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-primary/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                        <Link to={`/product/${p.slug}`} className="bg-white text-primary p-2.5 rounded-full shadow hover:bg-gold hover:text-white transition-colors">
                          <Eye size={16} />
                        </Link>
                      </div>
                    </div>
                    <div className="p-4">
                      <span className="text-[9px] text-gold uppercase tracking-widest font-semibold">{p.collectionType || 'Luxury Pieces'}</span>
                      <h3 className="font-heading font-bold text-primary text-sm truncate mt-0.5">{p.name}</h3>
                      <div className="flex justify-between items-center mt-3">
                        <span className="font-bold text-primary text-xs">₹{p.price}</span>
                        <Link to={`/product/${p.slug}`} className="text-[10px] font-bold text-gold hover:underline">
                          View details
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Brand Value Section */}
      <section className="py-24 bg-white text-center">
        <div className="container mx-auto px-4 max-w-3xl">
          <span className="text-gold tracking-widest uppercase text-xs font-semibold">Our Philosophy</span>
          <h2 className="text-3xl font-heading font-bold text-primary mt-2 mb-6">Pinterest Inspired. ZARA Refined.</h2>
          <p className="text-sm text-dark/70 font-light leading-relaxed mb-8">
            Veloura is a women's fashion house crafting soft premium garments and accessories that reflect high-editorial romance, relaxed tailoring, and minimalist wear. Every piece is constructed with lightweight linens, liquid-like satins, and organic knits.
          </p>
          <div className="flex justify-center gap-6">
            <Link to="/shop" className="btn-primary">Shop The Atelier</Link>
            <Link to="/collections" className="py-2.5 px-6 border border-cream hover:border-gold hover:text-gold text-xs font-semibold rounded transition-colors text-primary bg-white">Lookbook</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
