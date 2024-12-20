import Router from "express";
import handlerasync from "express-async-handler";
import { reservationModel } from "../models/reserve";
import { reservation_sample } from "../data";
import { Types, Mongoose } from "mongoose";
import { userModel } from "../models/user";
const app = Router();
app.get(
  "/seed",
  handlerasync(async (req, res) => {
    const reservationCount = await reservationModel.countDocuments();
    if (reservationCount > 0) {
      res.send("Seed is already done");
    }
    reservationModel.create(reservation_sample);
    res.send("Seed is done");
  })
);

app.post(
  "/getReserve",
  handlerasync(async (req, res) => {
    const user_id = req.body.user_id;
    try {
      // Find reservations for the user
      const result = await reservationModel.find({ client_id: user_id });
      
      // Get unique landlord IDs using a Set to remove duplicates
      const landlordIds = result.map((reservation) => reservation.landlord_id);
      
      // Find all landlords in a single query
      const landlords = (await userModel.find({ _id: { $in: landlordIds } }));
      
      console.log('Reservations:', result);
      console.log('Landlords:', landlords);
      
      res.send({ 
        reservation: result, 
        landlords: landlords 
      });
    } catch (error) {
      console.error('Error in getReserve:', error);
      res.status(400).send({ message: "Invalid user ID" });
    }
  })
);
app.post(
  "/upload",
  handlerasync(async (req, res) => {
    console.log(req.body);

    const result = await reservationModel.create(req.body);
    res.status(200).send(result);
  })
);
export default app;
