import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, ArrowLeft, Star, ChevronDown, Check, Ruler, X } from 'lucide-react';
import { productService } from '../../services/product.service';
import { useAuth } from '../../context/AuthContext';
import AuthPromptModal from '../../components/modals/AuthPromptModal';

const WHATSAPP_NUMBER = '916261802019';
const SITE_URL = 'https://veloura.in';

const ProductDetail = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  
  // Selection States
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const { user } = useAuth();

  // Accordion Toggle States
  const [openSection, setOpenSection] = useState('details');
  const [showSizeChart, setShowSizeChart] = useState(false);

  const sizeChartData = [
    { size: 'XXS', chest: '30', waist: '26', hips: '34' },
    { size: 'XS', chest: '32', waist: '28', hips: '36' },
    { size: 'S', chest: '34', waist: '30', hips: '38' },
    { size: 'M', chest: '36', waist: '32', hips: '40' },
    { size: 'L', chest: '38', waist: '34', hips: '42' },
    { size: 'XL', chest: '40', waist: '36', hips: '44' },
    { size: 'XXL', chest: '42', waist: '38', hips: '46' },
    { size: 'XXXL', chest: '44', waist: '40', hips: '48' }
  ];

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const res = await productService.getProductBySlug(slug);
      if (res.success && res.data) {
        setProduct(res.data);
        // Default image
        const mainImg = res.data.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600';
        setActiveImage(mainImg);
        
        // Auto-select first variant color/size if available
        if (res.data.variants && res.data.variants.length > 0) {
          setSelectedSize(res.data.variants[0].size || '');
          setSelectedColor(res.data.variants[0].color || '');
        }
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
    // Check if item is already in wishlist
    const currentWishlist = JSON.parse(localStorage.getItem('veloura_wishlist') || '[]');
    setWishlisted(currentWishlist.some(item => item.slug === slug));
  }, [slug]);

  const handleWishlistToggle = () => {
    if (!product) return;
    
    let currentWishlist = JSON.parse(localStorage.getItem('veloura_wishlist') || '[]');
    const isAlreadyThere = currentWishlist.some(item => item.slug === slug);

    if (isAlreadyThere) {
      currentWishlist = currentWishlist.filter(item => item.slug !== slug);
      setWishlisted(false);
    } else {
      currentWishlist.push({
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.discountPrice || product.price,
        image: activeImage
      });
      setWishlisted(true);
    }

    localStorage.setItem('veloura_wishlist', JSON.stringify(currentWishlist));
  };

  if (loading) {
    return (
      <div className="h-[70vh] w-full flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-32 bg-white px-4">
        <h2 className="text-2xl font-heading font-bold text-primary mb-4">Product Not Found</h2>
        <p className="text-dark/70 text-sm mb-6">The collection item you are looking for might have been archived.</p>
        <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
          <ArrowLeft size={16} /> Back to Shop
        </Link>
      </div>
    );
  }

  const hasDiscount = product.discountPrice !== null && product.discountPrice !== undefined;
  const displayPrice = hasDiscount ? product.discountPrice : product.price;
  const productLink = `${SITE_URL}/product/${product.slug}`;
  const selectedDetails = [
    selectedSize && `Size: ${selectedSize}`,
    selectedColor && `Color: ${selectedColor}`,
    `Quantity: ${quantity}`,
  ].filter(Boolean).join('\n');
  const orderMessage = `Hi Veloura, I would like to order this product:\n\n${product.name}\nPrice: Rs. ${displayPrice}\n${selectedDetails}\n${productLink}`;
  const enquiryMessage = `Hi Veloura, I want to enquire about this product:\n\n${product.name}\nPrice: Rs. ${displayPrice}\n${selectedSize ? `Size: ${selectedSize}\n` : ''}${selectedColor ? `Color: ${selectedColor}\n` : ''}${productLink}`;
  const orderWhatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(orderMessage)}`;
  const enquiryWhatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(enquiryMessage)}`;

  // Extract unique sizes and colors available for variants
  const uniqueSizes = [...new Set(product.variants?.map(v => v.size).filter(Boolean))];
  const uniqueColors = product.variants?.reduce((acc, v) => {
    if (v.color && !acc.some(c => c.name === v.color)) {
      acc.push({ name: v.color, hex: v.colorHex });
    }
    return acc;
  }, []) || [];

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        {/* Back Link */}
        <Link to="/shop" className="inline-flex items-center gap-2 text-xs font-semibold text-dark/60 hover:text-gold mb-8 transition-colors">
          <ArrowLeft size={14} /> Back to collections
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          {/* IMAGE PORTRAIT FRAME */}
          <div className="space-y-4">
            <div className="aspect-[3/4] overflow-hidden bg-cream/20 rounded shadow-sm border border-cream/50 relative">
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img.imageUrl)}
                    className={`w-20 aspect-[3/4] flex-shrink-0 border rounded overflow-hidden transition-all ${
                      activeImage === img.imageUrl ? 'border-gold shadow-premium' : 'border-cream opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img.imageUrl}
                      alt={`${product.name} thumb ${idx}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* EDITORIAL DETAILED CARD */}
          <div className="flex flex-col">
            <span className="text-xs text-gold font-bold tracking-widest uppercase mb-1">
              {product.collectionType || 'Exclusive Piece'}
            </span>
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-primary leading-tight">
              {product.name}
            </h1>
            
            {/* Price Frame */}
            <div className="flex items-center gap-3 mt-4 mb-6">
              <span className="text-2xl font-bold text-primary">₹{displayPrice}</span>
              {hasDiscount && (
                <span className="text-base text-dark/40 line-through">₹{product.price}</span>
              )}
            </div>

            {/* Rating summary */}
            {product.averageRating > 0 && (
              <div className="flex items-center gap-1 text-xs text-dark/70 pb-6 border-b border-cream">
                <div className="flex text-gold">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill={i < Math.round(product.averageRating) ? 'currentColor' : 'none'} />
                  ))}
                </div>
                <span>({product.totalReviews || 0} customer reviews)</span>
              </div>
            )}

            {/* Selector Options */}
            <div className="py-6 space-y-6">
              {/* Color swatches */}
              {uniqueColors.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-3">
                    Color: <span className="text-dark/70 font-normal">{selectedColor}</span>
                  </h3>
                  <div className="flex gap-3">
                    {uniqueColors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                          selectedColor === color.name ? 'ring-2 ring-gold scale-105' : 'border-cream'
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      >
                        {selectedColor === color.name && (
                          <Check size={14} className={color.name === 'White' || color.name === 'Cream' ? 'text-dark' : 'text-white'} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selectors */}
              {uniqueSizes.length > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xs font-bold text-primary uppercase tracking-wider">
                      Size: <span className="text-dark/70 font-normal">{selectedSize}</span>
                    </h3>
                    <button
                      onClick={() => setShowSizeChart(true)}
                      className="text-xs text-gold font-semibold flex items-center gap-1 hover:underline transition-all"
                    >
                      <Ruler size={13} /> Size Guide
                    </button>
                  </div>
                  <div className="flex gap-2">
                    {uniqueSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-10 h-10 border text-xs font-medium transition-all ${
                          selectedSize === size
                            ? 'border-gold bg-gold text-white shadow-premium'
                            : 'border-cream bg-white text-dark hover:border-gold'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div>
                <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-3">Quantity</h3>
                <div className="flex items-center border border-cream w-28 rounded">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-dark hover:text-gold font-bold text-sm w-full"
                  >
                    -
                  </button>
                  <span className="px-3 py-1.5 text-xs text-primary font-semibold text-center w-full">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1.5 text-dark hover:text-gold font-bold text-sm w-full"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* ACTION TRIGGERS */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 pb-8 border-b border-cream">
              <button
                onClick={() => {
                  if (!user) {
                    setShowAuthPrompt(true);
                  } else {
                    window.open(orderWhatsappUrl, '_blank', 'noopener,noreferrer');
                  }
                }}
                className="flex-grow btn-primary flex items-center justify-center gap-2 py-3 cursor-pointer"
              >
                <MessageCircle size={18} /> Order on WhatsApp
              </button>
              
              <button
                onClick={() => {
                  if (!user) {
                    setShowAuthPrompt(true);
                  } else {
                    window.open(enquiryWhatsappUrl, '_blank', 'noopener,noreferrer');
                  }
                }}
                className="flex-grow py-3 px-4 border border-gold text-gold rounded flex items-center justify-center gap-2 font-semibold hover:bg-gold/5 transition-all cursor-pointer"
              >
                <MessageCircle size={18} /> Enquire on WhatsApp
              </button>
              
              <button
                onClick={handleWishlistToggle}
                className={`py-3 px-4 border rounded flex items-center justify-center gap-2 transition-all ${
                  wishlisted
                    ? 'border-gold text-gold bg-gold/5 font-semibold'
                    : 'border-cream text-dark/70 hover:border-gold hover:text-gold bg-white'
                }`}
              >
                <Heart size={18} fill={wishlisted ? 'currentColor' : 'none'} />
                {wishlisted ? 'Saved' : 'Save to wishlist'}
              </button>
            </div>

            {/* Auth Prompt Modal */}
            <AuthPromptModal
              isOpen={showAuthPrompt}
              onClose={() => setShowAuthPrompt(false)}
              redirectPath={`/product/${slug}`}
            />

            {/* ACCORDION DETAILS PANELS */}
            <div className="mt-8 space-y-4">
              {/* Product description details */}
              <div className="border-b border-cream pb-3">
                <button
                  onClick={() => setOpenSection(openSection === 'details' ? '' : 'details')}
                  className="w-full flex justify-between items-center text-xs font-bold text-primary uppercase tracking-wider py-1 text-left"
                >
                  Description & Details <ChevronDown size={14} className={`transform transition-transform ${openSection === 'details' ? 'rotate-180' : ''}`} />
                </button>
                {openSection === 'details' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-3 text-xs leading-relaxed text-dark/70 font-light space-y-3"
                  >
                    <p className="whitespace-pre-line">{product.description || product.shortDescription}</p>
                    {product.features && product.features.length > 0 && (
                      <ul className="list-disc pl-4 space-y-1">
                        {product.features.map((feat, i) => (
                          <li key={i}>{feat}</li>
                        ))}
                      </ul>
                    )}
                  </motion.div>
                )}
              </div>

              {/* Material information */}
              <div className="border-b border-cream pb-3">
                <button
                  onClick={() => setOpenSection(openSection === 'material' ? '' : 'material')}
                  className="w-full flex justify-between items-center text-xs font-bold text-primary uppercase tracking-wider py-1 text-left"
                >
                  Composition & Materials <ChevronDown size={14} className={`transform transition-transform ${openSection === 'material' ? 'rotate-180' : ''}`} />
                </button>
                {openSection === 'material' && (
                  <div className="mt-3 text-xs leading-relaxed text-dark/70 font-light">
                    <p>Fabric: <span className="font-semibold text-primary">{product.material || 'Premium Fabric'}</span></p>
                    <p className="mt-2">Dry clean only or cold gentle hand wash. Do not tumble dry. Medium heat iron.</p>
                  </div>
                )}
              </div>

              {/* Shipping info */}
              <div className="border-b border-cream pb-3">
                <button
                  onClick={() => setOpenSection(openSection === 'shipping' ? '' : 'shipping')}
                  className="w-full flex justify-between items-center text-xs font-bold text-primary uppercase tracking-wider py-1 text-left"
                >
                  Shipping & Returns <ChevronDown size={14} className={`transform transition-transform ${openSection === 'shipping' ? 'rotate-180' : ''}`} />
                </button>
                {openSection === 'shipping' && (
                  <div className="mt-3 text-xs leading-relaxed text-dark/70 font-light">
                    <p className="whitespace-pre-line">{product.shippingInfo || 'Free express delivery on orders above ₹1999. Return/Exchange request can be filed within 14 days of delivery.'}</p>
                  </div>
                )}
              </div>

              {/* Size Chart Accordion */}
              <div className="border-b border-cream pb-3">
                <button
                  onClick={() => setOpenSection(openSection === 'sizeguide' ? '' : 'sizeguide')}
                  className="w-full flex justify-between items-center text-xs font-bold text-primary uppercase tracking-wider py-1 text-left"
                >
                  Size Chart & Measurements <ChevronDown size={14} className={`transform transition-transform ${openSection === 'sizeguide' ? 'rotate-180' : ''}`} />
                </button>
                {openSection === 'sizeguide' && (
                  <div className="mt-3 overflow-x-auto">
                    <table className="w-full text-left text-[11px] border-collapse">
                      <thead>
                        <tr className="border-b border-cream bg-cream/10 text-primary font-bold">
                          <th className="py-2 px-3">Size</th>
                          <th className="py-2 px-3">Chest</th>
                          <th className="py-2 px-3">Waist</th>
                          <th className="py-2 px-3">Hips</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-cream/40 text-dark/70">
                        {sizeChartData.map((row) => (
                          <tr 
                            key={row.size} 
                            className={selectedSize === row.size ? 'bg-gold/5 font-semibold text-gold' : ''}
                          >
                            <td className="py-2 px-3 font-semibold">{row.size}</td>
                            <td className="py-2 px-3">{row.chest}"</td>
                            <td className="py-2 px-3">{row.waist}"</td>
                            <td className="py-2 px-3">{row.hips}"</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <p className="text-[9px] text-dark/40 mt-2 text-center">* All measurements are in inches</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Size Chart Modal */}
      {showSizeChart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark/50 backdrop-blur-sm p-4">
          <div className="bg-white max-w-md w-full rounded shadow-premium border border-cream overflow-hidden">
            <div className="p-5 border-b border-cream flex justify-between items-center bg-cream/10">
              <div className="flex items-center gap-2">
                <Ruler size={16} className="text-gold" />
                <h3 className="font-heading font-bold text-primary text-base">Size Guide</h3>
              </div>
              <button
                onClick={() => setShowSizeChart(false)}
                className="text-dark/40 hover:text-dark transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="p-5">
              <div className="overflow-x-auto border border-cream rounded">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-cream bg-cream/5 text-primary font-bold">
                      <th className="py-2.5 px-3 font-semibold uppercase text-[10px]">Size</th>
                      <th className="py-2.5 px-3 font-semibold uppercase text-[10px]">Chest (in)</th>
                      <th className="py-2.5 px-3 font-semibold uppercase text-[10px]">Waist (in)</th>
                      <th className="py-2.5 px-3 font-semibold uppercase text-[10px]">Hips (in)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cream/50 text-dark/80">
                    {sizeChartData.map((row) => (
                      <tr 
                        key={row.size} 
                        className={`hover:bg-cream/5 transition-colors ${
                          selectedSize === row.size ? 'bg-gold/5 font-semibold text-gold' : ''
                        }`}
                      >
                        <td className="py-2.5 px-3 font-semibold">{row.size}</td>
                        <td className="py-2.5 px-3">{row.chest}</td>
                        <td className="py-2.5 px-3">{row.waist}</td>
                        <td className="py-2.5 px-3">{row.hips}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[9px] text-dark/40 mt-3 text-center">
                * All measurements listed are in inches. Body measurements may vary slightly.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
