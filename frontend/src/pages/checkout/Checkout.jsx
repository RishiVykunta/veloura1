import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, CreditCard, Box, ChevronRight, ShoppingBag } from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    paymentMethod: 'COD'
  });
  
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('veloura_cart') || '[]');
    setCartItems(items);
    if (items.length === 0 && !orderPlaced) {
      navigate('/cart');
    }
  }, [navigate, orderPlaced]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const subtotal = getSubtotal();
  const shippingFee = subtotal > 1999 ? 0 : 150;
  const total = subtotal + shippingFee;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone || !formData.address) {
      alert('Please fill in shipping name, email, phone, and address.');
      return;
    }

    // Generate random order number
    const randOrder = 'VEL-' + Math.floor(100000 + Math.random() * 900000);
    setOrderNumber(randOrder);
    
    // Simulate API request delay and success
    if (formData.paymentMethod === 'Razorpay') {
      alert('Simulating secure Razorpay gateway initialization...\nAuthenticating 3D-secure panel...');
    }

    // Clear cart
    localStorage.removeItem('veloura_cart');
    setOrderPlaced(true);
  };

  if (orderPlaced) {
    return (
      <div className="bg-white min-h-screen py-20 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-cream/15 p-8 border border-cream rounded-lg text-center shadow-premium">
          <CheckCircle2 size={48} className="text-gold mx-auto mb-4" />
          <h1 className="text-2xl font-heading font-bold text-primary mb-2">Order Confirmed</h1>
          <p className="text-xs text-dark/70 mb-6">Thank you for shopping with Veloura. Your style signature is set.</p>
          
          <div className="bg-white p-4 border border-cream rounded text-left space-y-2 mb-8 text-xs">
            <div className="flex justify-between text-dark/60">
              <span>Order Number:</span>
              <span className="font-semibold text-primary">{orderNumber}</span>
            </div>
            <div className="flex justify-between text-dark/60">
              <span>Delivery Status:</span>
              <span className="font-semibold text-primary">Pending Dispatch</span>
            </div>
            <div className="flex justify-between text-dark/60">
              <span>Estimated Delivery:</span>
              <span className="font-semibold text-primary">3-5 Business Days</span>
            </div>
          </div>

          <Link to="/shop" className="w-full btn-primary block py-2.5 text-center text-xs font-semibold">
            Continue browsing
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-16 px-4 md:px-8">
      <div className="container mx-auto max-w-5xl">
        <h1 className="text-3xl font-heading font-bold text-primary mb-10">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Form inputs */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-white p-6 border border-cream/70 rounded space-y-4">
                <h2 className="text-base font-heading font-bold text-primary pb-2 border-b border-cream">Shipping Details</h2>
                
                <div>
                  <label className="block text-[11px] font-bold text-primary uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full bg-cream/20 border border-cream/50 px-3 py-2 text-xs rounded outline-none focus:border-gold"
                    placeholder="E.g., Charlotte Sterling"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-primary uppercase mb-1">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-cream/20 border border-cream/50 px-3 py-2 text-xs rounded outline-none focus:border-gold"
                      placeholder="charlotte@gmail.com"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-primary uppercase mb-1">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-cream/20 border border-cream/50 px-3 py-2 text-xs rounded outline-none focus:border-gold"
                      placeholder="9876543210"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-primary uppercase mb-1">Address</label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full bg-cream/20 border border-cream/50 px-3 py-2 text-xs rounded outline-none focus:border-gold"
                    placeholder="Suite, Apartment, Building, Street"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-primary uppercase mb-1">City / Region</label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full bg-cream/20 border border-cream/50 px-3 py-2 text-xs rounded outline-none focus:border-gold"
                      placeholder="Mumbai"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-primary uppercase mb-1">PIN / Postal Code</label>
                    <input
                      type="text"
                      name="postalCode"
                      required
                      value={formData.postalCode}
                      onChange={handleChange}
                      className="w-full bg-cream/20 border border-cream/50 px-3 py-2 text-xs rounded outline-none focus:border-gold"
                      placeholder="400001"
                    />
                  </div>
                </div>
              </div>

              {/* Payment toggle */}
              <div className="bg-white p-6 border border-cream/70 rounded space-y-4">
                <h2 className="text-base font-heading font-bold text-primary pb-2 border-b border-cream">Payment Method</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className={`border p-4 rounded flex items-center gap-3 cursor-pointer transition-all ${
                    formData.paymentMethod === 'COD' ? 'border-gold bg-gold/5' : 'border-cream bg-white'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={formData.paymentMethod === 'COD'}
                      onChange={handleChange}
                      className="accent-gold"
                    />
                    <div className="text-xs">
                      <p className="font-bold text-primary flex items-center gap-1"><Box size={14} /> Cash On Delivery</p>
                      <p className="text-dark/50 mt-0.5">Pay in cash when delivered.</p>
                    </div>
                  </label>

                  <label className={`border p-4 rounded flex items-center gap-3 cursor-pointer transition-all ${
                    formData.paymentMethod === 'Razorpay' ? 'border-gold bg-gold/5' : 'border-cream bg-white'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Razorpay"
                      checked={formData.paymentMethod === 'Razorpay'}
                      onChange={handleChange}
                      className="accent-gold"
                    />
                    <div className="text-xs">
                      <p className="font-bold text-primary flex items-center gap-1"><CreditCard size={14} /> Razorpay Secure</p>
                      <p className="text-dark/50 mt-0.5">UPI, Cards, and Netbanking.</p>
                    </div>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full btn-primary py-3 uppercase tracking-widest text-xs font-bold shadow-premium"
              >
                Complete Order
              </button>
            </form>
          </div>

          {/* Cart outline sidebar */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-cream/20 border border-cream/80 p-6 rounded">
              <h2 className="text-base font-heading font-bold text-primary pb-4 border-b border-cream mb-4">Bag Review</h2>
              
              <div className="space-y-4 max-h-[300px] overflow-y-auto mb-4 pr-1">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="flex gap-3 text-xs">
                    <div className="w-12 aspect-[3/4] rounded overflow-hidden bg-cream/40 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="font-bold text-primary truncate leading-tight">{item.name}</h4>
                      <p className="text-dark/60 mt-0.5">Size: {item.size} | Qty: {item.quantity}</p>
                      <p className="font-semibold text-primary mt-1">₹{item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-cream space-y-2 text-xs text-dark/70">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span>{shippingFee === 0 ? 'Free' : `₹${shippingFee}`}</span>
                </div>
                <div className="flex justify-between font-bold text-primary text-sm pt-2 border-t border-cream/50">
                  <span>Payable Total</span>
                  <span>₹{total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
