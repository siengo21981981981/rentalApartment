import Router from "express";
import handlerasync from "express-async-handler";
import { roomInfo_sample } from "../data";

import { roomInfoModel } from "../models/roomInfo";
import imgurFileHandler from "../constants/module/imgurFileHandler";
import multer from "multer";

const app = Router();

app.get(
  "/seed",
  handlerasync(async (req, res) => {
    const roomInfoCount = await roomInfoModel.countDocuments();
    if (roomInfoCount > 0) {
      res.send("Seed is already done");
    }

    roomInfoModel.create(roomInfo_sample);
    res.send("Seed is done");
  })
);
app.get(
  "/get",
  handlerasync(async (req, res) => {
    const result = await roomInfoModel.find({});

    res.send(result);
  })
);

app.get(
  "/find",
  handlerasync(async (req, res) => {
    const id = req.query.id;
    const result = await roomInfoModel.findById(id);

    console.log(result);
    res.send(result);
  })
);

const upload = multer({ storage: multer.memoryStorage() }); //memoryStorage()將文件存儲在記憶體中
app.post("/uploadImg", upload.array("files", 3), async (req, res) => {
  const result = await imgurFileHandler(req);
  console.log("result", result);
  res.json(result);
});
app.post(
  "/upload",
  handlerasync(async (req, res) => {
    const result = req.body;
    const _id = (await roomInfoModel.create(result))._id;
    res.json({ _id });
  })
);

app.get(
  "/result",
  handlerasync(async (req, res) => {
    let { city, district, type, rent, floor, room, keyword } = req.query as {
      city?: string;
      district?: string;
      type?: string;
      rent?: string;
      floor?: string;
      room?: string;
      keyword?: string;
    };

    const query: any = {};

    // 加入有效的查詢條件

    if (district) {
      console.log("查詢的區域:", city);
      if (city) {
        query.city = city;
      }
      const districtArray = district.split(",").filter((d) => d.trim());
      if (districtArray.length) query.district = { $in: districtArray }; //$in is MongoDB operator to check if a value is in an array
    }
    if (type && type !== "undefined" && type !== "0") {
      query.type = type.trim(); //remove space
    }
    console.log(rent);
    if (rent) {
      const minRent = rent[0]; // 最小租金 0
      const maxRent = rent.slice(2, rent.length); // slice is used to remove the first two characters
      query.rent = { $gte: minRent, $lte: maxRent };
    }
    if (floor) {
      const minFloor = floor[0];
      const maxFloor = floor.slice(2, floor.length);
      query.floor = { $gte: minFloor, $lte: maxFloor };
    }
    if (room) {
      query.room = room.trim();
    }
    if (keyword) {
      query.title = { $regex: keyword };
    }

    console.log("最終查詢參數:", query);

    // 執行查詢
    if (Object.keys(query).length === 0) {
      res.send([]);
    } else {
      const result = await roomInfoModel.find(query);
      console.log("查詢結果:", result);
      if (result) {
        res.send(result.length ? result : null);
      } else {
        res.send([]);
      }
    }
  })
);

export default app;
