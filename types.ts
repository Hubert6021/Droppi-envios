
export interface ShippingData {
  senderName: string;
  senderPhone: string;
  pickupAddress: string;
  pickupNeighborhood: string;
  receiverName: string;
  receiverPhone: string;
  deliveryAddress: string;
  deliveryCity: string; // Este campo ahora actuará como Departamento
  deliveryMunicipality: string; // Nuevo campo para el municipio
  packageDescription: string;
  packageType: 'sobre' | 'caja';
  weight: number;
}

export enum FormStep {
  ORIGIN = 'ORIGIN',
  DESTINATION = 'DESTINATION',
  DETAILS = 'DETAILS',
  CONFIRMATION = 'CONFIRMATION'
}
