import { Types } from "mongoose";

export class ReserveMessage {
    _id!: Types.ObjectId;
    room_title!: string;
    client_id!: Types.ObjectId;
    landlord_id!: Types.ObjectId;
    contactphone!: string;
    email!: string;
    reservationtype!: string;
    reservationtime!: Date;
    message!: string;
}
