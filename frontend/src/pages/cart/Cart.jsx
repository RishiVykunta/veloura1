import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('veloura_cart') || '[]');
    setCartItems(items);
  }, []);

  const updateQuantity = (index, delta) => {
    const updated = [...cartItems];
    updated[index].quantity = Math.max(1, updated[index].quantity + delta);
    setCartItems(updated);
    localStorage.setItem('veloura_cart', JSON.stringify(updated));
  };

  const removeItem = (index) => {
    const updated = cartItems.filter((_, idx) => idx !== index);
    setCartItems(updated);
    localStorage.setItem('veloura_cart', JSON.stringify(updated));
  };

  const getSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const subtotal = getSubtotal();
  const shippingFee = subtotal > 1999 || subtotal === 0 ? 0 : 150;
  const total = subtotal + shippingFee;

  return (
    <div className="bg-white min-h-screen py-16 px-4 md:px-8">
      <div className="container mx-auto max-w-5xl">
        <h1 className="text-3xl font-heading font-bold text-primary mb-10 text-center">Your Bag</h1>
        
        {cartItems.length === 0 ? (
          <div className="text-center py-20 bg-cream/15 border border-cream/50 rounded flex flex-col items-center">
            <ShoppingBag size={48} className="text-dark/30 mb-4" />
            <h2 className="text-lg font-heading font-bold text-primary mb-2">Your Bag is Empty</h2>
            <p className="text-xs text-dark/60 mb-8 max-w-xs">Fill it with Aurelia slips, Seraphina tailoring, and Baroque drops.</p>
            <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
              <ArrowLeft size={16} /> Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Items List */}
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item, idx) => (
                <div 
                  key={idx}
                  className="flex gap-4 p-4 border border-cream/55 rounded bg-white hover:shadow-sm transition-shadow"
                >
                  <div className="w-20 aspect-[3/4] bg-cream/20 rounded overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <Link to={`/product/${item.slug}`} className="hover:underline">
                          <h3 className="font-heading font-bold text-primary text-sm sm:text-base leading-tight">
                            {item.name}
                          </h3>
                        </Link>
                        <button 
                          onClick={() => removeItem(idx)}
                          className="text-dark/40 hover:text-red-500 p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-dark/70 mt-1">
                        <span>Size: <span className="font-medium text-primary">{item.size}</span></span>
                        <span>Color: <span className="font-medium text-primary">{item.color}</span></span>
                        <span>SKU: <span className="font-medium text-primary/60">{item.sku}</span></span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      {/* Counter */}
                      <div className="flex items-center border border-cream rounded">
                        <button 
                          onClick={() => updateQuantity(idx, -1)}
                          className="px-2 py-0.5 text-xs font-bold text-dark hover:text-gold"
                        >
                          -
                        </button>
                        <span className="px-2.5 text-[11px] text-primary font-bold">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(idx, 1)}
                          className="px-2 py-0.5 text-xs font-bold text-dark hover:text-gold"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-bold text-primary text-sm">₹{item.price * item.quantity}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="bg-cream/25 border border-cream p-6 rounded h-fit sticky top-24">
              <h2 className="text-lg font-heading font-bold text-primary pb-4 border-b border-cream">Order Summary</h2>
              
              <div className="py-4 space-y-3 text-xs border-b border-cream">
                <div className="flex justify-between text-dark/80">
                  <span>Bag Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-dark/80">
                  <span>Shipping Fee</span>
                  <span>{shippingFee === 0 ? 'Free' : `₹${shippingFee}`}</span>
                </div>
                {shippingFee > 0 && (
                  <p className="text-[10px] text-gold font-medium">Add ₹{2000 - subtotal} more for free delivery!</p>
                )}
              </div>

              <div className="py-4 flex justify-between font-bold text-primary text-sm">
                <span>Total Amount</span>
                <span>₹{total}</span>
              </div>

              <Link 
                to="/checkout"
                className="w-full btn-primary flex items-center justify-center gap-2 py-3 mt-4 text-xs font-semibold uppercase tracking-wider"
              >
                Proceed to Checkout <ArrowRight size={14} />
              </Link>
              
              <div className="text-center mt-4">
                <Link to="/shop" className="text-[10px] text-gold hover:underline font-semibold">
                  or continue shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
