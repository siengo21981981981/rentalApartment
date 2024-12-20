import Router from "express";
import handlerasync from "express-async-handler";
import { userModel } from "../models/user";
import { user_sample } from "../data";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const app = Router();
app.get(
  "/seed",
  handlerasync(async (req, res) => {
    const userCount = await userModel.countDocuments();
    if (userCount > 0) {
      res.send("Seed is already done");
    }
    userModel.create(user_sample);
    res.send("Seed is NOT done");
  })
);
app.post(
  "/login",
  handlerasync(async (req, res) => {
    const { email, password } = req.body;
    const userInfo = await userModel.findOne({ email, password });

    console.log(userInfo);
    if (!userInfo) {
      res.status(400).send("Email or password is incorrect");
    }

    res.send(userInfo);
  })
);

app.post(
  "/register",
  handlerasync(async (req, res) => {
    const { email, password ,phone, name} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10)
    console.log(hashedPassword);
    const userInfo = await userModel.create({
      email,
      password: hashedPassword,
      phone,
      name,
    })
    const token = jwt.sign({ password }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    })
    userInfo.token = token
    res.send(userInfo);
  }))
app.post(
  "/update",
  handlerasync(async (req, res) => {
    const {
      email,
      phone,
      username,
      password,
      name,
      token,
      isLandlord,
      isadmin,
      properties,
    } = req.body;
    const userInfo = await userModel.findOneAndUpdate(
      { email },
      {
        phone,
        username,
        password,
        name,
        token,
        isLandlord,
        isadmin,
        properties,
      }
    );
    res.send(userInfo);
    if (!userInfo) {
      res.status(400).send("User not found");
    }
  })
);
app.post(
  "/updateRoom",
  handlerasync(async (req, res) => {
    try {
      const { id, properties } = req.body;
      
      const user = await userModel.findById(id);
      console.log(user);
      // 更新用戶數據
      const userInfo = await userModel.findOneAndUpdate(
        { _id: id }, // 查詢條件
        { $push: { properties: { $each: properties } } }, // 向 properties 數組中新增元素
        { new: true } // 返回更新後的數據
      );

      // 如果用戶未找到
      if (!userInfo) {
         res.status(404).json({ error: "用戶未找到" });
      }

      console.log("更新後的用戶信息：", userInfo);
      res.status(200).json(userInfo);
    } catch (err) {
      console.error("更新用戶數據時出錯：", err);
      res.status(500).json({ error: "服務器內部錯誤" });
    }
  })
);
app.post("/refresh",
  handlerasync(async (req, res) => {
    const _id = req.body.id
    
    const result = await userModel.findById({_id});
    res.send(result);
  })
)

export default app;
