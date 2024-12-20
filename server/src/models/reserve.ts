import { model, Schema, Types } from "mongoose";

// 預約介面與 schema
export interface reservation {
  _id: Types.ObjectId;
  client_id: Types.ObjectId; 
  room_title: string;
  landlord_id: Types.ObjectId;
  clientemail: string;
  contactphone: string;
  reservationtype: string;
  reservationtime: Date;
  message: string;
}

export const reservationSchema = new Schema<reservation>(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    client_id: { type: Schema.Types.ObjectId,}, 
    room_title: { type: String,},
    landlord_id: { type: Schema.Types.ObjectId,},
    clientemail: { type: String,},
    contactphone: { type: String,},
    reservationtype: { type: String,},
    reservationtime: { type: Date,},
    message: { type: String, maxlength: 500 }, 
  },
  {
    timestamps: true,
  }
);

export const reservationModel = model<reservation>(
  "reservation",
  reservationSchema
);
