import { Link } from 'react-router-dom';

const ShippingPolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-primary text-white py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-8 max-w-[980px]">
          <p className="text-xs uppercase tracking-[0.35em] text-gold mb-4">Customer Care</p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4 text-white">Shipping Policy</h1>
          <p className="text-white/75 max-w-2xl leading-relaxed">
            Clear, reliable delivery information for every Veloura order.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-8 max-w-[980px]">
          <div className="bg-cream rounded-2xl border border-cream-dark p-6 md:p-10 shadow-premium">
            <div className="space-y-8 text-dark/80 leading-relaxed">
              <div>
                <h2 className="font-heading text-2xl font-bold text-primary mb-3">Order Processing</h2>
                <p>All orders are processed within 2 to 3 business days after successful payment confirmation.</p>
              </div>

              <div>
                <h2 className="font-heading text-2xl font-bold text-primary mb-3">Delivery Timeline</h2>
                <p className="mb-2">Metro Cities: 7 to 8 business days</p>
                <p className="mb-2">Other Locations: 9 to 10 business days</p>
                <p>Delivery timelines may vary due to unforeseen circumstances or courier delays.</p>
              </div>

              <div>
                <h2 className="font-heading text-2xl font-bold text-primary mb-3">Order Tracking</h2>
                <p>Once your order is shipped, a tracking link will be sent to your registered email or phone number.</p>
              </div>

              <div>
                <h2 className="font-heading text-2xl font-bold text-primary mb-3">Cash on Delivery</h2>
                <p>Cash on Delivery (COD) is not available. All orders must be prepaid using the available online payment methods.</p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gold/20 flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-dark/60">Need help with an order?</p>
              <Link to="/contact" className="text-sm font-semibold text-gold hover:underline">Contact support</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ShippingPolicy;
