import { Types } from 'mongoose';
export class User {
  _id!: Types.ObjectId;
  email!: string;
  phone!: string;
  username!: string;
  password!: string;
  name!: string;
  birthday!: string;
  token!: string;
  isLandlord!: boolean;
  isadmin!: boolean;
  properties!: Array<{_id: string; title: string ,img_link:string[]}>;//room id

 
}
