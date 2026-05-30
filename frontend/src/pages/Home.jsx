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
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mt-1">New Arrivals</h2>
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

      {/* Shop by Category Interactive Section */}
      <section className="py-24 bg-cream/10 border-t border-cream/30">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mt-1">Shop by Category</h2>
            <div className="w-12 h-[2px] bg-gold mx-auto mt-4"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-auto md:h-[600px]">
            {/* Large Category - Sharara */}
            <Link to="/shop?category=sharara" className="group relative overflow-hidden bg-cream rounded shadow-sm h-[400px] md:h-auto md:row-span-2">
              <div className="absolute inset-0 bg-primary/20 z-10 transition-colors group-hover:bg-primary/40 duration-500" />
              <img src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800" alt="Sharara" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms] ease-out" />
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <h3 className="font-heading font-bold text-4xl mb-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">Sharara</h3>
                <span className="text-sm uppercase tracking-widest border-b border-gold text-gold font-semibold">Explore</span>
              </div>
              <div className="absolute bottom-6 left-6 z-20 group-hover:opacity-0 transition-opacity duration-500">
                 <h3 className="font-heading font-bold text-3xl text-white drop-shadow-md">Sharara</h3>
              </div>
            </Link>

            {/* Top Right - Tops */}
            <Link to="/shop?category=tops" className="group relative overflow-hidden bg-cream rounded shadow-sm h-[300px] md:h-auto">
              <div className="absolute inset-0 bg-primary/20 z-10 transition-colors group-hover:bg-primary/40 duration-500" />
              <img src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800" alt="Tops" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms] ease-out" />
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <h3 className="font-heading font-bold text-3xl mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">Tops</h3>
                <span className="text-xs uppercase tracking-widest border-b border-gold text-gold font-semibold">Explore</span>
              </div>
              <div className="absolute bottom-6 left-6 z-20 group-hover:opacity-0 transition-opacity duration-500">
                 <h3 className="font-heading font-bold text-2xl text-white drop-shadow-md">Tops</h3>
              </div>
            </Link>

            {/* Bottom Right - 2 small ones */}
            <div className="grid grid-cols-2 gap-4 h-[300px] md:h-auto">
              <Link to="/shop?category=anarkali" className="group relative overflow-hidden bg-cream rounded shadow-sm">
                <div className="absolute inset-0 bg-primary/20 z-10 transition-colors group-hover:bg-primary/40 duration-500" />
                <img src="https://images.unsplash.com/photo-1583391733959-f18305540a97?q=80&w=800" alt="Anarkali" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms] ease-out" />
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <h3 className="font-heading font-bold text-2xl mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">Anarkali</h3>
                </div>
                <div className="absolute bottom-4 left-4 z-20 group-hover:opacity-0 transition-opacity duration-500">
                   <h3 className="font-heading font-bold text-xl text-white drop-shadow-md">Anarkali</h3>
                </div>
              </Link>
              
              <Link to="/shop?category=short-kurtha" className="group relative overflow-hidden bg-cream rounded shadow-sm">
                <div className="absolute inset-0 bg-primary/20 z-10 transition-colors group-hover:bg-primary/40 duration-500" />
                <img src="https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?q=80&w=800" alt="Short Kurtha" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms] ease-out" />
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <h3 className="font-heading font-bold text-2xl text-center mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">Short<br/>Kurtha</h3>
                </div>
                <div className="absolute bottom-4 left-4 z-20 group-hover:opacity-0 transition-opacity duration-500">
                   <h3 className="font-heading font-bold text-xl text-white drop-shadow-md">Short Kurtha</h3>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="py-24 bg-cream/15 border-t border-b border-cream/30">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mt-1">Featured Products</h2>
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
    </div>
  );
};

export default Home;
