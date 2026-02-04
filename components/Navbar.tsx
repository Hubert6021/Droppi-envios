
import React from 'react';

interface NavbarProps {
  onHomeClick: () => void;
  onShippingClick: () => void;
  onQuotingClick: () => void;
  currentView: string;
}

const Navbar: React.FC<NavbarProps> = ({ onHomeClick, onShippingClick, onQuotingClick, currentView }) => {
  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-blue-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo / Home Button */}
          <div 
            className="flex items-center space-x-2 cursor-pointer group" 
            onClick={onHomeClick}
          >
            <div className="bg-blue-600 p-2 rounded-lg group-hover:scale-110 transition-transform">
              <i className="fas fa-shipping-fast text-white text-xl"></i>
            </div>
            <span className="text-xl font-bold text-blue-900 tracking-tight">
              Droppi<span className="text-blue-500">Envio</span>
            </span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8 text-sm font-bold uppercase tracking-wider">
            <button 
              onClick={onHomeClick} 
              className={`transition outline-none ${currentView === 'home' ? 'text-blue-600' : 'text-slate-500 hover:text-blue-600'}`}
            >
              Inicio
            </button>
            <button 
              onClick={onShippingClick} 
              className={`transition outline-none ${currentView === 'shipping' ? 'text-blue-600' : 'text-slate-500 hover:text-blue-600'}`}
            >
              Realizar Envío
            </button>
            <button 
              onClick={onQuotingClick} 
              className={`transition outline-none ${currentView === 'quoting' ? 'text-blue-600' : 'text-slate-500 hover:text-blue-600'}`}
            >
              Cotizar
            </button>
          </div>

          {/* WhatsApp Button */}
          <div className="flex items-center">
            <a 
              href="https://wa.me/573236369873" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-blue-600 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100 flex items-center transform hover:scale-105"
            >
              <i className="fab fa-whatsapp mr-2 text-base"></i> <span className="hidden sm:inline">WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
