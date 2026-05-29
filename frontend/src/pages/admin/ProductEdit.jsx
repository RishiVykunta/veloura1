import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, Plus, Save, Loader2, CheckCircle2 } from 'lucide-react';
import { uploadService } from '../../services/upload.service';
import { productService } from '../../services/product.service';

const ProductEdit = () => {
  // Form States
  const [name, setName] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [categoryId, setCategoryId] = useState('c1111111-1111-1111-1111-111111111111');
  const [tagsText, setTagsText] = useState('Festive, Silk, Green');
  
  // Flags
  const [isActive, setIsActive] = useState(true);
  const [isNewArrival, setIsNewArrival] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);

  // Media states
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Sizes Table state
  const [sizes, setSizes] = useState([
    { size: 'S', stock: 10 },
    { size: 'M', stock: 15 },
    { size: 'L', stock: 10 }
  ]);

  // UI Response states
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

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
      alert('Upload failed: server connection error');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (idxToRemove) => {
    setImages((prev) => prev.filter((_, idx) => idx !== idxToRemove));
  };

  const addSizeRow = () => {
    const nextSize = prompt('Enter size code (e.g. XS, XL, XXL):', 'XL');
    if (!nextSize) return;
    setSizes((prev) => [...prev, { size: nextSize.toUpperCase(), stock: 10 }]);
  };

  const removeSizeRow = (idxToRemove) => {
    setSizes((prev) => prev.filter((_, idx) => idx !== idxToRemove));
  };

  const handleSizeStockChange = (idx, value) => {
    const updated = [...sizes];
    updated[idx].stock = parseInt(value) || 0;
    setSizes(updated);
  };

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

      // Compile variants SKUs
      const variants = sizes.map((s) => ({
        size: s.size,
        color: 'Gold', // Standard premium accent fallback
        colorHex: '#D4AF37',
        stock: s.stock,
        sku: `${sku}-${s.size}`
      }));

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
        isFeatured
      };

      const res = await productService.createProduct(productPayload);
      if (res.success) {
        setSuccessMsg(`Product "${name}" successfully created!`);
        // Reset form
        setName('');
        setShortDescription('');
        setDescription('');
        setSku('');
        setPrice('');
        setDiscountPrice('');
        setImages([]);
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
          <h1 className="text-3xl font-heading font-bold text-primary">Add New Product</h1>
          <p className="text-dark/60 mt-1">Create a new premium fashion piece for your store.</p>
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
          Save Product
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
            
            <input 
              type="file" 
              accept="image/*"
              onChange={handleImageFileChange}
              className="hidden" 
              id="admin-image-upload-file" 
            />

            <label
              htmlFor="admin-image-upload-file"
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-cream transition-colors cursor-pointer flex flex-col items-center justify-center"
            >
              <div className="w-12 h-12 bg-primary/5 rounded-full flex items-center justify-center mb-3">
                {uploading ? (
                  <Loader2 className="text-primary animate-spin" size={24} />
                ) : (
                  <Upload size={24} className="text-primary" />
                )}
              </div>
              <p className="font-semibold text-xs text-dark">Click to browse from your computer</p>
              <p className="text-[10px] text-dark/50 mt-1">Image uploads connect to Cloudinary API</p>
            </label>

            {/* Display Uploaded Images */}
            {images.length > 0 && (
              <div className="flex flex-wrap gap-4 mt-6">
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

          {/* Sizes & Inventory Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-2xl shadow-premium border border-cream"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-heading font-bold text-primary">Sizes & Inventory</h3>
              <button 
                onClick={addSizeRow}
                className="text-gold text-xs font-semibold flex items-center hover:underline"
              >
                <Plus size={14} className="mr-0.5"/> Add Size Row
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-cream">
                    <th className="py-2.5 font-bold text-primary">Size</th>
                    <th className="py-2.5 font-bold text-primary">Suffix SKU</th>
                    <th className="py-2.5 font-bold text-primary">Stock Count</th>
                    <th className="py-2.5 font-bold text-primary text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sizes.map((row, idx) => (
                    <tr key={idx} className="border-b border-cream/30 last:border-0">
                      <td className="py-2.5 font-semibold text-primary">{row.size}</td>
                      <td className="py-2.5 text-dark/70 font-mono">{sku ? `${sku}-${row.size}` : `[SKU]-${row.size}`}</td>
                      <td className="py-2.5">
                        <input 
                          type="number" 
                          value={row.stock}
                          onChange={(e) => handleSizeStockChange(idx, e.target.value)}
                          className="border border-cream rounded px-2 py-1 w-16 text-center outline-none focus:border-gold" 
                        />
                      </td>
                      <td className="py-2.5 text-center">
                        <button 
                          onClick={() => removeSizeRow(idx)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                  <option value="c1111111-1111-1111-1111-111111111111">Dresses</option>
                  <option value="c2222222-2222-2222-2222-222222222222">Tops</option>
                  <option value="c3333333-3333-3333-3333-333333333333">Bottoms</option>
                  <option value="c4444444-4444-4444-4444-444444444444">Accessories</option>
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
