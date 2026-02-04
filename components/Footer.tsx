
import React from 'react';

const Footer: React.FC = () => {
  const scrollToForm = () => {
    document.getElementById('form-container')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAction = (feature: string) => {
    alert(`${feature}: Esta funcionalidad estará disponible muy pronto en nuestra plataforma web. Por ahora, puedes consultarlo directamente vía WhatsApp.`);
    window.open('https://wa.me/573236369873', '_blank');
  };

  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-b border-slate-800 pb-12">
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="bg-blue-600 p-2 rounded-lg">
                <i className="fas fa-shipping-fast text-white text-xl"></i>
              </div>
              <span className="text-2xl font-bold tracking-tight">Droppi<span className="text-blue-400">Envio</span></span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              La empresa líder en mensajería y logística desde San José del Guaviare. Conectamos sueños y negocios con eficiencia y tecnología.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-6">Enlaces Rápidos</h4>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li><button onClick={() => handleAction('Rastrear Pedido')} className="hover:text-blue-400 transition text-left">Rastrear Pedido</button></li>
              <li><button onClick={scrollToForm} className="hover:text-blue-400 transition text-left">Precios por Ciudad</button></li>
              <li><button onClick={() => handleAction('Preguntas Frecuentes')} className="hover:text-blue-400 transition text-left">Preguntas Frecuentes</button></li>
              <li><button onClick={() => handleAction('Términos')} className="hover:text-blue-400 transition text-left">Términos y Condiciones</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Atención al Cliente</h4>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li>
                <a href="tel:+573236369873" className="flex items-center space-x-3 hover:text-blue-400 transition">
                  <i className="fas fa-phone-alt text-blue-400"></i>
                  <span>+57 323 636 9873</span>
                </a>
              </li>
              <li>
                <a href="https://wa.me/573236369873" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 hover:text-blue-400 transition">
                  <i className="fab fa-whatsapp text-blue-400 text-lg"></i>
                  <span>Chat en vivo 24/7</span>
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <i className="fas fa-map-marker-alt text-blue-400"></i>
                <span>San José del Guaviare, Colombia</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 flex flex-col md:flex-row justify-between items-center text-slate-500 text-xs">
          <p>© 2024 DroppiEnvio S.A.S. Todos los derechos reservados.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition"><i className="fab fa-facebook-f"></i></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition"><i className="fab fa-instagram"></i></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition"><i className="fab fa-twitter"></i></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
