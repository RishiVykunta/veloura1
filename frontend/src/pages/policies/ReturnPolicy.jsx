import { Link } from 'react-router-dom';

const ReturnPolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-primary text-white py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-8 max-w-[980px]">
          <p className="text-xs uppercase tracking-[0.35em] text-gold mb-4">Customer Care</p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">Return, Refund & Exchange Policy</h1>
          <p className="text-white/75 max-w-2xl leading-relaxed">
            We want every Veloura order to feel premium, transparent, and easy to understand.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-8 max-w-[980px]">
          <div className="bg-cream rounded-2xl border border-cream-dark p-6 md:p-10 shadow-premium">
            <div className="space-y-8 text-dark/80 leading-relaxed">
              <div>
                <h2 className="font-heading text-2xl font-bold text-primary mb-3">Returns</h2>
                <p>We do not accept returns on any products.</p>
              </div>

              <div>
                <h2 className="font-heading text-2xl font-bold text-primary mb-3">Refunds</h2>
                <p>We do not offer refunds once an order has been placed and delivered.</p>
              </div>

              <div>
                <h2 className="font-heading text-2xl font-bold text-primary mb-3">Exchanges</h2>
                <p className="mb-2">We offer size exchanges only, subject to the following conditions:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Exchange requests must be made within 7 days of delivery.</li>
                  <li>The product must be unused, unwashed, undamaged, and in its original packaging with all tags attached.</li>
                  <li>Exchange is subject to availability of the requested size.</li>
                  <li>If the requested size is unavailable, store credit or another available size may be offered.</li>
                  <li>Customers are responsible for exchange shipping charges unless the wrong or defective item was sent by us.</li>
                </ul>
              </div>

              <div>
                <h2 className="font-heading text-2xl font-bold text-primary mb-3">Damaged or Incorrect Products</h2>
                <p className="mb-2">If you receive a damaged, defective, or incorrect product, please contact us within 24 hours of delivery with:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Your order number</li>
                  <li>Clear photos of the product</li>
                  <li>An unboxing video, recommended for faster verification</li>
                </ul>
                <p className="mt-4">After verification, we will arrange a replacement or exchange at no additional cost.</p>
              </div>

              <div className="rounded-xl bg-white p-4 border border-cream-dark">
                <p className="text-sm text-dark/70 mb-1">Contact</p>
                <a href="mailto:theofficialveloura@gmail.com" className="text-gold font-semibold hover:underline">
                  theofficialveloura@gmail.com
                </a>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gold/20 flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-dark/60">Questions about exchanges?</p>
              <Link to="/contact" className="text-sm font-semibold text-gold hover:underline">Reach us here</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ReturnPolicy;
