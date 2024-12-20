import ImgurClient from "imgur";

const client = new ImgurClient({
  clientId: process.env.IMGUR_CLIENT_ID,
  clientSecret: process.env.IMGUR_CLIENT_SECRET,
  accessToken: process.env.IMGUR_ACCESS_TOKEN,
});

const imgurFileHandler = (req: any) => {
  const imageUrl: string[] = [];
  
  // 確保有檔案被上傳
  if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
    console.log("No files to upload");
    return Promise.reject("Invalid file upload");
  }

  return new Promise((resolve, reject) => {
    // 遍歷所有檔案進行上傳
    const uploadPromises = req.files.map((file: any, index: number) => {
      if (!Buffer.isBuffer(file.buffer)) {
        return Promise.reject("Invalid file upload");
      }

      return client.upload({
        image: file.buffer.toString("base64"),
        type: "base64",
      })
      .then((img) => {
        imageUrl.push(img?.data?.link);

        // 如果是第一張圖片，立即返回該圖片的 URL
        if (index === 0) {
          console.log("First Image URL:", img?.data?.link);
           // 這裡返回的是第一張圖片的 URL
        }
      })
      .catch((err) => {
        reject(err);
      });
    });

    // 確保所有圖片都上傳完成
    Promise.all(uploadPromises)
      .then(() => {
        console.log("All Image URLs:", imageUrl);
        
         resolve(imageUrl);
      })
      .catch((err) => {
        reject("Error uploading images: " + err);
      });
  });
};

export default imgurFileHandler;
