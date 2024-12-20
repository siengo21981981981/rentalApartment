import { model, Schema, Types } from "mongoose";

export interface roomInfo {
  _id: Types.ObjectId;
  title: string;
  landlord: Types.ObjectId;
  type: string;
  rent: number;
  description: string;
  city: string;
  district: string;
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
  images: string[]
    
  contact_info: {
    phone: string;
    line_id: string;
  };
  
}
export const roomInfoSchema = new Schema<roomInfo>(
  {
    _id: { type: Schema.Types.ObjectId, required: true, auto: true }, 
    title: { type: String, required: true },
    landlord:{ type: Schema.Types.ObjectId},
    rent: { type: Number },
    type: { type: String },
    description: { type: String },
    city: { type: String, required: true },
    district: { type: String, required: true },
    ownership_registration: { type: Boolean },
    has_window: { type: Boolean },
    material: { type: String },
    floor: { type: String, required: true },
    legal_use: { type: String },
    orientation: { type: String },
    area: { type: Number },
    short_term_rent: { type: Boolean },
    deposit: { type: Number },
    parking: { type: Boolean },
    parking_description: { type: String },
    management_method: { type: Boolean },
    management_fee: { type: Number, default: null },
    equipment: { type: String },
    special_features: { type: String },
    map_url: { type: String },
    nearby_schools: { type: String },
    nearby_markets: { type: String },
    nearby_parks: { type: String },
    nearby_transportation: { type: String },
    images: { type: [String],required: true },
    contact_info: {
      phone: { type: String, require: true },
      line_id: { type: String },
    },
    
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  }
);
export const roomInfoModel = model<roomInfo>("roomInfo", roomInfoSchema);
