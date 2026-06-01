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
  const [newArrivals, setNewArrivals] = useState([]);
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

      // Fetch new arrivals
      const newArrRes = await productService.getNewArrivals();
      if (newArrRes.success) setNewArrivals(newArrRes.data);
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
      {/* Desktop Hero Section */}
      <section className="hidden md:flex relative h-[85vh] w-full items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-primary/20 z-10" />
          <img
            src={heroBanner.desktopImageUrl}
            alt={heroBanner.title}
            className="w-full h-full object-cover object-center transform scale-102 hover:scale-100 transition-transform duration-[4000ms]"
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
            className="text-7xl font-heading font-bold text-white mb-6 max-w-4xl leading-tight shadow-sm"
          >
            {heroBanner.title}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-base text-cream/90 mb-10 max-w-xl font-light shadow-sm"
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

      {/* Mobile Hero Section */}
      <section className="flex md:hidden relative h-[75vh] w-full items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/50 z-10" />
          <img
            src={heroBanner.desktopImageUrl}
            alt={heroBanner.title}
            className="w-full h-full object-cover object-[center_top] transform scale-102"
          />
        </div>
        
        <div className="container mx-auto px-6 z-10 text-center flex flex-col items-center mt-8">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-gold tracking-widest uppercase text-[9px] font-semibold mb-4 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20 shadow-md"
          >
            New Season 2026
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl leading-[1.2] font-heading font-bold text-white mb-4 drop-shadow-2xl"
          >
            {heroBanner.title}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm text-cream/95 mb-8 font-light drop-shadow-md leading-relaxed px-2"
          >
            {heroBanner.subtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link to={heroBanner.redirectUrl || "/shop"} className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary text-sm font-semibold border border-white rounded shadow-xl">
              Shop The Look <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* New Arrivals Grid */}
      <section className="py-12 md:py-24 bg-white">
        <div className="container mx-auto px-3 md:px-8">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-heading font-bold text-primary mt-1">New Arrivals</h2>
            <div className="w-10 h-[2px] bg-gold mx-auto mt-3"></div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
              {newArrivals.slice(0, 4).map((p) => {
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
                      <span className="text-[9px] text-gold uppercase tracking-widest font-semibold">{p.collectionType || 'New Arrival'}</span>
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

      {/* Shop by Category Interactive Section */}
      <section className="py-12 md:py-24 bg-cream/10 border-t border-cream/30">
        <div className="container mx-auto px-3 md:px-8">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-heading font-bold text-primary mt-1">Shop by Category</h2>
            <div className="w-10 h-[2px] bg-gold mx-auto mt-3"></div>
          </div>
          
          {/* Desktop layout */}
          <div className="hidden md:grid md:grid-cols-2 gap-4 h-[600px]">
            <Link to="/shop?category=sharara" className="group relative overflow-hidden bg-cream rounded shadow-sm row-span-2">
              <div className="absolute inset-0 bg-primary/20 z-10 transition-colors group-hover:bg-primary/40 duration-500" />
              <img src="https://res.cloudinary.com/dqcxekzxn/image/upload/v1780328123/Blue_Sharara_Suit_for_Girls___Elegant_Ethnic_Look_for_Functions_uttyeg.jpg" alt="Sharara" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms] ease-out" />
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <h3 className="font-heading font-bold text-4xl mb-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">Sharara</h3>
                <span className="text-sm uppercase tracking-widest border-b border-gold text-gold font-semibold">Explore</span>
              </div>
              <div className="absolute bottom-6 left-6 z-20 group-hover:opacity-0 transition-opacity duration-500">
                <h3 className="font-heading font-bold text-3xl text-white drop-shadow-md">Sharara</h3>
              </div>
            </Link>
            <Link to="/shop?category=tops" className="group relative overflow-hidden bg-cream rounded shadow-sm">
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
            <div className="grid grid-cols-2 gap-4">
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

          {/* Mobile layout - bento-box matching desktop style */}
          <div className="md:hidden grid grid-cols-2 gap-2 h-[420px]">
            {/* Large left card - Sharara spans full height */}
            <Link to="/shop?category=sharara" className="group relative overflow-hidden bg-cream rounded-lg shadow-sm row-span-2">
              <div className="absolute inset-0 bg-primary/20 z-10 transition-colors group-hover:bg-primary/40 duration-500" />
              <img src="https://res.cloudinary.com/dqcxekzxn/image/upload/v1780328123/Blue_Sharara_Suit_for_Girls___Elegant_Ethnic_Look_for_Functions_uttyeg.jpg" alt="Sharara" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute bottom-4 left-3 z-20">
                <h3 className="font-heading font-bold text-xl text-white drop-shadow-md">Sharara</h3>
                <span className="text-[9px] text-gold font-semibold uppercase tracking-wider">Explore →</span>
              </div>
            </Link>

            {/* Right column - Tops on top */}
            <Link to="/shop?category=tops" className="group relative overflow-hidden bg-cream rounded-lg shadow-sm">
              <div className="absolute inset-0 bg-primary/20 z-10 transition-colors group-hover:bg-primary/40 duration-500" />
              <img src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=600" alt="Tops" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute bottom-3 left-3 z-20">
                <h3 className="font-heading font-bold text-base text-white drop-shadow-md">Tops</h3>
              </div>
            </Link>

            {/* Right column bottom - Anarkali & Short Kurtha side by side */}
            <div className="grid grid-cols-2 gap-2">
              <Link to="/shop?category=anarkali" className="group relative overflow-hidden bg-cream rounded-lg shadow-sm">
                <div className="absolute inset-0 bg-primary/20 z-10 transition-colors group-hover:bg-primary/40 duration-500" />
                <img src="https://images.unsplash.com/photo-1583391733959-f18305540a97?q=80&w=400" alt="Anarkali" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute bottom-2 left-2 z-20">
                  <h3 className="font-heading font-bold text-xs text-white drop-shadow-md">Anarkali</h3>
                </div>
              </Link>
              <Link to="/shop?category=short-kurtha" className="group relative overflow-hidden bg-cream rounded-lg shadow-sm">
                <div className="absolute inset-0 bg-primary/20 z-10 transition-colors group-hover:bg-primary/40 duration-500" />
                <img src="https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?q=80&w=400" alt="Short Kurtha" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute bottom-2 left-2 z-20">
                  <h3 className="font-heading font-bold text-xs text-white drop-shadow-md">Short Kurtha</h3>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="py-12 md:py-24 bg-cream/15 border-t border-b border-cream/30">
        <div className="container mx-auto px-3 md:px-8">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-heading font-bold text-primary mt-1">Featured Products</h2>
            <div className="w-10 h-[2px] bg-gold mx-auto mt-3"></div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
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

      {/* Our Story Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            
            {/* Image Side */}
            <div className="w-full lg:w-5/12 flex justify-center lg:justify-end">
              <div className="relative">
                {/* Decorative background element */}
                <div className="absolute inset-0 bg-cream/50 rounded-full scale-105 -z-10 translate-x-3 translate-y-3"></div>
                
                <img 
                  src="https://res.cloudinary.com/dqcxekzxn/image/upload/v1780327584/WhatsApp_Image_2026-06-01_at_8.55.40_PM_ugebec.jpg" 
                  alt="Veloura Founders" 
                  className="w-[280px] h-[280px] md:w-[400px] md:h-[400px] object-cover rounded-full border-[10px] border-white shadow-2xl"
                />
              </div>
            </div>

            {/* Text Side */}
            <div className="w-full lg:w-7/12 lg:pl-8">
              <span className="text-gold tracking-widest uppercase text-xs font-bold border-b border-gold pb-1">About Veloura</span>
              <h2 className="text-3xl md:text-4xl lg:text-[42px] font-heading font-bold text-primary mt-5 mb-8 leading-[1.2]">
                Empowering Women Through Style, Elegance & Confidence
              </h2>
              
              <div className="space-y-6 text-dark/75 font-light leading-relaxed text-[15px] md:text-base max-w-2xl">
                <p>
                  Veloura is a women's fashion brand founded by Yashvi and Prathiksha with a vision to bring together elegance, quality, and affordability in ethnic fashion. What began as a shared passion for style and entrepreneurship has grown into an online destination for women seeking fashionable and comfortable Indian wear.
                </p>
                <p>
                  At Veloura, we specialize in thoughtfully curated collections including shararas, anarkalis, tops, short kurtas, and other contemporary ethnic wear. Every piece is selected with attention to quality, design, and comfort, ensuring that our customers can express their individuality with confidence.
                </p>
                <p>
                  As a women-led brand, we understand the importance of fashion that not only follows trends but also celebrates personal style. Our goal is to make premium-looking ethnic wear accessible to every woman without compromising on quality or affordability.
                </p>
                <p className="font-medium text-primary text-lg mt-8 mb-6 italic">
                  "At Veloura, fashion is more than clothing—it's confidence, self-expression, and the freedom to embrace your unique identity."
                </p>
                <div className="pt-6 mt-4 border-t border-cream/50">
                  <p className="font-heading font-bold text-xl text-gold">
                    Veloura <span className="font-normal text-dark/40 mx-2">|</span> <span className="font-light italic text-primary">Timeless Elegance, Modern Confidence.</span>
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
