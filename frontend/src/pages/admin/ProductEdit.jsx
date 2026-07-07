import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, X, Save, Loader2, CheckCircle2 } from 'lucide-react';
import { uploadService } from '../../services/upload.service';
import { productService } from '../../services/product.service';

const standardOrder = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
const sortSizes = (sizeArray) => {
  return [...sizeArray].sort((a, b) => {
    const idxA = standardOrder.indexOf(a);
    const idxB = standardOrder.indexOf(b);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return a.localeCompare(b);
  });
};

const ProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  // Form States
  const [name, setName] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [categoryId, setCategoryId] = useState('c1111111-1111-1111-1111-111111111111');
  const [tagsText, setTagsText] = useState('Festive, Silk, Green');
  const [shippingInfo, setShippingInfo] = useState('');
  const [material, setMaterial] = useState('');
  
  // Flags
  const [isActive, setIsActive] = useState(true);
  const [isNewArrival, setIsNewArrival] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);

  // Media states
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState('');

  // Sizes & Colors state
  const [sizes, setSizes] = useState([]);
  const [sizeInput, setSizeInput] = useState('');
  const [colors, setColors] = useState([]);
  const [colorInput, setColorInput] = useState('');
  const [stockQuantity, setStockQuantity] = useState('10');
  const sizeInputRef = useRef(null);
  const colorInputRef = useRef(null);

  // UI Response states
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Fetch product details for edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchProductDetails = async () => {
        try {
          const res = await productService.getProductById(id);
          if (res.success && res.data) {
            const p = res.data;
            setName(p.name || '');
            setShortDescription(p.shortDescription || p.description || '');
            setDescription(p.description || '');
            setSku(p.sku || '');
            setPrice(p.price?.toString() || '');
            setDiscountPrice(p.discountPrice?.toString() || '');
            setCategoryId(p.categoryId || 'c1111111-1111-1111-1111-111111111111');
            setTagsText(p.tags ? p.tags.join(', ') : '');
            setShippingInfo(p.shippingInfo || '');
            setMaterial(p.material || '');
            setIsActive(p.isActive !== false);
            setIsNewArrival(!!p.isNewArrival);
            setIsFeatured(!!p.isFeatured);
            setImages(p.images ? p.images.map(img => img.imageUrl || img) : []);
            if (p.variants && p.variants.length > 0) {
              // Extract unique sizes and colors from variants
              const uniqueSizes = [...new Set(p.variants.map(v => v.size).filter(Boolean))];
              const uniqueColors = [...new Set(p.variants.map(v => v.color).filter(Boolean))];
              setSizes(sortSizes(uniqueSizes));
              setColors(uniqueColors);
              setStockQuantity(p.variants[0]?.stock?.toString() || '10');
            }
          }
        } catch (err) {
          console.error('Error fetching product details:', err);
        }
      };
      fetchProductDetails();
    }
  }, [id, isEditMode]);

  // Handle image upload to Cloudinary/Local
  const handleImageFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await uploadService.uploadImage(file);
      if (res.success && res.url) {
        setImages((prev) => [...prev, res.url]);
      } else {
        alert('Image upload failed: response was unsuccessful');
      }
    } catch (err) {
      console.error('Error uploading image file:', err);
      const errMsg = err.response?.data?.message || err.message || 'server connection error';
      alert(`Upload failed: ${errMsg}`);
    } finally {
      setUploading(false);
    }
  };

  const handleAddImageUrl = () => {
    const url = imageUrlInput.trim();
    if (!url) return;
    setImages((prev) => [...prev, url]);
    setImageUrlInput('');
  };

  const removeImage = (idxToRemove) => {
    setImages((prev) => prev.filter((_, idx) => idx !== idxToRemove));
  };

  const addSize = () => {
    const val = sizeInput.trim().toUpperCase();
    if (!val || sizes.includes(val)) { setSizeInput(''); return; }
    setSizes(prev => sortSizes([...prev, val]));
    setSizeInput('');
    sizeInputRef.current?.focus();
  };

  const removeSize = (s) => setSizes(prev => sortSizes(prev.filter(x => x !== s)));

  const addColor = () => {
    const val = colorInput.trim();
    if (!val || colors.map(c => c.toLowerCase()).includes(val.toLowerCase())) { setColorInput(''); return; }
    setColors(prev => [...prev, val]);
    setColorInput('');
    colorInputRef.current?.focus();
  };

  const removeColor = (c) => setColors(prev => prev.filter(x => x !== c));

  const handleSaveProduct = async () => {
    if (!name || !sku || !price) {
      alert('Please fill out Product Name, SKU and Base Price.');
      return;
    }

    setLoading(true);
    setSuccessMsg('');

    try {
      const tags = tagsText.split(',').map((t) => t.trim()).filter(Boolean);
      const parsedPrice = parseFloat(price);
      const parsedDiscountPrice = discountPrice ? parseFloat(discountPrice) : null;

      // Compile variants from sizes × colors
      const stockVal = parseInt(stockQuantity) || 10;
      const variants = [];
      if (sizes.length > 0 || colors.length > 0) {
        const sizeList = sizes.length > 0 ? sizes : ['Free Size'];
        const colorList = colors.length > 0 ? colors : ['Default'];
        sizeList.forEach(sz => {
          colorList.forEach(cl => {
            variants.push({
              size: sz,
              color: cl,
              colorHex: '#D4AF37',
              stock: stockVal,
              sku: `${sku}-${sz}-${cl.replace(/\s+/g, '-').toUpperCase()}`
            });
          });
        });
      }

      const productPayload = {
        name,
        description: description || shortDescription,
        sku,
        categoryId,
        price: parsedPrice,
        discountPrice: parsedDiscountPrice,
        images, // Array of uploaded URLs
        variants,
        features: ['Premium women\'s atelier custom silhouette', 'Curated luxury fabrics and detailing'],
        tags,
        isActive,
        isNewArrival,
        isFeatured,
        shippingInfo,
        material
      };

      let res;
      if (isEditMode) {
        res = await productService.updateProduct(id, productPayload);
      } else {
        res = await productService.createProduct(productPayload);
      }

      if (res.success) {
        setSuccessMsg(`Product "${name}" successfully ${isEditMode ? 'updated' : 'created'}!`);
        if (!isEditMode) {
          // Reset form
          setName('');
          setShortDescription('');
          setDescription('');
          setSku('');
          setPrice('');
          setDiscountPrice('');
          setImages([]);
          setShippingInfo('');
          setMaterial('');
        } else {
          setTimeout(() => {
            navigate('/admin/products');
          }, 2000);
        }
      }
    } catch (err) {
      console.error('Error saving product:', err);
      alert('Failed to save product to catalog');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 pt-6 px-4">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-primary">{isEditMode ? 'Edit Product' : 'Add New Product'}</h1>
          <p className="text-dark/60 mt-1">{isEditMode ? 'Modify product details.' : 'Create a new premium fashion piece for your store.'}</p>
        </div>
        <button 
          onClick={handleSaveProduct}
          disabled={loading}
          className="btn-primary flex items-center gap-2 py-2.5 px-6 shadow-premium"
        >
          {loading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Save size={18} />
          )}
          {isEditMode ? 'Update Product' : 'Save Product'}
        </button>
      </div>

      {successMsg && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-xl flex items-center gap-3"
        >
          <CheckCircle2 className="text-green-600 flex-shrink-0" />
          <span className="text-xs font-semibold">{successMsg}</span>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Basic Info Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-2xl shadow-premium border border-cream"
          >
            <h3 className="text-lg font-heading font-bold text-primary mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-primary uppercase mb-1">Product Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-xs focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors text-dark" 
                  placeholder="e.g., Aurelia Satin Slip Dress" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-primary uppercase mb-1">Short Description</label>
                <textarea 
                  rows="2" 
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-xs focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors text-dark" 
                  placeholder="Brief summary for product catalog cards..."
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-primary uppercase mb-1">Full Description</label>
                <textarea 
                  rows="5" 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-xs focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors text-dark" 
                  placeholder="Detailed material composition, styling guidelines, and features..."
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-primary uppercase mb-1">Shipping & Returns</label>
                <textarea 
                  rows="3" 
                  value={shippingInfo}
                  onChange={(e) => setShippingInfo(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-xs focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors text-dark" 
                  placeholder="Shipping details and return policy..."
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-primary uppercase mb-1">Composition & Material</label>
                <input 
                  type="text" 
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-xs focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors text-dark" 
                  placeholder="e.g., Premium Silk, Soft Inner Lining" 
                />
              </div>
            </div>
          </motion.div>

          {/* Media Upload Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-premium border border-cream"
          >
            <h3 className="text-lg font-heading font-bold text-primary mb-4">Product Media</h3>
            
            {/* Option A: Paste Image URL (Direct Link) */}
            <div className="mb-6">
              <label className="block text-[10px] font-bold text-primary uppercase mb-2">
                Option 1: Add Image by URL (e.g. Cloudinary link)
              </label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  placeholder="Paste Cloudinary secure URL here..."
                  className="flex-grow border border-gray-300 rounded-lg px-4 py-2 text-xs focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors text-dark" 
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="bg-primary text-white rounded-lg px-4 py-2 text-xs font-semibold hover:bg-primary/95 transition-colors"
                >
                  Add URL
                </button>
              </div>
              <p className="text-[10px] text-dark/50 mt-1">Paste your copied image link from your Cloudinary media library.</p>
            </div>

            <div className="relative flex py-2 items-center mb-6">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink mx-4 text-gray-400 text-[10px] uppercase font-bold">Or</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            {/* Option B: Upload File */}
            <div className="mb-6">
              <label className="block text-[10px] font-bold text-primary uppercase mb-2">
                Option 2: Upload Image File (Local server storage)
              </label>
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageFileChange}
                className="hidden" 
                id="admin-image-upload-file" 
              />
              <label
                htmlFor="admin-image-upload-file"
                className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-cream transition-colors cursor-pointer flex flex-col items-center justify-center"
              >
                <div className="w-10 h-10 bg-primary/5 rounded-full flex items-center justify-center mb-2">
                  {uploading ? (
                    <Loader2 className="text-primary animate-spin" size={20} />
                  ) : (
                    <Upload size={20} className="text-primary" />
                  )}
                </div>
                <p className="font-semibold text-xs text-dark">Click to browse from your computer</p>
              </label>
            </div>

            {/* Display Uploaded Images */}
            {images.length > 0 && (
              <div className="flex flex-wrap gap-4 mt-6 border-t border-gray-100 pt-6">
                {images.map((url, index) => (
                  <div key={index} className="w-20 aspect-[3/4] border border-cream rounded overflow-hidden relative shadow-sm">
                    <img src={url} alt={`upload-${index}`} className="w-full h-full object-cover" />
                    <button 
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
                    >
                      <X size={12} />
                    </button>
                    {index === 0 && (
                      <span className="absolute bottom-0 left-0 right-0 bg-gold text-white text-[8px] text-center font-bold uppercase py-0.5">
                        Cover
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Sizes & Colors & Inventory Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-2xl shadow-premium border border-cream space-y-6"
          >
            {/* Sizes */}
            <div>
              <h3 className="text-base font-heading font-bold text-primary mb-3">Sizes</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'].map((sz) => {
                  const isSelected = sizes.includes(sz);
                  return (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          setSizes(prev => sortSizes(prev.filter(x => x !== sz)));
                        } else {
                          setSizes(prev => sortSizes([...prev, sz]));
                        }
                      }}
                      className={`px-3 py-1.5 border text-xs font-semibold rounded-lg transition-colors ${
                        isSelected
                          ? 'bg-gold border-gold text-white shadow-premium'
                          : 'bg-white border-gray-200 text-primary hover:border-gold'
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-2">
                <input
                  ref={sizeInputRef}
                  type="text"
                  value={sizeInput}
                  onChange={e => setSizeInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addSize()}
                  placeholder="Add custom size (e.g. Free Size)"
                  className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-xs focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors text-dark"
                />
                <button
                  type="button"
                  onClick={addSize}
                  className="px-5 py-2.5 border border-gray-200 rounded-lg text-xs font-semibold text-primary hover:bg-cream/60 transition-colors"
                >
                  Add Custom
                </button>
              </div>
              {sizes.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {sizes.map(s => (
                    <span key={s} className="flex items-center gap-1.5 bg-cream/60 text-primary text-xs font-semibold px-3 py-1.5 rounded-full border border-cream">
                      {s}
                      <button onClick={() => removeSize(s)} className="text-red-400 hover:text-red-600 ml-0.5">
                        <X size={11} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Colors */}
            <div>
              <h3 className="text-base font-heading font-bold text-primary mb-3">Colors</h3>
              <div className="flex gap-2">
                <input
                  ref={colorInputRef}
                  type="text"
                  value={colorInput}
                  onChange={e => setColorInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addColor()}
                  placeholder="Add color (e.g. Red, Royal Blue)"
                  className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-xs focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors text-dark"
                />
                <button
                  type="button"
                  onClick={addColor}
                  className="px-5 py-2.5 border border-gray-200 rounded-lg text-xs font-semibold text-primary hover:bg-cream/60 transition-colors"
                >
                  Add
                </button>
              </div>
              {colors.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {colors.map(c => (
                    <span key={c} className="flex items-center gap-1.5 bg-cream/60 text-primary text-xs font-semibold px-3 py-1.5 rounded-full border border-cream">
                      {c}
                      <button onClick={() => removeColor(c)} className="text-red-400 hover:text-red-600 ml-0.5">
                        <X size={11} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Stock Quantity */}
            <div>
              <h3 className="text-base font-heading font-bold text-primary mb-3">Stock Quantity</h3>
              <input
                type="number"
                value={stockQuantity}
                onChange={e => setStockQuantity(e.target.value)}
                min="0"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-xs focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors text-dark"
                placeholder="e.g. 10"
              />
              <p className="text-[10px] text-dark/40 mt-1">This stock applies to each size × color combination.</p>
            </div>
          </motion.div>

        </div>

        {/* Right Column - Sidebar Details */}
        <div className="space-y-6">
          
          {/* Category Selection */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-2xl shadow-premium border border-cream"
          >
            <h3 className="text-lg font-heading font-bold text-primary mb-4">Organization</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-primary uppercase mb-1">Target Category</label>
                <select 
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-xs focus:outline-none focus:border-gold bg-white text-dark font-medium"
                >
                  <option value="c1111111-1111-1111-1111-111111111111">Sharara</option>
                  <option value="c2222222-2222-2222-2222-222222222222">Tops</option>
                  <option value="c3333333-3333-3333-3333-333333333333">Short Kurti</option>
                  <option value="c4444444-4444-4444-4444-444444444444">Long Kurti</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-primary uppercase mb-1">Style Tags (comma-separated)</label>
                <input 
                  type="text" 
                  value={tagsText}
                  onChange={(e) => setTagsText(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-xs focus:outline-none focus:border-gold text-dark" 
                  placeholder="Festive, Silk, Green" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-primary uppercase mb-1">SKU Reference</label>
                <input 
                  type="text" 
                  value={sku}
                  onChange={(e) => setSku(e.target.value.toUpperCase())}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-xs focus:outline-none focus:border-gold text-dark font-mono font-bold" 
                  placeholder="e.g. VEL-DR-AUR" 
                />
              </div>
            </div>
          </motion.div>

          {/* Pricing Info */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-premium border border-cream"
          >
            <h3 className="text-lg font-heading font-bold text-primary mb-4">Pricing</h3>
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-primary uppercase mb-1">Base Price (₹)</label>
                <input 
                  type="number" 
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-xs focus:outline-none focus:border-gold text-dark" 
                  placeholder="2999" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-primary uppercase mb-1">Discount Price (₹, optional)</label>
                <input 
                  type="number" 
                  value={discountPrice}
                  onChange={(e) => setDiscountPrice(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-xs focus:outline-none focus:border-gold text-dark" 
                  placeholder="2499" 
                />
              </div>
            </div>
          </motion.div>

          {/* Flags and Visibility */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-2xl shadow-premium border border-cream"
          >
            <h3 className="text-lg font-heading font-bold text-primary mb-4">Product Status Flags</h3>
            <div className="space-y-3 text-xs font-medium text-primary">
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 accent-gold text-gold rounded border-gray-300 focus:ring-gold" 
                />
                <span>Active (Show in catalog)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={isNewArrival}
                  onChange={(e) => setIsNewArrival(e.target.checked)}
                  className="w-4 h-4 accent-gold text-gold rounded border-gray-300 focus:ring-gold" 
                />
                <span>Mark as New Arrival</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 accent-gold text-gold rounded border-gray-300 focus:ring-gold" 
                />
                <span>Mark as Featured Product</span>
              </label>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default ProductEdit;
