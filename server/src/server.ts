import { dbConnect } from "./configs/mongodb";
import cors from "cors";
import express from "express";
import roomInfoRouter from "./routers/roomInfo";
import userRouter from "./routers/user";
import reserveRouter from './routers/reserve';
import crypto from "crypto";
import { GridFsStorage } from "multer-gridfs-storage";
dbConnect();
const app = express();
const port = "3000";

const corsOptions = {
  origin: "http://localhost:4200",
  optionsSuccessStatus: 204,
  metends: "GET,POST,PUT,DELETE",
};

const path = require("path");

var storage = new GridFsStorage({
  url: process.env.MONGODB_URL!,
  file: (req: any, file: { originalname: any }) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "uploads",
        };
        resolve(fileInfo);
      });
    });
  },
});

app.use(cors(corsOptions));
app.use(express.json());

// Image retrieval route using GridFS

app.use("/api/roomInfo", roomInfoRouter);
app.use("/api/user", userRouter);
app.use("/api/reserve", reserveRouter);
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
