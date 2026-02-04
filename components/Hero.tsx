
import React from 'react';

interface HeroProps {
  onSelectShipping: () => void;
  onSelectQuoting: () => void;
}

const Hero: React.FC<HeroProps> = ({ onSelectShipping, onSelectQuoting }) => {
  return (
    <div className="flex-grow flex flex-col items-center justify-center relative bg-white px-4 py-12 overflow-hidden min-h-[calc(100vh-64px)]">
      <div className="max-w-4xl w-full text-center z-10 animate-fade-in">
        <div className="inline-block px-4 py-1.5 mb-6 bg-blue-50 text-blue-600 rounded-full text-sm font-bold tracking-wide uppercase">
          Logística desde Guaviare para el mundo
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-tight mb-8">
          ¿Qué deseas hacer <br />
          <span className="text-blue-600">hoy?</span>
        </h1>
        
        <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
          Selecciona una de nuestras opciones para comenzar. Conectamos San José del Guaviare con cualquier municipio de Colombia.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Opción Enviar */}
          <button 
            onClick={onSelectShipping}
            className="group flex flex-col items-center p-10 bg-blue-600 rounded-[2.5rem] text-white shadow-2xl shadow-blue-200 transition-all hover:scale-[1.03] hover:bg-blue-700 active:scale-95 text-center"
          >
            <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mb-6 backdrop-blur-md group-hover:rotate-6 transition-transform">
              <i className="fas fa-paper-plane text-4xl"></i>
            </div>
            <h2 className="text-2xl font-bold mb-2">Realizar Envío</h2>
            <p className="text-blue-100 text-sm">Solicita la recogida de tu paquete a domicilio ahora mismo.</p>
            <div className="mt-6 flex items-center font-bold text-sm bg-white/10 px-4 py-2 rounded-full">
              Empezar <i className="fas fa-chevron-right ml-2 text-xs"></i>
            </div>
          </button>
          
          {/* Opción Cotizar */}
          <button 
            onClick={onSelectQuoting}
            className="group flex flex-col items-center p-10 bg-white border-2 border-blue-600 rounded-[2.5rem] text-blue-600 shadow-xl shadow-slate-100 transition-all hover:scale-[1.03] hover:bg-blue-50 active:scale-95 text-center"
          >
            <div className="w-20 h-20 bg-blue-100 rounded-3xl flex items-center justify-center mb-6 group-hover:-rotate-6 transition-transform">
              <i className="fas fa-calculator text-4xl"></i>
            </div>
            <h2 className="text-2xl font-bold mb-2">Cotizar Precio</h2>
            <p className="text-slate-500 text-sm">Calcula el costo de tu envío basado en la distancia y el peso.</p>
            <div className="mt-6 flex items-center font-bold text-sm bg-blue-600 text-white px-4 py-2 rounded-full">
              Calcular <i className="fas fa-chevron-right ml-2 text-xs"></i>
            </div>
          </button>
        </div>

        <div className="mt-16 flex justify-center space-x-12 grayscale opacity-40">
           <div className="flex items-center space-x-2"><i className="fas fa-truck text-2xl"></i> <span className="font-bold">Seguridad</span></div>
           <div className="flex items-center space-x-2"><i className="fas fa-clock text-2xl"></i> <span className="font-bold">Rapidez</span></div>
           <div className="flex items-center space-x-2"><i className="fas fa-location-dot text-2xl"></i> <span className="font-bold">Cobertura</span></div>
        </div>
      </div>
      
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-blue-50 rounded-full blur-[120px] opacity-60"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-50 rounded-full blur-[120px] opacity-60"></div>
    </div>
  );
};

export default Hero;
