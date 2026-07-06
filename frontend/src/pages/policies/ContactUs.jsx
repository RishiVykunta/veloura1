import { MessageCircle } from 'lucide-react';

const ContactUs = () => {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-primary text-white py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-8 max-w-[980px]">
          <p className="text-xs uppercase tracking-[0.35em] text-gold mb-4">Customer Care</p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4 text-white">Contact Us</h1>
          <p className="text-white/75 max-w-2xl leading-relaxed">
            We&apos;re here to help with orders, shipping, exchanges, and anything else you need.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-8 max-w-[980px]">
          <div className="grid md:grid-cols-[1.1fr_0.9fr] gap-6">
            <div className="bg-cream rounded-2xl border border-cream-dark p-6 md:p-10 shadow-premium">
              <h2 className="font-heading text-2xl font-bold text-primary mb-4">Get in touch</h2>
              <p className="text-dark/75 leading-relaxed mb-6">
                For customer support, product questions, order help, or exchange requests, please reach out and
                we&apos;ll respond as soon as possible.
              </p>

              <div className="space-y-4">
                <div className="rounded-xl bg-white border border-cream-dark p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-gold mb-2">Email</p>
                  <a
                    href="mailto:theofficialveloura@gmail.com"
                    className="text-lg font-semibold text-primary hover:text-gold transition-colors"
                  >
                    theofficialveloura@gmail.com
                  </a>
                </div>

                <div className="rounded-xl bg-white border border-cream-dark p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-gold mb-2">WhatsApp</p>
                  <a
                    href="https://wa.me/919999999999"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-lg font-semibold text-primary hover:text-gold transition-colors"
                  >
                    <MessageCircle size={18} className="text-[#25D366]" />
                    Message us on WhatsApp
                  </a>
                </div>

                <div className="rounded-xl bg-white border border-cream-dark p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-gold mb-2">Business Hours</p>
                  <p className="text-dark/75">Monday to Saturday, 10:00 AM to 7:00 PM IST</p>
                </div>
              </div>
            </div>

            <div className="bg-primary text-white rounded-2xl p-6 md:p-10 shadow-premium">
              <h2 className="font-heading text-2xl font-bold mb-4 text-white">Veloura Support</h2>
              <p className="text-white/75 leading-relaxed mb-6">
                Timeless Elegance. Modern Confidence. We value every message and make every customer interaction feel
                personal, clear, and dependable.
              </p>
              <div className="space-y-3 text-sm">
                <p className="text-white">✦ Order assistance and delivery updates</p>
                <p className="text-white">✦ Size exchange and product guidance</p>
                <p className="text-white">✦ Policy support and after-purchase help</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
