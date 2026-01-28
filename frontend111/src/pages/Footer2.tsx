const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white p-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-yellow-400">Elegant Era</h3>
            <p className="text-gray-400">
              Quality products for everyone. Fast delivery and excellent customer service.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-red-600">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-yellow-400 transition">Home</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition">Products</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition">About Us</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition">Contact</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-red-600">Contact Us</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Email: info@yourshop.com</li>
              <li>Phone: (123) 456-7890</li>
              <li>Address: 123 ElegantEra Street,Indore</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-500">
          <p>© {new Date().getFullYear()} YourShop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;