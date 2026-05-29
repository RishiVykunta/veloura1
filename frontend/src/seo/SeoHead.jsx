import React from 'react';
import { Helmet } from 'react-helmet-async';

const SeoHead = ({ 
  title = "Veloura | Premium Women's Fashion", 
  description = "Discover our latest arrivals featuring soft feminine aesthetics, premium fabrics, and Pinterest-inspired styles curated just for you.", 
  image = "https://veloura.com/default-og-image.jpg", 
  url = "https://veloura.com", 
  type = "website",
  schemaMarkup = null
}) => {
  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Structured Data (Schema.org) */}
      {schemaMarkup && (
        <script type="application/ld+json">
          {JSON.stringify(schemaMarkup)}
        </script>
      )}
    </Helmet>
  );
};

export default SeoHead;
