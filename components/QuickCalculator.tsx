
import React, { useState, useEffect } from 'react';
import { estimateDistance } from '../services/geminiService';

const COLOMBIA_DATA: Record<string, string[]> = {
  "Amazonas": ["Leticia", "Puerto Nariño"],
  "Antioquia": ["Medellín", "Bello", "Itagüí", "Envigado", "Apartadó", "Rionegro", "Caucasia"],
  "Arauca": ["Arauca", "Tame", "Saravena", "Arauquita"],
  "Atlántico": ["Barranquilla", "Soledad", "Malambo", "Sabanalarga", "Puerto Colombia"],
  "Bolívar": ["Cartagena", "Magangué", "Turbaco", "El Carmen de Bolívar"],
  "Boyacá": ["Tunja", "Duitama", "Sogamoso", "Chiquinquirá", "Puerto Boyacá"],
  "Caldas": ["Manizales", "La Dorada", "Riosucio", "Villamaría"],
  "Caquetá": ["Florencia", "San Vicente del Caguán", "Puerto Rico", "Curillo"],
  "Casanare": ["Yopal", "Aguazul", "Villanueva", "Paz de Ariporo"],
  "Cauca": ["Popayán", "Santander de Quilichao", "Puerto Tejada", "Patía"],
  "Cesar": ["Valledupar", "Aguachica", "Agustín Codazzi", "Bosconia"],
  "Chocó": ["Quibdó", "Istmina", "Condoto", "Bahía Solano"],
  "Córdoba": ["Montería", "Cereté", "Lorica", "Sahagún", "Montelíbano"],
  "Cundinamarca": ["Bogotá D.C.", "Soacha", "Chía", "Facatativá", "Zipaquirá", "Fusagasugá", "Girardot"],
  "Guainía": ["Inírida"],
  "Guaviare": ["San José del Guaviare", "Calamar", "El Retorno", "Miraflores"],
  "Huila": ["Neiva", "Pitalito", "Garzón", "La Plata"],
  "La Guajira": ["Riohacha", "Maicao", "Uribia", "Manaure", "San Juan del Cesar"],
  "Magdalena": ["Santa Marta", "Ciénaga", "Fundación", "El Banco"],
  "Meta": ["Villavicencio", "Puerto Concordia", "Acacías", "Granada", "Puerto López", "Cumaral", "San Martín"],
  "Nariño": ["Pasto", "Tumaco", "Ipiales", "Túquerres"],
  "Norte de Santander": ["Cúcuta", "Ocaña", "Villa del Rosario", "Los Patios", "Pamplona"],
  "Putumayo": ["Mocoa", "Puerto Asís", "Orito", "Sibundoy"],
  "Quindío": ["Armenia", "Calarcá", "Montenegro", "Quimbaya"],
  "Risaralda": ["Pereira", "Dosquebradas", "Santa Rosa de Cabal", "La Virginia"],
  "San Andrés": ["San Andrés", "Providencia"],
  "Santander": ["Bucaramanga", "Floridablanca", "Girón", "Piedecuesta", "Barrancabermeja"],
  "Sucre": ["Sincelejo", "Corozal", "San Marcos", "Tolú"],
  "Tolima": ["Ibagué", "Espinal", "Melgar", "Mariquita", "Líbano"],
  "Valle del Cauca": ["Cali", "Buenaventura", "Palmira", "Tuluá", "Buga", "Cartago", "Jamundí"],
  "Vaupés": ["Mitú"],
  "Vichada": ["Puerto Carreño", "La Primavera", "Cumaribo"]
};

