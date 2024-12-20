import { Types } from 'mongoose';

export interface roomInfo {
  _id: Types.ObjectId;
  title: string;
  rent: number;
  type: string;
  city: string;
  district: string;
  street_number: string;
  description: string;
  ownership_registration: boolean;
  has_window: boolean;
  material: string;
  floor: string;
  legal_use: string;
  orientation: string;
  area: number;
  short_term_rent: true;
  deposit: number;
  parking: true;
  parking_description: string;
  management_method: true;
  management_fee: number | null;
  equipment: string;
  special_features: string;
  map_url: string;
  nearby_schools: string;
  nearby_markets: string;
  nearby_parks: string;
  nearby_transportation: string;
  images: String[];
  contact_info: {
    phone: string;
    line_id: string;
  };
  [key: string]: any;
  landlord_id: Types.ObjectId;
}
