import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LogIn, UserPlus, MessageCircle } from 'lucide-react';

const AuthPromptModal = ({ isOpen, onClose, redirectPath }) => {
  // Build query string so after login/register user is sent back to original page
  const returnTo = redirectPath || window.location.pathname;
  const loginPath = `/login?redirect=${encodeURIComponent(returnTo)}`;
  const registerPath = `/register?redirect=${encodeURIComponent(returnTo)}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-dark/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative bg-white rounded-lg shadow-premium border border-cream max-w-sm w-full overflow-hidden"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-dark/40 hover:text-dark transition-colors z-10"
            >
              <X size={18} />
            </button>

            {/* Top accent bar */}
            <div className="h-1 bg-gradient-to-r from-gold via-gold/80 to-gold" />

            {/* Content */}
            <div className="px-6 pt-7 pb-6 text-center">
              {/* Icon */}
              <div className="mx-auto w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center mb-5">
                <MessageCircle size={26} className="text-gold" />
              </div>

              <h3 className="font-heading text-xl font-bold text-primary mb-2">
                Sign in to Continue
              </h3>
              <p className="text-sm text-dark/65 leading-relaxed mb-7">
                Please log in or create an account to chat with us on WhatsApp. It only takes a moment!
              </p>

              {/* Action buttons */}
              <div className="space-y-3">
                <Link
                  to={loginPath}
                  onClick={onClose}
                  className="w-full flex items-center justify-center gap-2 btn-primary py-3 text-sm"
                >
                  <LogIn size={16} />
                  Sign In
                </Link>

                <Link
                  to={registerPath}
                  onClick={onClose}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-gold text-gold rounded font-semibold text-sm hover:bg-gold/5 transition-all"
                >
                  <UserPlus size={16} />
                  Create an Account
                </Link>
              </div>

              {/* Divider */}
              <div className="mt-5 pt-4 border-t border-cream">
                <button
                  onClick={onClose}
                  className="text-xs text-dark/45 hover:text-dark/70 transition-colors"
                >
                  Maybe later
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AuthPromptModal;
