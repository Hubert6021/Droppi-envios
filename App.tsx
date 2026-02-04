
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ShippingForm from './components/ShippingForm';
import Footer from './components/Footer';
import QuickCalculator from './components/QuickCalculator';

type ViewState = 'home' | 'shipping' | 'quoting';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('home');

  // Función para volver al inicio
  const goToHome = () => setView('home');
  const goToShipping = () => setView('shipping');
  const goToQuoting = () => setView('quoting');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* El Navbar siempre visible si no estamos en home, o siempre para consistencia */}
      <Navbar onHomeClick={goToHome} onShippingClick={goToShipping} onQuotingClick={goToQuoting} currentView={view} />
      
      <main className="flex-grow flex flex-col">
        {view === 'home' && (
          <Hero onSelectShipping={goToShipping} onSelectQuoting={goToQuoting} />
        )}

        {view === 'shipping' && (
          <div className="animate-fade-in py-8">
            <div className="max-w-7xl mx-auto px-4 mb-6">
              <button onClick={goToHome} className="text-blue-600 font-semibold flex items-center hover:underline">
                <i className="fas fa-arrow-left mr-2"></i> Volver al inicio
              </button>
            </div>
            <ShippingForm />
            <Footer />
          </div>
        )}

        {view === 'quoting' && (
          <div className="animate-fade-in">
             <div className="max-w-7xl mx-auto px-4 mt-8 mb-4">
              <button onClick={goToHome} className="text-blue-600 font-semibold flex items-center hover:underline">
                <i className="fas fa-arrow-left mr-2"></i> Volver al inicio
              </button>
            </div>
            <QuickCalculator />
            
            {/* Sección informativa solo en cotización para rellenar */}
            <section className="py-20 bg-white">
              <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-16">
                  <h2 className="text-3xl font-bold text-slate-900">Nuestras Ventajas</h2>
                  <div className="w-16 h-1 bg-blue-600 mx-auto mt-4"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
                      <i className="fas fa-truck-fast"></i>
                    </div>
                    <h3 className="font-bold text-lg mb-2">Envío Express</h3>
                    <p className="text-slate-500">Salidas diarias desde San José del Guaviare.</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
                      <i className="fas fa-shield-halved"></i>
                    </div>
                    <h3 className="font-bold text-lg mb-2">Seguro Incluido</h3>
                    <p className="text-slate-500">Tu mercancía protegida en todo momento.</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
                      <i className="fas fa-headset"></i>
                    </div>
                    <h3 className="font-bold text-lg mb-2">Soporte Real</h3>
                    <p className="text-slate-500">Atención personalizada vía WhatsApp.</p>
                  </div>
                </div>
              </div>
            </section>
            <Footer />
          </div>
        )}
      </main>

      {view === 'home' && (
        <div className="bg-white py-6 border-t border-slate-100">
           <p className="text-center text-slate-400 text-sm">© 2024 DroppiEnvio - San José del Guaviare</p>
        </div>
      )}
    </div>
  );
};

export default App;