const QuickCalculator: React.FC = () => {
  const [dept, setDept] = useState('');
  const [muni, setMuni] = useState('');
  const [type, setType] = useState<'sobre' | 'caja'>('sobre');
  const [weight, setWeight] = useState(1);
  const [result, setResult] = useState<{ distance: number; cost: number } | null>(null);
  const [loading, setLoading] = useState(false);

  const departments = Object.keys(COLOMBIA_DATA).sort();
  const municipalities = dept ? COLOMBIA_DATA[dept] || [] : [];

  const handleCalculate = async () => {
    if (!dept || !muni) return;
    setLoading(true);
    const location = `${muni}, ${dept}`;
    const res = await estimateDistance(location);
    
    const baseCost = res.distanceKm * 100;
    let surcharge = 0;
    if (type === 'caja') {
      surcharge = baseCost * (0.10 * weight);
    }

    setResult({
      distance: res.distanceKm,
      cost: Math.round(baseCost + surcharge)
    });
    setLoading(false);
  };

  const scrollToForm = () => {
    const form = document.getElementById('form-container');
    if (form) {
      form.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="calculator-section" className="py-16 bg-blue-600 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <i className="fas fa-truck text-9xl absolute -bottom-10 -left-10 rotate-12"></i>
        <i className="fas fa-box text-9xl absolute -top-10 -right-10 -rotate-12"></i>
      </div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Calculadora de Tarifas</h2>
          <p className="text-blue-100 text-lg">Cotiza tu envío al instante desde San José del Guaviare</p>
        </div>

        <div className="bg-white rounded-[2rem] shadow-2xl p-8 md:p-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Departamento</label>
                <select 
                  value={dept} 
                  onChange={(e) => { setDept(e.target.value); setMuni(''); setResult(null); }}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-blue-500 outline-none transition bg-slate-50 font-medium"
                >
                  <option value="">Seleccionar...</option>
                  {departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Municipio</label>
                <select 
                  disabled={!dept}
                  value={muni} 
                  onChange={(e) => { setMuni(e.target.value); setResult(null); }}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-blue-500 outline-none transition bg-slate-50 font-medium disabled:opacity-50"
                >
                  <option value="">Seleccionar...</option>
                  {municipalities.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>

            <div className="flex space-x-4">
              <button 
                onClick={() => { setType('sobre'); setResult(null); }}
                className={`flex-1 py-4 rounded-2xl border-2 transition-all flex flex-col items-center ${type === 'sobre' ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-md scale-105' : 'border-slate-100 text-slate-400 hover:border-blue-200'}`}
              >
                <i className="fas fa-envelope text-xl mb-1"></i>
                <span className="font-bold text-xs">SOBRE</span>
              </button>
              <button 
                onClick={() => { setType('caja'); setResult(null); }}
                className={`flex-1 py-4 rounded-2xl border-2 transition-all flex flex-col items-center ${type === 'caja' ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-md scale-105' : 'border-slate-100 text-slate-400 hover:border-blue-200'}`}
              >
                <i className="fas fa-box text-xl mb-1"></i>
                <span className="font-bold text-xs">CAJA</span>
              </button>
            </div>

            {type === 'caja' && (
              <div className="animate-fade-in">
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Peso (Kg)</label>
                <div className="relative">
                  <input 
                    type="range" min="1" max="50" value={weight} 
                    onChange={(e) => { setWeight(parseInt(e.target.value)); setResult(null); }}
                    className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between mt-2 text-xs font-bold text-blue-600">
                    <span>1 Kg</span>
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full">{weight} Kg</span>
                    <span>50 Kg</span>
                  </div>
                </div>
              </div>
            )}

            <button 
              onClick={handleCalculate}
              disabled={!muni || loading}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-lg hover:bg-slate-800 transition transform active:scale-[0.98] disabled:opacity-50 flex items-center justify-center space-x-3"
            >
              {loading ? (
                <i className="fas fa-circle-notch fa-spin"></i>
              ) : (
                <>
                  <i className="fas fa-calculator"></i>
                  <span>CALCULAR TARIFA</span>
                </>
              )}
            </button>
          </div>

          <div className="flex flex-col items-center justify-center border-l-0 lg:border-l-2 border-slate-50 lg:pl-10 h-full min-h-[300px]">
            {result ? (
              <div className="text-center animate-fade-in w-full">
                <p className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-2">Precio Estimado</p>
                <div className="text-6xl md:text-7xl font-black text-slate-900 mb-6 flex items-start justify-center">
                  <span className="text-2xl mt-4 mr-1 text-blue-600">$</span>
                  {result.cost.toLocaleString('es-CO')}
                </div>
                
                <div className="bg-blue-50 rounded-2xl p-6 mb-8 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Distancia</p>
                    <p className="text-xl font-black text-blue-900">{result.distance} Km</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Destino</p>
                    <p className="text-xl font-black text-blue-900 truncate">{muni}</p>
                  </div>
                </div>

                <button 
                  onClick={scrollToForm}
                  className="group w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-blue-700 transition shadow-xl shadow-blue-200 flex items-center justify-center space-x-3"
                >
                  <span>PROGRAMAR RECOGIDA</span>
                  <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                </button>
              </div>
            ) : (
              <div className="text-center text-slate-300">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-slate-200">
                  <i className="fas fa-dollar-sign text-4xl"></i>
                </div>
                <p className="font-bold text-lg">Ingresa los datos para ver el precio</p>
                <p className="text-sm">Tarifa basada en distancia real por carretera</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuickCalculator;
