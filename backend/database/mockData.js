const mockCategories = [
  {
    id: "f",
    name: "Dresses",
    slug: "dresses",
    description: "Sleek silhouettes, romantic slips, and effortless daywear.",
    imageUrl: "https://res.cloudinary.com/dqcxekzxn/image/upload/v1779815830/WhatsApp_Image_2026-05-26_at_10.36.46_PM_re74eo.jpg",
    isActive: true
  },
  {
    id: "f",
    name: "Tops",
    slug: "tops",
    description: "Premium basics, tailored shirts, and statement corsets.",
    imageUrl: "https://res.cloudinary.com/dqcxekzxn/image/upload/v1779815830/WhatsApp_Image_2026-05-26_at_10.36.46_PM_re74eo.jpg",
    isActive: true
  },
  {
    id: "f",
    name: "Bottoms",
    slug: "bottoms",
    description: "Tailored trousers, structured denim, and linen skirts.",
    imageUrl: "https://res.cloudinary.com/dqcxekzxn/image/upload/v1779815830/WhatsApp_Image_2026-05-26_at_10.36.46_PM_re74eo.jpg",
    isActive: true
  },
  {
    id: "f",
    name: "Accessories",
    slug: "accessories",
    description: "Finishing touches, sculptural jewelry, and leather goods.",
    imageUrl: "https://res.cloudinary.com/dqcxekzxn/image/upload/v1779815830/WhatsApp_Image_2026-05-26_at_10.36.46_PM_re74eo.jpg",
    isActive: true
  }
];

const mockBanners = [
  {
    id: "f",
    title: "Elegance Reimagined",
    subtitle: "New Collection 2026 — Soft Luxury & Editorial Outfits",
    bannerType: "hero",
    desktopImageUrl: "https://res.cloudinary.com/dqcxekzxn/image/upload/v1780155306/WhatsApp_Image_2026-05-29_at_10.06.09_AM_hexvgh.jpg",
    mobileImageUrl: "https://res.cloudinary.com/dqcxekzxn/image/upload/v1780155306/WhatsApp_Image_2026-05-29_at_10.06.09_AM_hexvgh.jpg",
    redirectUrl: "/shop",
    sortOrder: 1,
    isActive: true
  },
  {
    id: "f",
    title: "Summer Knitwear",
    subtitle: "Breathable yarns, curated tones",
    bannerType: "promo",
    desktopImageUrl: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=1200&auto=format&fit=crop",
    mobileImageUrl: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=600&auto=format&fit=crop",
    redirectUrl: "/shop?collection=knitwear",
    sortOrder: 2,
    isActive: true
  }
];

