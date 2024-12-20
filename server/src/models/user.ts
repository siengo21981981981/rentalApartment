import { model, Schema, Types } from "mongoose";

// 使用者介面
export interface user {
  _id: Types.ObjectId;
  email: string;
  phone: string;
  username: string;
  password: string;
  name: string;
  token: string;
  isLandlord: boolean;
  isadmin: boolean;
  properties: Array<{ _id: string; title: string ,img_link: string}>;
}

// 定義 Schema
export const userSchema = new Schema<user>(
  { 
    _id: { type: Schema.Types.ObjectId, required: true, auto: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    username: { type: String },
    password: { type: String, required: true },
    name: { type: String, required: true },
    token: { type: String },
    isLandlord: { type: Boolean },
    isadmin: { type: Boolean },
    properties: [
      {
        _id: { type: String},
        title: { type: String },
        img_link: { type: Array },
      },
    ],
  },
  { timestamps: true }
);

export const userModel = model<user>("user", userSchema);
