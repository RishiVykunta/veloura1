import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingBag, Heart, User, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      const cart = JSON.parse(localStorage.getItem('veloura_cart') || '[]');
      const count = cart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(count);
    };
    updateCount();
    window.addEventListener('storage', updateCount);
    const interval = setInterval(updateCount, 1000);
    return () => {
      window.removeEventListener('storage', updateCount);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white shadow-premium py-3' : 'bg-transparent py-5'
        }`}
      >
        <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-primary"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="https://res.cloudinary.com/dqcxekzxn/image/upload/v1778683336/Screenshot_2026-05-13_194015_rtsdbz.png" alt="Veloura" className="h-8" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/new-arrivals" className="text-dark hover:text-gold transition-colors font-medium">New Arrivals</Link>
            <Link to="/shop" className="text-dark hover:text-gold transition-colors font-medium">Shop</Link>
            <Link to="/collections" className="text-dark hover:text-gold transition-colors font-medium">Collections</Link>
            <Link to="/about" className="text-dark hover:text-gold transition-colors font-medium">About</Link>
          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-4 text-primary">
            <button className="hover:text-gold transition-colors">
              <Search size={20} />
            </button>
            <Link to="/profile" className="hidden md:block hover:text-gold transition-colors">
              <User size={20} />
            </Link>
            <Link to="/wishlist" className="hover:text-gold transition-colors">
              <Heart size={20} />
            </Link>
            <Link to="/cart" className="hover:text-gold transition-colors relative">
              <ShoppingBag size={20} />
              <span className="absolute -top-2 -right-2 bg-gold text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">{cartCount}</span>
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
                <img src="https://res.cloudinary.com/dqcxekzxn/image/upload/v1778683336/Screenshot_2026-05-13_194015_rtsdbz.png" alt="Veloura" className="h-6" />
                <button onClick={() => setMobileMenuOpen(false)} className="text-dark p-1">
                  <X size={24} />
                </button>
              </div>
              <div className="flex flex-col py-4 px-4 space-y-4">
                <Link to="/new-arrivals" className="text-lg text-dark py-2 border-b border-cream" onClick={() => setMobileMenuOpen(false)}>New Arrivals</Link>
                <Link to="/shop" className="text-lg text-dark py-2 border-b border-cream" onClick={() => setMobileMenuOpen(false)}>Shop</Link>
                <Link to="/collections" className="text-lg text-dark py-2 border-b border-cream" onClick={() => setMobileMenuOpen(false)}>Collections</Link>
                <Link to="/profile" className="text-lg text-dark py-2 border-b border-cream" onClick={() => setMobileMenuOpen(false)}>My Account</Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
