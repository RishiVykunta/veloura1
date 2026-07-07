import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Heart, User, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { productService } from '../services/product.service';

const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-focus search input when overlay opens
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [searchOpen]);

  // Close search overlay on Escape press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setSearchQuery('');
      }
    };
    if (searchOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [searchOpen]);

  // Debounced live search suggestions fetching
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setLoadingSuggestions(true);
      try {
        const res = await productService.getProducts({ search: searchQuery.trim() });
        if (res.success && res.data) {
          setSuggestions(res.data.slice(0, 5));
        }
      } catch (err) {
        console.error('Error fetching search suggestions:', err);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const homeSectionLink = (sectionId) => `/#${sectionId}`;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b-4 border-primary bg-primary h-[72px] md:h-auto md:border-b-[3px] ${
          isScrolled ? 'shadow-premium md:py-3' : 'md:py-4'
        }`}
      >
        <div className="container mx-auto px-4 md:px-8 h-full flex items-center justify-between relative">
          {/* Left side: Mobile Menu Toggle + Account icon (mobile) / Logo (desktop) */}
          <div className="flex items-center gap-3">
            <button 
              className="md:hidden text-white hover:text-gold transition-colors"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            <Link to={user ? "/profile" : "/login"} className="md:hidden hover:text-gold transition-colors text-white">
              <User size={20} />
            </Link>
          </div>

          {/* Logo - centered on mobile, left-aligned on desktop */}
          <Link to="/" className="flex items-center md:static absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 md:translate-x-0 md:translate-y-0 md:top-auto">
            <img src="https://res.cloudinary.com/dqcxekzxn/image/upload/v1778683336/Screenshot_2026-05-13_194015_rtsdbz.png" alt="Veloura" className="h-8 md:h-11 w-auto object-contain rounded-sm shadow-sm" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to={homeSectionLink('new-arrivals')} className="text-white hover:text-gold transition-colors font-medium">New Arrivals</Link>
            <Link to={homeSectionLink('shop')} className="text-white hover:text-gold transition-colors font-medium">Shop</Link>
            <div className="group relative py-2">
              <Link to={homeSectionLink('collections')} className="text-white group-hover:text-gold transition-colors font-medium">Collections</Link>
              <div className="absolute top-full -left-4 w-48 bg-white border border-cream/50 shadow-premium rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 flex flex-col z-50 overflow-hidden transform translate-y-2 group-hover:translate-y-0">
                <Link to="/shop?category=sharara" className="px-5 py-3 text-sm font-medium text-dark hover:text-gold hover:bg-cream/20 transition-colors border-b border-cream/30">Sharara</Link>
                <Link to="/shop?category=tops" className="px-5 py-3 text-sm font-medium text-dark hover:text-gold hover:bg-cream/20 transition-colors border-b border-cream/30">Tops</Link>
                <Link to="/shop?category=short-kurti" className="px-5 py-3 text-sm font-medium text-dark hover:text-gold hover:bg-cream/20 transition-colors border-b border-cream/30">Short Kurti</Link>
                <Link to="/shop?category=long-kurti" className="px-5 py-3 text-sm font-medium text-dark hover:text-gold hover:bg-cream/20 transition-colors">Long Kurti</Link>
              </div>
            </div>
            <Link to={homeSectionLink('about')} className="text-white hover:text-gold transition-colors font-medium">About</Link>
          </nav>

          {/* Right side Icons */}
          <div className="flex items-center space-x-4 text-white">
            <button onClick={() => setSearchOpen(true)} className="hover:text-gold transition-colors" aria-label="Search">
              <Search size={20} />
            </button>
            <Link to={user ? "/profile" : "/login"} className="hidden md:block hover:text-gold transition-colors">
              <User size={20} />
            </Link>
            <Link to="/wishlist" className="hover:text-gold transition-colors">
              <Heart size={20} />
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 left-0 bottom-0 w-[280px] bg-white z-50 shadow-2xl flex flex-col md:hidden"
            >
              <div className="p-4 flex justify-between items-center border-b border-cream">
                <img src="https://res.cloudinary.com/dqcxekzxn/image/upload/v1778683336/Screenshot_2026-05-13_194015_rtsdbz.png" alt="Veloura" className="h-10 object-contain" />
                <button onClick={() => setMobileMenuOpen(false)} className="text-dark p-1">
                  <X size={24} />
                </button>
              </div>
              <div className="flex flex-col py-4 px-4 space-y-4 overflow-y-auto">
                <Link to={homeSectionLink('new-arrivals')} className="text-lg text-dark py-2 border-b border-cream" onClick={() => setMobileMenuOpen(false)}>New Arrivals</Link>
                <Link to={homeSectionLink('shop')} className="text-lg text-dark py-2 border-b border-cream" onClick={() => setMobileMenuOpen(false)}>Shop</Link>
                <div className="flex flex-col border-b border-cream py-2">
                  <Link to={homeSectionLink('collections')} className="text-lg text-dark mb-3" onClick={() => setMobileMenuOpen(false)}>Collections</Link>
                  <div className="flex flex-col pl-4 space-y-3 mb-2">
                    <Link to="/shop?category=sharara" className="text-dark/80 hover:text-gold text-base" onClick={() => setMobileMenuOpen(false)}>Sharara</Link>
                    <Link to="/shop?category=tops" className="text-dark/80 hover:text-gold text-base" onClick={() => setMobileMenuOpen(false)}>Tops</Link>
                    <Link to="/shop?category=short-kurti" className="text-dark/80 hover:text-gold text-base" onClick={() => setMobileMenuOpen(false)}>Short Kurti</Link>
                    <Link to="/shop?category=long-kurti" className="text-dark/80 hover:text-gold text-base" onClick={() => setMobileMenuOpen(false)}>Long Kurti</Link>
                  </div>
                </div>
                <Link to={homeSectionLink('about')} className="text-lg text-dark py-2 border-b border-cream" onClick={() => setMobileMenuOpen(false)}>About</Link>
                <Link to={user ? "/profile" : "/login"} className="text-lg text-dark py-2 border-b border-cream" onClick={() => setMobileMenuOpen(false)}>My Account</Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-primary/80 backdrop-blur-sm flex items-start justify-center pt-24 px-4"
            onClick={(e) => { if (e.target === e.currentTarget) { setSearchOpen(false); setSearchQuery(''); } }}
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-xl"
            >
              <form onSubmit={handleSearch} className="relative">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-dark/40" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full bg-white pl-12 pr-14 py-4 text-base text-dark rounded-lg shadow-2xl outline-none focus:ring-2 focus:ring-gold"
                />
                {loadingSuggestions ? (
                  <div className="absolute right-12 top-1/2 -translate-y-1/2 animate-spin rounded-full h-4 w-4 border-b-2 border-gold" />
                ) : null}
                <button
                  type="button"
                  onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-dark/40 hover:text-dark"
                >
                  <X size={20} />
                </button>
              </form>

              {/* Autocomplete Suggestions Box */}
              {searchQuery.trim() && (
                <div className="mt-2 bg-white rounded-lg shadow-2xl overflow-hidden border border-cream/50 z-[110] relative max-h-[350px] overflow-y-auto">
                  {loadingSuggestions && suggestions.length === 0 ? (
                    <div className="p-4 text-center text-xs text-dark/50">Searching for products...</div>
                  ) : suggestions.length > 0 ? (
                    <div className="divide-y divide-cream/30">
                      {suggestions.map((prod) => {
                        const hasDiscount = prod.discountPrice !== null && prod.discountPrice !== undefined;
                        const displayPrice = hasDiscount ? prod.discountPrice : prod.price;
                        const mainImg = prod.images?.[0]?.imageUrl || prod.primaryImage || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=100';
                        return (
                          <button
                            key={prod.id}
                            onClick={() => {
                              navigate(`/product/${prod.slug}`);
                              setSearchOpen(false);
                              setSearchQuery('');
                            }}
                            className="w-full text-left p-3 hover:bg-cream/10 flex items-center gap-3 transition-colors duration-200"
                          >
                            <img
                              src={mainImg}
                              alt={prod.name}
                              className="w-10 h-12 object-cover rounded bg-cream/20 flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-xs text-primary truncate">{prod.name}</h4>
                              <p className="text-[10px] text-dark/60 mt-0.5 uppercase tracking-wider">{prod.collectionType || 'Exclusive drop'}</p>
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-bold text-primary">₹{displayPrice}</span>
                              {hasDiscount && (
                                <span className="text-[10px] text-dark/45 line-through ml-1.5 font-normal">₹{prod.price}</span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                      <button
                        onClick={handleSearch}
                        className="w-full text-center p-2.5 bg-cream/5 hover:bg-cream/10 text-xs font-semibold text-gold transition-colors duration-200 border-t border-cream/30"
                      >
                        View all results for "{searchQuery}"
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 text-center text-xs text-dark/50">No products found matching "{searchQuery}"</div>
                  )}
                </div>
              )}
              <p className="text-white/60 text-xs text-center mt-3">Press Enter to search · Esc to close</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
