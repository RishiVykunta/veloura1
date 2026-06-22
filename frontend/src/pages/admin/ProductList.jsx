import React from 'react';
import { motion } from 'framer-motion';
import { Ghost } from 'lucide-react';

const ProductList = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-heading font-bold text-primary">Products</h1>
      </div>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white p-12 rounded-2xl shadow-premium border border-cream flex flex-col items-center justify-center text-center"
      >
        <div className="w-20 h-20 bg-cream/50 rounded-full flex items-center justify-center mb-6">
          <Ghost size={40} className="text-primary/40" />
        </div>
        <h3 className="text-xl font-heading font-bold text-primary mb-2">No data available</h3>
        <p className="text-dark/60 max-w-md">
          Once your business launches and you start receiving products, they will appear here.
        </p>
      </motion.div>
    </div>
  );
};

export default ProductList;
