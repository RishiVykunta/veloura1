import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Eye } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { productService } from '../services/product.service';
import apiClient from '../services/api';

const ProductCard = ({ product }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const images = (product.images && product.images.length > 0)
    ? product.images.map(img => typeof img === 'string' ? img : (img.imageUrl || img))
    : [product.primaryImage || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=400'];

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % images.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="premium-card group bg-white border border-cream/50 rounded overflow-hidden shadow-premium hover:shadow-premium-hover transition-all duration-300 relative">
      <div className="aspect-[3/4] bg-cream/20 overflow-hidden relative">
        <img 
          src={images[currentIdx]} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-102 transition-all duration-500" 
        />
        <div className="absolute inset-0 bg-primary/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <Link to={`/product/${product.slug}`} className="bg-white text-primary p-2.5 rounded-full shadow hover:bg-gold hover:text-white transition-colors">
            <Eye size={16} />
          </Link>
        </div>
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-20">
            {images.map((_, i) => (
              <span 
                key={i} 
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === currentIdx ? 'bg-gold w-3' : 'bg-white/60'}`}
              />
            ))}
          </div>
        )}
      </div>
      <div className="p-4">
        <span className="text-[9px] text-gold uppercase tracking-widest font-semibold">{product.collectionType || 'Luxury Pieces'}</span>
        <h3 className="font-heading font-bold text-primary text-sm truncate mt-0.5">{product.name}</h3>
        <div className="flex justify-between items-center mt-3">
          <span className="font-bold text-primary text-xs">₹{product.price}</span>
          <Link to={`/product/${product.slug}`} className="text-[10px] font-bold text-gold hover:underline">
            View details
          </Link>
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  const location = useLocation();
  const [banners, setBanners] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadHomepageData = async () => {
    setLoading(true);
    try {
      // Fetch banners
      const bannerRes = await apiClient.get('/banners');
      if (bannerRes.data?.success) setBanners(bannerRes.data.data);

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

  useEffect(() => {
    if (!location.hash) return;

    const sectionId = location.hash.replace('#', '');
    const scrollTimer = window.setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 80);

    return () => window.clearTimeout(scrollTimer);
  }, [location.hash]);

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
      <section className="flex md:hidden relative w-full aspect-[1080/1212] items-center justify-center overflow-hidden">
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
      <section id="new-arrivals" className="py-12 md:py-24 bg-white scroll-mt-24">
        <div className="container mx-auto px-3 md:px-8">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-heading font-bold text-primary mt-1">New Arrivals</h2>
            <div className="w-10 h-[2px] bg-gold mx-auto mt-3"></div>
            <Link to="/shop?filter=new-arrivals" className="inline-flex items-center gap-1 mt-4 text-xs font-semibold text-gold hover:underline tracking-wide uppercase">
              See All <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
              {newArrivals.slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Shop by Category Interactive Section */}
      <section id="collections" className="py-12 md:py-20 bg-cream/10 border-t border-cream/30 scroll-mt-24">
        <div className="container mx-auto px-3 md:px-8">
          <div className="text-center mb-8 md:mb-10">
            <h2 className="text-2xl md:text-4xl font-heading font-bold text-primary mt-1">Shop by Category</h2>
            <div className="w-10 h-[2px] bg-gold mx-auto mt-3"></div>
          </div>
          {/* Desktop layout */}
          <div className="hidden md:grid md:grid-cols-[1.08fr_0.92fr] gap-4 lg:gap-6 max-w-[1320px] mx-auto items-start">
            {/* Left tall card */}
            <Link to="/shop?category=sharara" className="group relative overflow-hidden bg-cream rounded-2xl shadow-sm aspect-[4/5] lg:aspect-[3/4]">
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent z-10 transition-colors group-hover:from-black/75 duration-500" />
              <img src="https://res.cloudinary.com/dqcxekzxn/image/upload/v1780328123/Blue_Sharara_Suit_for_Girls___Elegant_Ethnic_Look_for_Functions_uttyeg.jpg" alt="Sharara" className="absolute inset-0 w-full h-full object-cover object-[center_28%] group-hover:scale-105 transition-transform duration-[2000ms] ease-out" />
              <div className="absolute bottom-6 left-6 right-6 z-20 flex items-center justify-between text-white">
                <h3 className="font-heading font-bold text-3xl lg:text-[42px] drop-shadow-lg">Sharara</h3>
                <span className="w-9 h-9 rounded-full border border-white/60 flex items-center justify-center bg-black/10 backdrop-blur-[2px]">
                  <ArrowRight size={16} className="text-white" />
                </span>
              </div>
            </Link>
            
            {/* Right side container */}
            <div className="grid gap-4 lg:gap-6">
              {/* Top wide card */}
              <Link to="/shop?category=tops" className="group relative overflow-hidden bg-cream rounded-2xl shadow-sm aspect-[16/7] lg:aspect-[16/6]">
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent z-10 transition-colors group-hover:from-black/70 duration-500" />
                <img src="https://res.cloudinary.com/dqcxekzxn/image/upload/v1780328447/download_wrtkxn.jpg" alt="Tops" className="absolute inset-0 w-full h-full object-cover object-[50%_15%] group-hover:scale-105 transition-transform duration-[2000ms] ease-out" />
                <div className="absolute bottom-5 left-6 z-20 flex items-center gap-4 text-white">
                  <h3 className="font-heading font-bold text-2xl lg:text-[38px] drop-shadow-lg">Tops</h3>
                  <span className="w-9 h-9 rounded-full border border-white/60 flex items-center justify-center bg-black/10 backdrop-blur-[2px]">
                    <ArrowRight size={16} className="text-white" />
                  </span>
                </div>
              </Link>

              {/* Bottom 2 squares */}
              <div className="grid grid-cols-2 gap-4 lg:gap-6">
                <Link to="/shop?category=anarkali" className="group relative overflow-hidden bg-cream rounded-2xl shadow-sm aspect-[4/3]">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/18 to-transparent z-10 transition-colors group-hover:from-black/70 duration-500" />
                  <img src="https://res.cloudinary.com/dqcxekzxn/image/upload/v1780328726/Teal_Elegance__The_Perfect_Festive_Anarkali_Gown_uyxrwo.jpg" alt="Anarkali" className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-[2000ms] ease-out" />
                  <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between text-white">
                    <h3 className="font-heading font-bold text-xl lg:text-[28px] drop-shadow-lg">Anarkali</h3>
                    <span className="w-8 h-8 rounded-full border border-white/60 flex items-center justify-center bg-black/10 backdrop-blur-[2px]">
                      <ArrowRight size={14} className="text-white" />
                    </span>
                  </div>
                </Link>

                <Link to="/shop?category=short-kurtha" className="group relative overflow-hidden bg-cream rounded-2xl shadow-sm aspect-[4/3]">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/18 to-transparent z-10 transition-colors group-hover:from-black/70 duration-500" />
                  <img src="https://res.cloudinary.com/dqcxekzxn/image/upload/v1780329369/download_1_gwrbim.jpg" alt="Short Kurtha" className="absolute inset-0 w-full h-full object-cover object-[center_72%] group-hover:scale-105 transition-transform duration-[2000ms] ease-out" />
                  <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between text-white">
                    <h3 className="font-heading font-bold text-xl lg:text-[28px] drop-shadow-lg">Short kurti</h3>
                    <span className="w-8 h-8 rounded-full border border-white/60 flex items-center justify-center bg-black/10 backdrop-blur-[2px]">
                      <ArrowRight size={14} className="text-white" />
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile layout - uniform 2x2 grid */}
          <div className="md:hidden grid grid-cols-2 gap-2 mt-4">
            <Link to="/shop?category=sharara" className="group relative overflow-hidden bg-cream rounded-lg shadow-sm aspect-[3/4]">
              <div className="absolute inset-0 bg-primary/20 z-10 transition-colors group-hover:bg-primary/40 duration-500" />
              <img src="https://res.cloudinary.com/dqcxekzxn/image/upload/v1780328123/Blue_Sharara_Suit_for_Girls___Elegant_Ethnic_Look_for_Functions_uttyeg.jpg" alt="Sharara" className="absolute inset-0 w-full h-full object-cover object-center" />
              <div className="absolute bottom-3 left-3 z-20">
                <h3 className="font-heading font-bold text-base text-white drop-shadow-md mb-2">Sharara</h3>
                <span className="bg-white text-primary text-[10px] font-bold rounded-full px-3 py-1 flex items-center gap-1 w-fit shadow-sm">Explore <ArrowRight size={10} /></span>
              </div>
            </Link>

            <Link to="/shop?category=tops" className="group relative overflow-hidden bg-cream rounded-lg shadow-sm aspect-[3/4]">
              <div className="absolute inset-0 bg-primary/20 z-10 transition-colors group-hover:bg-primary/40 duration-500" />
              <img src="https://res.cloudinary.com/dqcxekzxn/image/upload/v1780328447/download_wrtkxn.jpg" alt="Tops" className="absolute inset-0 w-full h-full object-cover object-center" />
              <div className="absolute bottom-3 left-3 z-20">
                <h3 className="font-heading font-bold text-base text-white drop-shadow-md mb-2">Tops</h3>
                <span className="bg-white text-primary text-[10px] font-bold rounded-full px-3 py-1 flex items-center gap-1 w-fit shadow-sm">Explore <ArrowRight size={10} /></span>
              </div>
            </Link>

            <Link to="/shop?category=anarkali" className="group relative overflow-hidden bg-cream rounded-lg shadow-sm aspect-[3/4]">
              <div className="absolute inset-0 bg-primary/20 z-10 transition-colors group-hover:bg-primary/40 duration-500" />
              <img src="https://res.cloudinary.com/dqcxekzxn/image/upload/v1780328726/Teal_Elegance__The_Perfect_Festive_Anarkali_Gown_uyxrwo.jpg" alt="Anarkali" className="absolute inset-0 w-full h-full object-cover object-center" />
              <div className="absolute bottom-3 left-3 z-20">
                <h3 className="font-heading font-bold text-base text-white drop-shadow-md mb-2">Anarkali</h3>
                <span className="bg-white text-primary text-[10px] font-bold rounded-full px-3 py-1 flex items-center gap-1 w-fit shadow-sm">Explore <ArrowRight size={10} /></span>
              </div>
            </Link>

            <Link to="/shop?category=short-kurtha" className="group relative overflow-hidden bg-cream rounded-lg shadow-sm aspect-[3/4]">
              <div className="absolute inset-0 bg-primary/20 z-10 transition-colors group-hover:bg-primary/40 duration-500" />
              <img src="https://res.cloudinary.com/dqcxekzxn/image/upload/v1780329369/download_1_gwrbim.jpg" alt="Short Kurtha" className="absolute inset-0 w-full h-full object-cover object-center" />
              <div className="absolute bottom-3 left-3 z-20">
                <h3 className="font-heading font-bold text-base text-white drop-shadow-md mb-2">Short Kurtha</h3>
                <span className="bg-white text-primary text-[10px] font-bold rounded-full px-3 py-1 flex items-center gap-1 w-fit shadow-sm">Explore <ArrowRight size={10} /></span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Grid */}
      <section id="shop" className="py-12 md:py-24 bg-cream/15 border-t border-b border-cream/30 scroll-mt-24">
        <div className="container mx-auto px-3 md:px-8">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mt-1">Featured Products</h2>
            <div className="w-10 h-[2px] bg-gold mx-auto mt-3"></div>
            <Link to="/shop?filter=featured" className="inline-flex items-center gap-1 mt-4 text-xs font-semibold text-gold hover:underline tracking-wide uppercase">
              See All <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
              {featuredProducts.slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Our Story Section */}
      <section id="about" className="py-24 bg-white relative overflow-hidden scroll-mt-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col items-center">
            {/* Text Side */}
            <div className="w-full max-w-4xl">
              <span className="text-gold tracking-widest uppercase text-xs font-bold border-b border-gold pb-1">About Veloura</span>
              <h2 className="text-3xl md:text-4xl lg:text-[42px] font-heading font-bold text-primary mt-5 mb-8 leading-[1.2]">
                Empowering Women Through Style, Elegance & Confidence
              </h2>
              
              <div className="space-y-6 text-dark/75 font-light leading-relaxed text-[15px] md:text-base">
                <p>
                  It started with a simple idea - to create clothing that feels as good as it looks. What began as a vision grew into something more meaningful - a space where style meets emotion, and fashion becomes a reflection of individuality. We believe clothing is not just about trends, but about how it makes you feel every day.
                </p>
                <p>
                  Every design is inspired by real moments - the confidence in simplicity, the joy of dressing up, and the comfort of being yourself. Our pieces are thoughtfully created to move with you, grow with you, and become a part of your journey, blending elegance, comfort, and effortless style.
                </p>
                <p>
                  At the heart of it all is the belief that fashion should fit into your life, not the other way around. Because what you wear isn't just clothing - it's how you express yourself and show up in the world.
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