const mockProducts = [
  {
    id: "f",
    name: "Aurelia Satin Slip Dress",
    slug: "aurelia-satin-slip-dress",
    shortDescription: "A liquid-like cowl neck satin slip dress designed for golden hour.",
    description: "The Aurelia Slip Dress is crafted from a heavy-weight, high-shine satin that drapes beautifully over the body. Features an adjustable cross-back detail, double lining for security, and a elegant side slit. Perfect for evening dinners, cocktails, or romantic lookbooks.",
    sku: "VEL-DR-AUR-001",
    categoryId: "f",
    price: 3499.00,
    discountPrice: 2999.00,
    stockQuantity: 24,
    material: "Satin Polyester",
    shippingInfo: "Shipped in editorial eco-luxury packaging. Free delivery on orders above ₹1999.",
    occasionType: "Evening",
    collectionType: "Editorial Luxury",
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: true,
    isActive: true,
    averageRating: 4.8,
    totalReviews: 12,
    images: [
      { imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop", isPrimary: true },
      { imageUrl: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=800&auto=format&fit=crop", isPrimary: false }
    ],
    variants: [
      { id: "v1-1", size: "S", color: "Gold", colorHex: "#D4AF37", stock: 10, sku: "VEL-DR-AUR-001-S-GLD" },
      { id: "v1-2", size: "M", color: "Gold", colorHex: "#D4AF37", stock: 8, sku: "VEL-DR-AUR-001-M-GLD" },
      { id: "v1-3", size: "L", color: "Gold", colorHex: "#D4AF37", stock: 6, sku: "VEL-DR-AUR-001-L-GLD" },
      { id: "v1-4", size: "S", color: "Navy", colorHex: "#0B1F3A", stock: 5, sku: "VEL-DR-AUR-001-S-NVY" }
    ],
    features: [
      "Heavy-weight liquid drape fabric",
      "Adjustable cross-back spaghetti straps",
      "Side leg slit",
      "Cowl neckline"
    ],
    tags: ["slip dress", "satin", "evening", "gold"]
  },
  {
    id: "f",
    name: "Seraphina Tailored Trousers",
    slug: "seraphina-tailored-trousers",
    shortDescription: "High-rise pleated trousers with a wide-leg fluid drape.",
    description: "The Seraphina pleated trousers offer an effortless blend of workwear structure and relaxed tailoring. Designed with a wide leg, double pleats at the waist, functional side pockets, and a clean belt loop waistband. Made from a fluid linen-rayon blend.",
    sku: "VEL-BT-SER-002",
    categoryId: "f",
    price: 2499.00,
    discountPrice: null,
    stockQuantity: 15,
    material: "Linen Rayon Blend",
    shippingInfo: "Ships within 24-48 hours. Returns accepted within 14 days.",
    occasionType: "Casual / Formal",
    collectionType: "Minimalist Essentials",
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: true,
    isActive: true,
    averageRating: 4.5,
    totalReviews: 8,
    images: [
      { imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop", isPrimary: true },
      { imageUrl: "https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?q=80&w=800&auto=format&fit=crop", isPrimary: false }
    ],
    variants: [
      { id: "v2-1", size: "S", color: "Cream", colorHex: "#F8F5EE", stock: 5, sku: "VEL-BT-SER-002-S-CRM" },
      { id: "v2-2", size: "M", color: "Cream", colorHex: "#F8F5EE", stock: 5, sku: "VEL-BT-SER-002-M-CRM" },
      { id: "v2-3", size: "L", color: "Cream", colorHex: "#F8F5EE", stock: 5, sku: "VEL-BT-SER-002-L-CRM" }
    ],
    features: [
      "High-rise structured waist",
      "Double front pleats",
      "Relaxed wide leg fit",
      "Belt loops and functional pockets"
    ],
    tags: ["trousers", "pleated", "wide leg", "cream"]
  },
  {
    id: "f",
    name: "Lyra Linen Ribbed Crop Top",
    slug: "lyra-linen-ribbed-crop-top",
    shortDescription: "A minimalist knit ribbed crop top with clean shoulder straps.",
    description: "Breathable and stretch-fit, the Lyra Crop Top is knitted with organic linen yarns for a luxurious rib texture. High neckline, fitted bodice, and crop length makes it the perfect coordinate for high-waisted linen trousers or skirts.",
    sku: "VEL-TP-LYR-003",
    categoryId: "f",
    price: 1599.00,
    discountPrice: 1299.00,
    stockQuantity: 40,
    material: "Organic Linen Knit",
    shippingInfo: "Ships within 24 hours. Free express shipping above ₹1999.",
    occasionType: "Daywear",
    collectionType: "Minimalist Essentials",
    isFeatured: false,
    isBestSeller: true,
    isNewArrival: true,
    isActive: true,
    averageRating: 4.6,
    totalReviews: 18,
    images: [
      { imageUrl: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800&auto=format&fit=crop", isPrimary: true },
      { imageUrl: "https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?q=80&w=800&auto=format&fit=crop", isPrimary: false }
    ],
    variants: [
      { id: "v3-1", size: "XS", color: "Sage", colorHex: "#8FBC8F", stock: 10, sku: "VEL-TP-LYR-003-XS-SGE" },
      { id: "v3-2", size: "S", color: "Sage", colorHex: "#8FBC8F", stock: 10, sku: "VEL-TP-LYR-003-S-SGE" },
      { id: "v3-3", size: "M", color: "Sage", colorHex: "#8FBC8F", stock: 10, sku: "VEL-TP-LYR-003-M-SGE" },
      { id: "v3-4", size: "L", color: "Sage", colorHex: "#8FBC8F", stock: 10, sku: "VEL-TP-LYR-003-L-SGE" }
    ],
    features: [
      "Textured ribbed knit construction",
      "Breathable organic linen weave",
      "Double-stitched straps",
      "Supportive elastic underbust band"
    ],
    tags: ["crop top", "ribbed", "linen", "sage"]
  },
  {
    id: "f",
    name: "Baroque Pearl Drop Earrings",
    slug: "baroque-pearl-drop-earrings",
    shortDescription: "Irregular sculptural freshwater baroque pearls on 18k gold plated hoops.",
    description: "Each Baroque Pearl Drop Earring is completely unique, highlighting natural organic contours. Features sculptural 18k gold plated sterling silver huggie hoops, lightweight design, and removable pearl charms. Made for everyday luxury accessorizing.",
    sku: "VEL-AC-PRL-004",
    categoryId: "f",
    price: 1899.00,
    discountPrice: 1699.00,
    stockQuantity: 50,
    material: "18k Gold Plated Sterling Silver & Freshwater Pearls",
    shippingInfo: "Packaged in our editorial drawer jewelry box with velvet insert. Free tracking included.",
    occasionType: "Everyday Luxury",
    collectionType: "Artisanal Jewellery",
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    isActive: true,
    averageRating: 4.9,
    totalReviews: 23,
    images: [
      { imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop", isPrimary: true }
    ],
    variants: [
      { id: "v4-1", size: "O/S", color: "Gold / Pearl", colorHex: "#E5D3B3", stock: 50, sku: "VEL-AC-PRL-004-OS" }
    ],
    features: [
      "Genuine unique baroque freshwater pearls",
      "18k gold plated sterling silver hoops",
      "Removable pearl charm for dual style",
      "Hypoallergenic nickel-free posts"
    ],
    tags: ["earrings", "pearl", "gold", "jewelry"]
  },
  {
    id: "f",
    name: "Selene Linen Vest & Trousers Set",
    slug: "selene-linen-vest-trousers-set",
    shortDescription: "Coordinating tailored vest and high-waist trousers in soft oat linen.",
    description: "The Selene Set is the ultimate editorial summer suit. Comprises a fitted, button-up waistcoat with a V-neckline and pointed hem, and matching tailored linen trousers. Lightweight, fully lined vest, and relaxed trouser drape.",
    sku: "VEL-CO-SEL-005",
    categoryId: "f",
    price: 5299.00,
    discountPrice: 4599.00,
    stockQuantity: 12,
    material: "Pure Linen & Viscose Lining",
    shippingInfo: "Shipped in luxury garment box. Signature required on delivery.",
    occasionType: "Day-to-Night",
    collectionType: "Editorial Luxury",
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: true,
    isActive: true,
    averageRating: 4.7,
    totalReviews: 7,
    images: [
      { imageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop", isPrimary: true }
    ],
    variants: [
      { id: "v5-1", size: "S", color: "Oat", colorHex: "#EAE6DF", stock: 4, sku: "VEL-CO-SEL-005-S-OAT" },
      { id: "v5-2", size: "M", color: "Oat", colorHex: "#EAE6DF", stock: 4, sku: "VEL-CO-SEL-005-M-OAT" },
      { id: "v5-3", size: "L", color: "Oat", colorHex: "#EAE6DF", stock: 4, sku: "VEL-CO-SEL-005-L-OAT" }
    ],
    features: [
      "Two-piece coordinating tailored vest and pants",
      "V-neck vest with tailored button closures",
      "Pleated high-rise wide-leg pants",
      "Breathable pure linen construction"
    ],
    tags: ["linen", "co-ord set", "vest", "oat"]
  }
];

module.exports = {
  mockCategories,
  mockBanners,
  mockProducts
};
