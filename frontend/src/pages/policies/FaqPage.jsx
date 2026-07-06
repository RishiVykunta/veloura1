import { Link } from 'react-router-dom';

const faqs = [
  {
    q: 'How long does delivery take?',
    a: 'Orders are typically delivered within 7 to 10 business days, depending on your location.',
  },
  {
    q: 'How can I track my order?',
    a: 'Once your order is shipped, you will receive a tracking link via email or SMS/WhatsApp.',
  },
  {
    q: 'Do you offer Cash on Delivery (COD)?',
    a: 'No. We currently accept prepaid online payments only.',
  },
  {
    q: 'Can I return my order?',
    a: 'No. We do not accept returns.',
  },
  {
    q: 'Do you offer refunds?',
    a: 'No. All purchases are final, and refunds are not available.',
  },
  {
    q: 'Can I exchange my product?',
    a: 'Yes. We offer size exchanges within 7 days of delivery, subject to stock availability and product condition.',
  },
  {
    q: 'What condition must the product be in for an exchange?',
    a: 'The product must be unused, unwashed, in original packaging, with all tags attached, and free from stains, perfumes, or damage.',
  },
  {
    q: 'What if I receive a damaged or incorrect product?',
    a: 'Please contact us within 24 hours with your order number and clear photos. We will review the request and arrange a replacement or exchange if applicable.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept UPI, credit cards, debit cards, net banking, and popular digital wallets where available.',
  },
  {
    q: 'Can I cancel my order?',
    a: 'Orders cannot be cancelled once they have been confirmed and processed.',
  },
  {
    q: 'Do you ship across India?',
    a: 'Yes. We deliver to most serviceable locations across India.',
  },
  {
    q: 'Are your products authentic?',
    a: 'Yes. Every product sold by Veloura is carefully selected and quality-checked before shipping.',
  },
  {
    q: 'How do I choose the correct size?',
    a: 'Please refer to the Size Guide on each product page before placing your order.',
  },
  {
    q: 'What if my size is unavailable?',
    a: 'If your preferred size is out of stock, you can contact our support team for assistance.',
  },
  {
    q: 'Can I modify my order after placing it?',
    a: 'Once an order has been placed, modifications may not be possible. Contact us immediately if you need help.',
  },
  {
    q: 'What happens if my package is delayed?',
    a: 'Delays may occur due to weather, holidays, or courier issues. We appreciate your patience.',
  },
  {
    q: "What should I do if my order shows as delivered but I haven't received it?",
    a: 'Please contact us within 24 hours so we can investigate with our delivery partner.',
  },
  {
    q: 'How can I contact customer support?',
    a: 'You can reach us via email at theofficialveloura@gmail.com, Monday to Saturday, 10:00 AM to 7:00 PM IST.',
  },
  {
    q: 'Will I receive an invoice?',
    a: 'Yes. A digital invoice will be sent to your registered email after your order is confirmed.',
  },
  {
    q: 'How do I know when a product is back in stock?',
    a: 'Follow our social media pages or contact our support team for availability updates.',
  },
];

const FaqPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-primary text-white py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-8 max-w-[980px]">
          <p className="text-xs uppercase tracking-[0.35em] text-gold mb-4">Customer Care</p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4 text-white">Frequently Asked Questions</h1>
          <p className="text-white/75 max-w-2xl leading-relaxed">
            Answers to the most common questions about orders, delivery, exchanges, and support.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-8 max-w-[980px]">
          <div className="space-y-4">
            {faqs.map((item) => (
              <details key={item.q} className="group bg-cream rounded-2xl border border-cream-dark px-5 py-4 shadow-premium">
                <summary className="cursor-pointer list-none flex items-center justify-between gap-4 font-heading text-lg md:text-xl font-bold text-primary">
                  <span>{item.q}</span>
                  <span className="text-gold transition-transform duration-300 group-open:rotate-45">+</span>
                </summary>
                <p className="mt-4 text-dark/75 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-gold/20 flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-dark/60">Need something else answered?</p>
            <Link to="/contact" className="text-sm font-semibold text-gold hover:underline">Contact us</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FaqPage;
