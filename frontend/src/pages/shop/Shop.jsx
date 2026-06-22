import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, Heart, Eye, X } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { productService } from '../../services/product.service';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [searchParams] = useSearchParams();
  const activeFilter = searchParams.get('filter'); // 'new-arrivals', 'featured', or null
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState(6000);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [sortOption, setSortOption] = useState('newest');

  // Static options based on brand guide
  const categories = [
    { name: 'All Collections', slug: '' },
    { name: 'Dresses', slug: 'dresses' },
    { name: 'Tops', slug: 'tops' },
    { name: 'Bottoms', slug: 'bottoms' },
    { name: 'Accessories', slug: 'accessories' }
  ];
  const sizes = ['XS', 'S', 'M', 'L', 'XL'];
  const colors = [
    { name: 'Navy', hex: '#0A224E' },
    { name: 'Gold', hex: '#D4AF37' },
    { name: 'Cream', hex: '#F8F5EE' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Charcoal', hex: '#1E1E1E' },
    { name: 'Sage', hex: '#8FBC8F' }
  ];

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // If a special filter is active (from homepage "See All"), use dedicated endpoints
      if (activeFilter === 'new-arrivals') {
        const res = await productService.getNewArrivals();
        if (res.success) setProducts(res.data);
      } else if (activeFilter === 'featured') {
        const res = await productService.getFeatured();
        if (res.success) setProducts(res.data);
      } else {
        const filters = {
          category: selectedCategory,
          maxPrice: priceRange,
          size: selectedSize,
          color: selectedColor,
          search: searchQuery,
          sort: sortOption
        };
        const res = await productService.getProducts(filters);
        if (res.success) {
          setProducts(res.data);
        }
      }
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchProducts();
    }, 300); // Debounce queries
    return () => clearTimeout(delayDebounce);
  }, [selectedCategory, priceRange, selectedSize, selectedColor, searchQuery, sortOption, activeFilter]);

  const resetFilters = () => {
    setSelectedCategory('');
    setPriceRange(6000);
    setSelectedSize('');
    setSelectedColor('');
    setSearchQuery('');
    setSortOption('newest');
  };

  return (
    <div className="bg-white min-h-screen py-10 px-4 md:px-8">
      {/* Editorial Title */}
      <div className="text-center max-w-xl mx-auto mb-12">
        <span className="text-gold uppercase tracking-widest text-xs font-semibold">Veloura Atelier</span>
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary mt-2">
          {activeFilter === 'new-arrivals' ? 'New Arrivals' : activeFilter === 'featured' ? 'Featured Products' : 'The Collections'}
        </h1>
        <div className="w-12 h-[2px] bg-gold mx-auto mt-4 mb-6"></div>
        <p className="text-dark/70 font-light text-sm">
          {activeFilter === 'new-arrivals'
            ? 'Discover our latest additions — fresh styles curated just for you.'
            : activeFilter === 'featured'
            ? 'Hand-picked favourites our customers love the most.'
            : 'Carefully tailored silhouettes inspired by editorial romance, everyday minimalism, and Gen-Z aesthetics.'}
        </p>
      </div>

      <div className="container mx-auto flex flex-col lg:flex-row gap-8">
        {/* DESKTOP SIDEBAR FILTERS */}
        <aside className="hidden lg:block w-[260px] flex-shrink-0">
          <div className="sticky top-24 space-y-8 bg-cream/35 p-6 rounded-lg border border-cream">
            <div className="flex justify-between items-center pb-4 border-b border-cream">
              <h3 className="font-heading font-semibold text-lg text-primary flex items-center gap-2">
                <SlidersHorizontal size={18} /> Filters
              </h3>
              <button onClick={resetFilters} className="text-xs text-gold font-medium hover:underline">
                Clear All
              </button>
            </div>

            {/* Search */}
            <div>
              <h4 className="text-sm font-semibold text-primary mb-3">Search</h4>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-cream px-3 py-2 pl-9 text-xs rounded outline-none focus:border-gold transition-colors text-dark"
                />
                <Search size={14} className="absolute left-3 top-3 text-dark/40" />
              </div>
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-sm font-semibold text-primary mb-3">Categories</h4>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`block text-xs font-medium transition-colors ${
                      selectedCategory === cat.slug ? 'text-gold underline' : 'text-dark/75 hover:text-gold'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <div className="flex justify-between text-sm font-semibold text-primary mb-3">
                <span>Max Price</span>
                <span className="text-gold font-bold">₹{priceRange}</span>
              </div>
              <input
                type="range"
                min="500"
                max="6000"
                step="100"
                value={priceRange}
                onChange={(e) => setPriceRange(parseInt(e.target.value))}
                className="w-full accent-gold bg-cream h-1 rounded-lg cursor-pointer"
              />
            </div>

            {/* Sizes */}
            <div>
              <h4 className="text-sm font-semibold text-primary mb-3">Sizes</h4>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(selectedSize === size ? '' : size)}
                    className={`w-8 h-8 flex items-center justify-center border text-xs font-medium transition-all ${
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

            {/* Colors */}
            <div>
              <h4 className="text-sm font-semibold text-primary mb-3">Colors</h4>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <button
                    key={color.name}
                    title={color.name}
                    onClick={() => setSelectedColor(selectedColor === color.name ? '' : color.name)}
                    className={`w-6 h-6 rounded-full border transition-all relative ${
                      selectedColor === color.name ? 'ring-2 ring-gold scale-110' : 'border-cream'
                    }`}
                    style={{ backgroundColor: color.hex }}
                  >
                    {color.name === 'White' && (
                      <div className="absolute inset-0 rounded-full border border-dark/10" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN PRODUCT AREA */}
        <div className="flex-grow">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 bg-cream/20 p-4 border border-cream/50 rounded">
            <button
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden w-full sm:w-auto flex items-center justify-center gap-2 border border-cream bg-white py-2 px-4 text-xs font-semibold text-primary rounded"
            >
              <SlidersHorizontal size={14} /> Filter Options
            </button>
            <div className="text-xs text-dark/70">
              Showing <span className="font-semibold text-primary">{products.length}</span> products
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-dark/70 whitespace-nowrap">Sort By:</span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full sm:w-auto border border-cream py-1 px-2 text-xs font-semibold text-primary bg-white rounded outline-none cursor-pointer"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="ratings">Top Rated</option>
              </select>
            </div>
          </div>

          {/* Grid View */}
          {loading ? (
            <div className="h-[40vh] w-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-cream/10 border border-dashed border-cream rounded-lg">
              <p className="text-dark/50 text-sm">No items found matching your filters.</p>
              <button onClick={resetFilters} className="text-xs text-gold underline mt-2 font-medium">
                Reset all filters
              </button>
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8"
            >
              <AnimatePresence>
                {products.map((product) => {
                  const hasDiscount = product.discountPrice !== null && product.discountPrice !== undefined;
                  const displayPrice = hasDiscount ? product.discountPrice : product.price;
                  const primaryImage = product.images?.[0]?.imageUrl || product.primaryImage || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=400';
                  
                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      transition={{ duration: 0.4 }}
                      key={product.id}
                      className="premium-card group bg-white border border-cream/40 rounded overflow-hidden relative shadow-premium hover:shadow-premium-hover transition-all duration-300"
                    >
                      {/* Badge tags */}
                      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
                        {product.isNewArrival && (
                          <span className="bg-primary text-white text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-sm">
                            New
                          </span>
                        )}
                        {hasDiscount && (
                          <span className="bg-gold text-white text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-sm">
                            Sale
                          </span>
                        )}
                      </div>

                      {/* Image Frame */}
                      <div className="relative aspect-[3/4] overflow-hidden bg-cream/25">
                        <img
                          src={primaryImage}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                          <Link
                            to={`/product/${product.slug}`}
                            className="bg-white text-primary p-2.5 rounded-full shadow hover:bg-gold hover:text-white transition-colors"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </Link>
                        </div>
                      </div>

                      {/* Info Frame */}
                      <div className="p-3 md:p-5">
                        <span className="text-[9px] md:text-[10px] text-gold tracking-widest uppercase font-semibold">
                          {product.collectionType || 'Luxury Outfits'}
                        </span>
                        <Link to={`/product/${product.slug}`} className="block mt-0.5 md:mt-1">
                          <h3 className="font-heading font-bold text-primary group-hover:text-gold transition-colors text-sm md:text-base truncate">
                            {product.name}
                          </h3>
                        </Link>
                        
                        {/* Rating */}
                        {product.averageRating && (
                          <div className="flex items-center gap-1 mt-1 text-[11px] text-dark/60">
                            <span className="text-gold">★</span>
                            <span>{product.averageRating} ({product.totalReviews || 0})</span>
                          </div>
                        )}

                        <div className="mt-2 md:mt-4 flex items-center justify-between">
                          <div className="flex items-center gap-1 md:gap-2">
                            <span className="font-bold text-primary text-xs md:text-sm">₹{displayPrice}</span>
                            {hasDiscount && (
                              <span className="text-[10px] md:text-xs text-dark/40 line-through">₹{product.price}</span>
                            )}
                          </div>
                          <Link
                            to={`/product/${product.slug}`}
                            className="text-[10px] md:text-xs font-semibold text-gold hover:underline flex items-center gap-1"
                          >
                            Details &rarr;
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      {/* MOBILE FILTERS DRAWER */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileFilters(false)}
              className="fixed inset-0 bg-black z-50 lg:hidden"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 bottom-0 w-[300px] bg-white z-50 shadow-2xl p-6 overflow-y-auto lg:hidden flex flex-col"
            >
              <div className="flex justify-between items-center pb-4 border-b border-cream mb-6">
                <h3 className="font-heading font-semibold text-lg text-primary">Filters</h3>
                <button onClick={() => setShowMobileFilters(false)} className="text-dark p-1">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6 flex-grow">
                {/* Search */}
                <div>
                  <h4 className="text-sm font-semibold text-primary mb-2">Search</h4>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-cream/30 border border-cream px-3 py-2 pl-9 text-xs rounded outline-none"
                    />
                    <Search size={14} className="absolute left-3 top-3 text-dark/40" />
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <h4 className="text-sm font-semibold text-primary mb-2">Categories</h4>
                  <div className="space-y-1.5">
                    {categories.map((cat) => (
                      <button
                        key={cat.slug}
                        onClick={() => {
                          setSelectedCategory(cat.slug);
                        }}
                        className={`block text-xs ${
                          selectedCategory === cat.slug ? 'text-gold underline font-bold' : 'text-dark/70'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-primary mb-2">
                    <span>Max Price</span>
                    <span className="text-gold">₹{priceRange}</span>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="6000"
                    step="100"
                    value={priceRange}
                    onChange={(e) => setPriceRange(parseInt(e.target.value))}
                    className="w-full accent-gold bg-cream h-1 rounded-lg"
                  />
                </div>

                {/* Sizes */}
                <div>
                  <h4 className="text-sm font-semibold text-primary mb-2">Sizes</h4>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(selectedSize === size ? '' : size)}
                        className={`w-8 h-8 flex items-center justify-center border text-xs font-medium transition-all ${
                          selectedSize === size ? 'border-gold bg-gold text-white' : 'border-cream text-dark'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Colors */}
                <div>
                  <h4 className="text-sm font-semibold text-primary mb-2">Colors</h4>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(selectedColor === color.name ? '' : color.name)}
                        className={`w-6 h-6 rounded-full border transition-all ${
                          selectedColor === color.name ? 'ring-2 ring-gold scale-110' : 'border-cream'
                        }`}
                        style={{ backgroundColor: color.hex }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-cream flex gap-4">
                <button
                  onClick={() => {
                    resetFilters();
                    setShowMobileFilters(false);
                  }}
                  className="flex-1 py-2 text-center text-xs font-semibold text-dark border border-cream rounded"
                >
                  Reset
                </button>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="flex-1 py-2 text-center text-xs font-semibold text-white bg-gold rounded"
                >
                  Apply
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Shop;
