import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Link2, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div>
            <img src="https://res.cloudinary.com/dqcxekzxn/image/upload/v1778683336/Screenshot_2026-05-13_194015_rtsdbz.png" alt="Veloura" className="h-10 mb-4 border border-gold rounded-sm shadow-sm" />
            <p className="text-gray-300 mb-6 text-sm leading-relaxed">
              Premium Gen-Z women's fashion brand offering elegant feminine aesthetics with modern designs.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/_.velouraofficial?igsh=dnVwZnRscW05ODZm" target="_blank" rel="noreferrer" aria-label="Instagram" className="text-white hover:text-gold transition-colors"><Instagram size={20} /></a>
              <a href="https://youtube.com/@velourastudio19?si=xp2cms_W10yq9cFb" target="_blank" rel="noreferrer" aria-label="YouTube" className="text-white hover:text-gold transition-colors"><Youtube size={20} /></a>
              <a href="https://www.threads.com/@_.velouraofficial" target="_blank" rel="noreferrer" aria-label="Threads" className="text-white hover:text-gold transition-colors"><Link2 size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-heading font-semibold mb-4 text-white">Shop</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/new-arrivals" className="hover:text-gold transition-colors">New Arrivals</Link></li>
              <li><Link to="/collections" className="hover:text-gold transition-colors">Collections</Link></li>
              <li><Link to="/shop" className="hover:text-gold transition-colors">Shop</Link></li>
              <li><Link to="/about" className="hover:text-gold transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Help & Policies */}
          <div>
            <h4 className="text-lg font-heading font-semibold mb-4 text-white">Help & Policies</h4>
            <p className="text-sm text-gray-300 mb-4 leading-relaxed">
              Delivery, exchanges, FAQs, and support information for a smooth Veloura experience.
            </p>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/contact" className="hover:text-gold transition-colors">Contact Us</Link></li>
              <li><Link to="/faq" className="hover:text-gold transition-colors">FAQ</Link></li>
              <li><Link to="/shipping" className="hover:text-gold transition-colors">Shipping Policy</Link></li>
              <li><Link to="/returns" className="hover:text-gold transition-colors">Return Policy</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-heading font-semibold mb-4 text-white">Join Our Newsletter</h4>
            <p className="text-sm text-gray-300 mb-4">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
            <form className="flex">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="bg-transparent border border-gray-600 px-4 py-2 w-full text-white placeholder-gray-400 focus:outline-none focus:border-gold"
              />
              <button type="submit" className="bg-gold text-dark px-4 py-2 font-medium hover:bg-opacity-90 transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
          <p>&copy; {new Date().getFullYear()} Veloura. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-gold transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-gold transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
