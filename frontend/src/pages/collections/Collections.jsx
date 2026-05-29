import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Collections = () => {
  const collections = [
    {
      title: "Editorial Luxury",
      subtitle: "Fluid cowls, heavy satins, and romantic silhouettes.",
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200",
      link: "/shop?collection=Editorial Luxury",
      gridSpan: "md:col-span-2"
    },
    {
      title: "Minimalist Essentials",
      subtitle: "Tailored structures, organic linen knits, and clean neutral palettes.",
      image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=800&auto=format&fit=crop",
      link: "/shop?collection=Minimalist Essentials",
      gridSpan: "md:col-span-1"
    },
    {
      title: "Artisanal Jewellery",
      subtitle: "Irregular baroque pearls on 18k gold plated silver hoops.",
      image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop",
      link: "/shop?collection=Artisanal Jewellery",
      gridSpan: "md:col-span-1"
    },
    {
      title: "Sunset Soiree",
      subtitle: "Golden hour slip dresses and cocktail wear.",
      image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1200",
      link: "/shop?category=dresses",
      gridSpan: "md:col-span-2"
    }
  ];

  return (
    <div className="bg-white min-h-screen py-16 px-4 md:px-8">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center max-w-lg mx-auto mb-16">
          <span className="text-gold uppercase tracking-widest text-xs font-semibold">Veloura Lookbook</span>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary mt-2">Curated Collections</h1>
          <div className="w-12 h-[2px] bg-gold mx-auto mt-4 mb-6"></div>
          <p className="text-dark/70 font-light text-sm">
            Explore editorial styles and wardrobe foundations designed with premium fabrics and silhouettes.
          </p>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 auto-rows-[360px]">
          {collections.map((col, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              key={idx}
              className={`group overflow-hidden rounded relative border border-cream shadow-sm flex flex-col justify-end p-6 ${col.gridSpan}`}
            >
              {/* Background image */}
              <div className="absolute inset-0 bg-primary/20 z-10 transition-colors group-hover:bg-primary/30 duration-300" />
              <img
                src={col.image}
                alt={col.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Text info */}
              <div className="relative z-20 text-white">
                <h3 className="font-heading font-bold text-2xl tracking-wide">{col.title}</h3>
                <p className="text-xs text-white/80 font-light mt-1.5 max-w-md">{col.subtitle}</p>
                <div className="mt-4">
                  <Link
                    to={col.link}
                    className="inline-flex items-center gap-2 border-b border-white text-xs font-semibold uppercase tracking-wider pb-1 hover:text-gold hover:border-gold transition-colors"
                  >
                    Explore pieces &rarr;
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collections;
