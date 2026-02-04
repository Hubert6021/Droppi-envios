
import React, { useState, useEffect, useMemo } from 'react';
import { ShippingData } from '../types';
import { getShippingAdvice, estimateDistance } from '../services/geminiService';

const GUAVIARE_NEIGHBORHOODS = [
  "El Modelo", "El Porvenir", "San Jorge", "Bicentenario", "La Esperanza", 
  "Divino Niño", "El Dorado", "El Centro", "Bello Horizonte", "Primero de Mayo", 
  "Villa Andrea", "Santo Domingo", "Brisas del Guaviare", "Arazá", 
  "Veinte de Julio", "Ciudad de Dios", "Montecarlos", "La Granja", 
  "San José", "Villa Luz", "Gaitán", "Olimpico", "Comuneros", "La Paz", 
  "Puerto Arturo", "El Resbalón"
];

// Base de datos de departamentos y municipios principales de Colombia
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

const ShippingForm: React.FC = () => {
  const [formData, setFormData] = useState<ShippingData>({
    senderName: '',
    senderPhone: '',
    pickupAddress: '',
    pickupNeighborhood: '',
    receiverName: '',
    receiverPhone: '',
    deliveryAddress: '',
    deliveryCity: '',
    deliveryMunicipality: '',
    packageDescription: '',
    packageType: 'sobre',
    weight: 1
  });

  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  
  const [distanceInfo, setDistanceInfo] = useState<{ distance: number; cost: number; base: number; surcharge: number } | null>(null);
  const [loadingCost, setLoadingCost] = useState(false);

  // Obtener departamentos únicos
  const departments = useMemo(() => Object.keys(COLOMBIA_DATA).sort(), []);
  
  // Obtener municipios basados en el departamento seleccionado
  const municipalities = useMemo(() => {
    return formData.deliveryCity ? COLOMBIA_DATA[formData.deliveryCity] || [] : [];
  }, [formData.deliveryCity]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Si cambia el departamento, resetear el municipio
    if (name === 'deliveryCity') {
      setFormData(prev => ({ 
        ...prev, 
        deliveryCity: value,
        deliveryMunicipality: '' 
      }));
    } else {
      setFormData(prev => ({ 
        ...prev, 
        [name]: name === 'weight' ? (parseFloat(value) || 0) : value 
      }));
    }
  };

  useEffect(() => {
    const calculate = async () => {
      // Necesitamos departamento y municipio para una cotización exacta
      if (formData.deliveryCity && formData.deliveryMunicipality) {
        setLoadingCost(true);
        const locationQuery = `${formData.deliveryMunicipality}, ${formData.deliveryCity}`;
        const res = await estimateDistance(locationQuery);
        
        const baseCost = res.distanceKm * 100;
        let surcharge = 0;
        
        if (formData.packageType === 'caja') {
          surcharge = baseCost * (0.10 * formData.weight);
        }

        setDistanceInfo({ 
          distance: res.distanceKm, 
          cost: Math.round(baseCost + surcharge),
          base: baseCost,
          surcharge: surcharge
        });
        setLoadingCost(false);
      } else {
        setDistanceInfo(null);
      }
    };

    const timer = setTimeout(calculate, 800);
    return () => clearTimeout(timer);
  }, [formData.deliveryCity, formData.deliveryMunicipality, formData.packageType, formData.weight]);

  const handleAskAI = async () => {
    if (!formData.packageDescription) return;
    setLoadingAdvice(true);
    const advice = await getShippingAdvice(formData.packageDescription);
    setAiAdvice(advice);
    setLoadingAdvice(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const weightText = formData.packageType === 'caja' ? ` (Peso: ${formData.weight} kg)` : '';
    const costText = distanceInfo ? `*COSTO ESTIMADO:* $${distanceInfo.cost.toLocaleString('es-CO')} COP%0A(Distancia: ${distanceInfo.distance} km${weightText})%0A` : '';

    const message = `🚀 *NUEVA SOLICITUD DE ENVÍO* 🚀%0A%0A` +
      `*TIPO:* ${formData.packageType.toUpperCase()}${weightText}%0A%0A` +
      `*ORIGEN (GUAVIARE)*%0A` +
      `• Nombre: ${formData.senderName}%0A` +
      `• Teléfono: ${formData.senderPhone}%0A` +
      `• Dirección: ${formData.pickupAddress}%0A` +
      `• Barrio: ${formData.pickupNeighborhood}%0A%0A` +
      `*DESTINO (COLOMBIA)*%0A` +
      `• Recibe: ${formData.receiverName}%0A` +
      `• Teléfono: ${formData.receiverPhone}%0A` +
      `• Depto: ${formData.deliveryCity}%0A` +
      `• Municipio: ${formData.deliveryMunicipality}%0A` +
      `• Dirección: ${formData.deliveryAddress}%0A%0A` +
      `*CONTENIDO:* ${formData.packageDescription}%0A%0A` +
      costText +
      `_Tarifa: $100/km ${formData.packageType === 'caja' ? '+ 10% de recargo por kilo' : ''}_`;

    const whatsappUrl = `https://wa.me/573236369873?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const inputStyles = "w-full px-4 py-2 rounded-xl border border-slate-300 bg-white text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition placeholder:text-slate-400 disabled:bg-slate-50 disabled:text-slate-400";

  return (
    <section id="form-container" className="py-12 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-3xl shadow-xl border border-blue-50 overflow-hidden">
          <div className="bg-blue-600 px-8 py-6 text-white flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Coordina tu Envío</h2>
              <p className="text-blue-100 mt-1">Cotización y solicitud inmediata.</p>
            </div>
            <div className="hidden sm:block text-right">
              <span className="text-xs font-bold uppercase tracking-wider opacity-75">Tarifa Oficial</span>
              <p className="font-bold text-xl">$100/km + 10% x Kg</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            
            {/* TIPO DE PAQUETE */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-blue-700 font-bold border-b border-blue-100 pb-2">
                <i className="fas fa-box-open"></i>
                <h3>¿QUÉ VAS A ENVIAR?</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex space-x-4">
                  <button 
                    type="button" 
                    onClick={() => setFormData(p => ({...p, packageType: 'sobre'}))}
                    className={`flex-1 py-4 px-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center space-y-2 ${formData.packageType === 'sobre' ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-md' : 'border-slate-200 text-slate-500 hover:border-blue-200'}`}
                  >
                    <i className="fas fa-envelope text-2xl"></i>
                    <span className="font-bold">Sobre</span>
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setFormData(p => ({...p, packageType: 'caja'}))}
                    className={`flex-1 py-4 px-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center space-y-2 ${formData.packageType === 'caja' ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-md' : 'border-slate-200 text-slate-500 hover:border-blue-200'}`}
                  >
                    <i className="fas fa-box text-2xl"></i>
                    <span className="font-bold">Caja</span>
                  </button>
                </div>
                {formData.packageType === 'caja' && (
                  <div className="animate-fade-in">
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Peso en Kilogramos</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        name="weight" 
                        min="1"
                        step="0.5"
                        value={formData.weight} 
                        onChange={handleChange} 
                        className={`${inputStyles} pr-12`} 
                        placeholder="Ej. 5" 
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-600 font-bold">Kg</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* RECOGIDA */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-blue-700 font-bold border-b border-blue-100 pb-2">
                <i className="fas fa-map-marker-alt"></i>
                <h3>RECOGIDA (SAN JOSÉ DEL GUAVIARE)</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Nombre Remitente</label>
                  <input required name="senderName" value={formData.senderName} onChange={handleChange} className={inputStyles} placeholder="Quién envía" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Teléfono</label>
                  <input required name="senderPhone" value={formData.senderPhone} onChange={handleChange} className={inputStyles} placeholder="3XX XXX XXXX" />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Dirección de Recogida</label>
                  <input required name="pickupAddress" value={formData.pickupAddress} onChange={handleChange} className={inputStyles} placeholder="Calle, Carrera, Casa..." />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Barrio</label>
                  <input required list="neighborhoods" name="pickupNeighborhood" value={formData.pickupNeighborhood} onChange={handleChange} className={inputStyles} placeholder="Selecciona el barrio" />
                  <datalist id="neighborhoods">
                    {GUAVIARE_NEIGHBORHOODS.map((n, i) => <option key={i} value={n} />)}
                  </datalist>
                </div>
              </div>
            </div>

            {/* DESTINO DINÁMICO */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center space-x-2 text-blue-700 font-bold border-b border-blue-100 pb-2">
                <i className="fas fa-paper-plane"></i>
                <h3>DESTINO (A TODA COLOMBIA)</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Departamento */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Departamento Destino</label>
                  <select 
                    required 
                    name="deliveryCity" 
                    value={formData.deliveryCity} 
                    onChange={handleChange} 
                    className={inputStyles}
                  >
                    <option value="">Selecciona Departamento</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                {/* Municipio Dinámico */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Municipio Destino</label>
                  <select 
                    required 
                    name="deliveryMunicipality" 
                    value={formData.deliveryMunicipality} 
                    onChange={handleChange} 
                    className={inputStyles}
                    disabled={!formData.deliveryCity}
                  >
                    <option value="">Selecciona Municipio</option>
                    {municipalities.map((muni) => (
                      <option key={muni} value={muni}>{muni}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Dirección de Entrega</label>
                  <input required name="deliveryAddress" value={formData.deliveryAddress} onChange={handleChange} className={inputStyles} placeholder="Dirección completa" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Recibe</label>
                    <input required name="receiverName" value={formData.receiverName} onChange={handleChange} className={inputStyles} placeholder="Nombre" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Teléfono</label>
                    <input required name="receiverPhone" value={formData.receiverPhone} onChange={handleChange} className={inputStyles} placeholder="Celular" />
                  </div>
                </div>
              </div>

              {/* RESUMEN DE COSTOS */}
              <div className="mt-6">
                {loadingCost ? (
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-center space-x-3 text-blue-600 animate-pulse">
                    <i className="fas fa-sync fa-spin"></i>
                    <span className="font-medium">Calculando ruta oficial...</span>
                  </div>
                ) : distanceInfo ? (
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl p-6 shadow-lg transform transition-all hover:scale-[1.01]">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-blue-100 text-xs font-bold uppercase tracking-wider mb-1">Valor Total Estimado</p>
                        <p className="text-3xl font-black">${distanceInfo.cost.toLocaleString('es-CO')} <span className="text-sm font-medium opacity-80">COP</span></p>
                      </div>
                      <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                        <i className="fas fa-truck-moving text-2xl"></i>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
                      <div className="text-sm">
                        <p className="opacity-70 text-xs">Ubicación</p>
                        <p className="font-bold truncate">{formData.deliveryMunicipality}</p>
                      </div>
                      <div className="text-sm text-right">
                        <p className="opacity-70 text-xs">Distancia</p>
                        <p className="font-bold">{distanceInfo.distance} Km</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  formData.deliveryCity && !formData.deliveryMunicipality && (
                    <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl text-center text-blue-600 text-sm">
                      <i className="fas fa-arrow-left mr-2"></i> Por favor selecciona un <strong>municipio</strong> para cotizar.
                    </div>
                  )
                )}
              </div>
            </div>

            {/* DESCRIPCION */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center space-x-2 text-blue-700 font-bold border-b border-blue-100 pb-2">
                <i className="fas fa-info-circle"></i>
                <h3>¿QUÉ LLEVA EL PAQUETE?</h3>
              </div>
              <div className="relative">
                <textarea 
                  name="packageDescription" 
                  value={formData.packageDescription} 
                  onChange={handleChange} 
                  rows={2} 
                  className={`${inputStyles} py-3 pr-12`} 
                  placeholder="Ej. Una caja con zapatos, sobres de documentos..." 
                />
                <button 
                  type="button" 
                  onClick={handleAskAI} 
                  disabled={loadingAdvice || !formData.packageDescription} 
                  className="absolute bottom-3 right-3 p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
                >
                  {loadingAdvice ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-magic"></i>}
                </button>
              </div>
              {aiAdvice && (
                <div className="mt-2 p-3 bg-blue-50 rounded-xl border border-blue-100 text-[13px] text-blue-800 flex items-start space-x-2 animate-fade-in">
                  <i className="fas fa-lightbulb text-blue-500 mt-1"></i>
                  <p>{aiAdvice}</p>
                </div>
              )}
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-blue-700 transition transform active:scale-[0.98] shadow-2xl shadow-blue-200 flex items-center justify-center space-x-4">
              <span>SOLICITAR POR WHATSAPP</span>
              <i className="fab fa-whatsapp text-2xl"></i>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ShippingForm;
