export default function About() {
  const testimonials = [
    {
      id: 1,
      name: 'Sriprakash Dubey',
      rating: 5,
      text: 'All my office stationery and print go through laxmi trade only very elegant service and all office stationery available here. Thank you',
    },
    {
      id: 2,
      name: 'Ashnir Aneja',
      rating: 4,
      text: 'Clear quality photos with latest printers Almost everything available in stationery under one roof',
    },
    {
      id: 3,
      name: 'Toofar Kerkatta',
      rating: 5,
      text: 'I got school stationary form laxmi trade got variety of decoration items and chart paper various colour range thank you laxmi trade',
    },
    {
      id: 4,
      name: 'Sanket Kadam',
      rating: 5,
      text: 'I am very impressed with the level of service I received.',
    },
    {
      id: 5,
      name: 'Venkatesh Thanda',
      rating: 5,
      text: 'Had great and on time service here ... also Mr. Dilip was helpful and to get work done.',
    },
  ];

  const StarRating = ({ rating }) => (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <span key={i} className={i < rating ? 'text-yellow-400 text-lg' : 'text-gray-300 text-lg'}>
          ★
        </span>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-yellow-300 to-yellow-200 py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-black mb-2">
            About Laxmi Trade
          </h1>
          <p className="text-lg text-gray-700">Your trusted local stationery destination</p>
        </div>
      </section>

      {/* Shop Introduction */}
      <section className="py-12 sm:py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-50 rounded-lg p-8 sm:p-10 border border-gray-200 shadow-sm">
            <h2 className="text-3xl font-bold text-black mb-6">Welcome to Laxmi Trade</h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Laxmi Trade is your one-stop shop for premium stationery and office supplies in the heart of our community. 
                Since our inception, we have been committed to providing the finest quality products at affordable prices.
              </p>
              <p>
                Whether you're a student looking for the perfect notebook and pen, an artist searching for art supplies, 
                or a professional needing office essentials, we've got you covered. Our carefully curated collection includes:
              </p>
              <ul className="list-disc list-inside space-y-2 pl-2">
                <li><strong>Notebooks & Journals:</strong> Premium quality notebooks for every purpose</li>
                <li><strong>Writing Instruments:</strong> Pens, pencils, and markers from trusted brands</li>
                <li><strong>Art Supplies:</strong> Colors, sketchbooks, and art materials for creative minds</li>
                <li><strong>Gift Items:</strong> Unique and thoughtfully curated gift options</li>
                <li><strong>Office Essentials:</strong> Everything you need to stay organized and productive</li>
              </ul>
              <p>
                We pride ourselves on exceptional customer service, providing personalized recommendations and support 
                to make your shopping experience memorable. Visit us today and discover why Laxmi Trade is the preferred 
                choice for stationery lovers in the area!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 sm:py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-2">What Our Customers Say</h2>
            <p className="text-gray-600">Trusted by hundreds of happy customers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-200"
              >
                <StarRating rating={review.rating} />
                <p className="text-gray-700 mt-4 mb-4 leading-relaxed">{review.text}</p>
                <div className="border-t pt-3">
                  <p className="font-semibold text-black">{review.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Google Map Section */}
      <section className="py-12 sm:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-2">Visit Us</h2>
            <p className="text-gray-600">Find us at our convenient location</p>
          </div>

          <div className="rounded-lg overflow-hidden shadow-lg border border-gray-200">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.050606790613!2d72.82898877683472!3d19.14926194966532!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b79d5d989027%3A0x91dca50901f46d9a!2sLAXMI%20TRADE%20XEROX%20%26%20STATIONERY!5e0!3m2!1sen!2sin!4v1774284290923!5m2!1sen!2sin"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full"
            />
          </div>

          <div className="mt-8 bg-gray-50 rounded-lg p-6 sm:p-8 text-center border border-gray-200">
            <p className="text-gray-700 mb-2">
              <span className="font-semibold">📍 Location:</span> Laxmi Trade - Xerox & Stationery Shop
            </p>
            <p className="text-gray-600 mb-3">Visit us to explore our complete range of products and services at our convenient location in Mumbai.</p>
            <p className="text-sm text-gray-500">
              ⏰ <span className="font-semibold">Hours:</span> Monday - Sunday, 10 AM - 11 PM
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 px-4 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Shop?</h2>
          <p className="text-gray-300 mb-8">Browse our collection and find everything you need for your stationery needs.</p>
          <a
            href="/"
            className="inline-block bg-yellow-400 hover:bg-yellow-300 text-black font-semibold py-3 px-8 rounded-md transition"
          >
            Shop Now
          </a>
        </div>
      </section>
    </div>
  );
}
